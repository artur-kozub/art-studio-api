import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config();

const sendEmail = async (email: string, bookingDate: string, customerName: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'fokusfotolab@gmail.com',
            pass: process.env.MAILER_PASS,
        },
    });

    const mailOptions = {
        from: '"Focus Photolab" <fokusfotolab@gmail.com>', 
        to: email,                
        subject: 'Дякуємо за бронювання 💞',
        text: `Вітаємо ${customerName}🥰 \n\nДякуємо, що обрали Focus Photolab \nВаші дата та час бронювання: ${bookingDate}, \n\nАдреса студії: місто Дніпро, вулиця Троїцька 21-г`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}

export { sendEmail }