import nodemailer from "nodemailer";
import { Recipient } from "../models/Recipient";
import { Newsletter } from "../models/Newsletter";
import path from "path";

const options: any = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: "6ace7f98fca94b",
    },
};

// Configura el transporte de correo
export const transporter = nodemailer.createTransport(options);

// Send newsletters to recipients
export const sendNewsletter = async (newsletter: Newsletter) => {
    newsletter.recipients.forEach(async (recipient: Recipient) => {
        await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: recipient.email,
            subject: newsletter.name,
            html: newsletter.body,
            attachments: [
                {
                    filename: path.basename(newsletter.attachment.path),
                    path: `${__dirname}/../${newsletter.attachment.path}`,
                },
            ],
            list: {
                unsubscribe: {
                    url: `${process.env.FRONTEND_URL}/unsubscribe/${recipient.token}`,
                    comment: "Unsubscribe",
                },
            },
        });
    })
};
