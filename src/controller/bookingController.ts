import { Request, Response } from "express";
import BookModel from "../model/Booking";

const createBooking = async (req: Request, res: Response) => {
    const productPrice = req.query.price;
    const orderDate = Math.floor(Date.now() / 1000);
    const orderReference = 'oid' + Math.floor(Math.random() * 1000000000000);
    const productCount = 1;
    const productName = 'photosession';

    try {
        const booking = new BookModel({
            productPrice,
            orderReference,
            orderDate,
            productCount,
            productName
        })

        await booking.save();
        console.log('created booking... \n your url: https://d70c-46-33-39-10.ngrok-free.app/api/payments/payment-form?currency=UAH&productName[]=photosession&productCount[]=1&bookingId=' + String(booking._id))
        res.status(200).json({ message: 'Created booking record, needs to be payed to confirm', booking })
    } catch(e: any) {
        res.status(500).send('Something went wrong on createBooking stage...')
    }
}

const getBookingRecords = async (req: Request, res: Response) => {
    try {
        const records = await BookModel.find();
        res.status(200).json(records);
    } catch (e: any) {
        res.status(400).json({ message: e.message })
    }
}

export default { createBooking, getBookingRecords };