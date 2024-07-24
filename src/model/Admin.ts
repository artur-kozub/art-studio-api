import mongoose, { Schema, Document, Model } from "mongoose";

interface IAdmin extends Document {
    chatId: number;
    role: 'owner' | 'admin';
}

const AdminSchema = new Schema({
    chatId: { type: Number, required: true, unique: true },
    role: { type: String, enum: ['owner', 'admin'], required: true }
})

const Admin = mongoose.model<IAdmin>('Admin', AdminSchema)

export default Admin;