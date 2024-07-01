import mongoose, { Schema, Document } from 'mongoose';

interface IBooking extends Document {
    orderReference: string;
    orderDate: number;
    productPrice: number[];
    productCount: number[];
    productName: string;
    currency: string;
    bookingDate: string;
    bookingHours?: string;
    paymentStatus?: string;
    reasonCode?: number;
}

const BookingSchema: Schema = new Schema({
    orderReference: { type: String, required: true, unique: true },
    orderDate: { type: Number, required: true },
    productPrice: { type: [Number], required: true },
    productCount: { type: [Number], required: true },
    productName: { type: String, required: true },
    bookingDate: { type: String, required: true, unique: true },
    bookingHours: { type: String },
    currency: { type: String },
    paymentStatus: { type: String },
    reasonCode: { type: Number },
},
    {
        timestamps: true
    }
);

const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
export default Booking;
export { IBooking };