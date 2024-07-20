import { Request, Response } from 'express';
import WayForPayService from '../service/paymentService';
import Booking from '../model/Booking';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

const wfp = new WayForPayService()

const createWayForPayForm = async (req: Request, res: Response) => {
    console.log('Generating WayForPay form...')

    const currency = req.query.currency as string;
    const productName = req.query.productName as string[];
    const productCount = (req.query.productCount as string[]).map(count => parseInt(count));
    const bookingId = req.query.bookingId as string;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            console.log('Fail at createWayForPayForm controller: booking with this ID not found')
            res.status(404).send({ message: 'Booking with this ID not found' })
        }

        const form = await wfp.createPaymentForm({
            currency,
            productName,
            productCount,
            orderReference: booking?.orderReference,
        })

        console.log('WayForPay form has been created.')
        res.status(200).send(form)
    } catch (e: any) {
        console.log('Fail at createWayForPayForm controller: WFP server issue')
        throw new Error('WayForPay server issue: ' + e.message)
    }
}

const handleWayForPayStatus = async (req: Request, res: Response) => {
    console.log('Response from WayForPay received...')

    let requestBody = req.body;

    if (typeof requestBody === 'object' && Object.keys(requestBody).length === 1 && typeof Object.keys(requestBody)[0] === 'string') {
        const parsedKey = Object.keys(requestBody)[0];
        try {
            requestBody = JSON.parse(parsedKey);
        } catch (error) {
            console.error('Failed to parse JSON from request body key:', parsedKey);
            return res.status(400).send('Invalid JSON in request body');
        }
    }

    const { orderReference, transactionStatus, reasonCode, merchantSignature } = requestBody;
    const time: number = Math.floor(Date.now() / 1000);

    try {
        const booking = await Booking.findOne({ orderReference });
        if (!booking) {
            console.log('Fail at handleWayForPayStatus: Booking with this oid not found', orderReference);
            return res.status(404).send('Booking not found');
        }

        if (booking.paymentStatus === 'Approved') {
            return res.status(200).json({
                orderReference,
                status: "accept",
                time,
                signature: merchantSignature
            });
        }

        booking.paymentStatus = transactionStatus;
        booking.reasonCode = reasonCode;
        await booking.save();

        if (transactionStatus === 'Approved') {
            const formattedDate = format(parseISO(booking.bookingDate), 'd MMMM yyyy, HH:mm', { locale: uk })
            const message = `Оплачено нове бронювання:\nДата: ${formattedDate}\nКількість годин: ${booking.bookingHours}\nID: ${booking.orderReference}`

            const messageBot = await axios.post(`${process.env.BOT_BASE_URL}/send-message`, { message })

            console.log('Response status:', messageBot.status);
            console.log('Response data:', messageBot.data);
            console.log('Payment status updated succesfully, the booking status is Approved');
        }

        return res.status(200).json({
            orderReference,
            status: transactionStatus === 'Approved' ? "accept" : "declined",
            time,
            signature: merchantSignature
        });
    } catch (e: any) {
        console.error('Fail at handleWayForPayStatus:', e.message);
        res.status(500).send('Internal server error');
    }
};

export default { createWayForPayForm, handleWayForPayStatus }