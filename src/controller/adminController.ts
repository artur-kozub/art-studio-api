import { Request, Response } from "express"
import Admin from "../model/Admin"

const setAdmin = async (req: Request, res: Response) => {
    const { chatId, role } = req.body

    try {
        const adminExists = await Admin.findOne({ chatId })

        if (adminExists) {
            console.log(`Admin with ${chatId} already exists`)
            return res.status(409).json({ message:`Admin with ${chatId} already exists` })
        }

        const admin = new Admin({
            chatId,
            role
        })

        await admin.save();

        res.status(201).json({ message: 'Admin has been set up succesfully', admin })
    } catch (e: any) {
        console.log(e.message)
        return res.status(500).json({ message: 'Server error at setAdmin' })
    }
}

const getAdmin = async (req: Request, res: Response) => {
    const chatId = req.params.chatId;

    try {
        const admin = await Admin.findOne({ chatId })

        if (!admin) {
            console.log(`Admin with chatId ${chatId} not found`)
            return res.status(404).json({ message: 'Admin with this chatId not found' })
        }

        res.status(200).json({ admin })
        return admin;
    } catch (e: any) {
        console.log(e.message)
        return res.status(500).json({ message: 'Server error at getAdmin' })
    }
}

const getAllAdmins = async (req: Request, res: Response) => {
    try {
        const admins = await Admin.find();

        res.status(200).json({ admins })
    } catch (e: any) {
        console.log(e.message)
        res.status(500).json({ message: 'Something went wrong at getAllAdmins' })
    }
}

const deleteAdmin = async (req: Request, res: Response) => {
    const chatId = req.params.chatId;

    try {
        const admin = await Admin.findOne({ chatId })

        if (!admin) {
            console.log(`Admin with chatId ${chatId} not found`)
            return res.status(404).json({ message: 'Admin with this chatId not found' })
        }

        await admin?.deleteOne();
        res.status(200).json({ message: 'Admin has been deleted' })
    } catch (e: any) {
        console.log(e.message)
        return res.status(500).json({ message: 'Server error at deleteAdmin' })
    }
}

export default { setAdmin, deleteAdmin, getAdmin, getAllAdmins }