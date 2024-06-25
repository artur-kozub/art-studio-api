import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        const uri = process.env.DB_URI || 'uri_not_provided';
        await mongoose.connect(uri)
        console.log('Mongo connected');
    } catch (e: any) {
        console.log('Mongo connection error: ', e.message);
        process.exit(1);
    }
};

export default connectDB;