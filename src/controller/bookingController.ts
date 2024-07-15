import { Request, Response } from "express";
import BookModel from "../model/Booking";

const createBooking = async (req: Request, res: Response) => {
    const productPrice = req.query.price;
    const { bookingDate, bookingHours, customerName, customerPhone, customerEmail } = req.body;
    const orderDate = Math.floor(Date.now() / 1000);
    const orderReference = 'oid' + Math.floor(Math.random() * 1000000000000000);
    const productCount = 1;
    const currency = 'UAH';
    const productName = process.env.PRODUCT_NAME;

    try {
        const normalizedDate = new Date(bookingDate).toISOString();
        console.log('normalizedDate ' + normalizedDate + '\nbookingDate ' + bookingDate);

        const bookingExists = await BookModel.findOne({ bookingDate: normalizedDate, paymentStatus: 'Approved' })
        if (bookingExists) {
            console.log('Failed at createBooking. Booking with this date and time already exists')
            return res.status(409).json({ message: 'Failed at createBooking. Booking with this date and time already exists' })
        }

        const booking = new BookModel({
            productPrice,
            orderReference,
            orderDate,
            productCount,
            bookingDate: normalizedDate,
            bookingHours,
            currency,
            productName,
            customerName,
            customerPhone,
            customerEmail
        })

        await booking.save();

        console.log('Created booking...')
        res.status(201).json({ message: 'Created booking record, needs to be payed to be confirmed', booking })
    } catch (e: any) {
        console.log(e.message)
        res.status(500).send('Something went wrong on createBooking stage...')
    }
}

const getBookingRecords = async (req: Request, res: Response) => {
    try {
        console.log('Retrieving all bookings...')
        const records = await BookModel.find();
        res.status(200).json(records);
    } catch (e: any) {
        console.log('Fail at getBookingRecords:', e.message);
        res.status(400).json({ message: e.message });
    }
}

const updateBooking = async (req: Request, res: Response) => {
    const { newBookingDate, orderReference } = req.body;

    try {
        console.log('Looking for booking with this date and time...')

        const booking = await BookModel.findOne({ orderReference });
        if (!booking) {
            console.log('Booking with this ID was not found')
            res.status(404).json({ message: 'Booking with this ID was not found' })
            throw new Error('Booking with this date and time was not found');
        }

        booking.bookingDate = newBookingDate;
        await booking.save();

        console.log('Updated booking succesfully \n', { newBookingDate: newBookingDate, orderReference });
        res.status(200).json({ message: 'Updated booking succesfully', newBookingDate: newBookingDate, orderReference })
    } catch (e: any) {
        console.log('Fail at updateBooking:', e.message)
        res.status(500).json({ message: e.message })
    }
}

const deleteBooking = async (req: Request, res: Response) => {
    const orderReference = req.body.orderReference;

    try {
        console.log('Deleting booking by date and time');
        const booking = await BookModel.findOneAndDelete({ orderReference });
        if (!booking) {
            console.log('Fail at deleteBooking, the booking with OID was not found')
            res.status(404).json({ message: 'Fail at deleteBooking, the booking with OID was not found' })
        }

        console.log('Deleted booking successfully\n', orderReference, booking?.bookingDate)
        res.status(200).json({ message: 'Deleted booking successfully', orderReference })
    } catch (e: any) {
        console.log('Fail at deleteBooking', e.message)
        res.status(500).json({ message: e.message })
    }
}

export default { createBooking, getBookingRecords, updateBooking, deleteBooking };