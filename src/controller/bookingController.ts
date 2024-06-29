import { Request, Response } from "express";
import BookModel from "../model/Booking";

const createBooking = async (req: Request, res: Response) => {
    const productPrice = req.query.price;
    const bookingDate = req.body.bookingDate;
    const orderDate = Math.floor(Date.now() / 1000);
    const orderReference = 'oid' + Math.floor(Math.random() * 1000000000000000);
    const productCount = 1;
    const currency = 'UAH';
    const productName = process.env.PRODUCT_NAME;

    try {
        const booking = new BookModel({
            productPrice,
            orderReference,
            orderDate,
            productCount,
            bookingDate,
            currency,
            productName
        })

        await booking.save();

        console.log('Created booking...')
        res.status(200).json({ message: 'Created booking record, needs to be payed to be confirmed', booking })
    } catch(e: any) {
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
    const { newOrderDate, oldOrderDate } = req.body;
}

export default { createBooking, getBookingRecords, updateBooking };