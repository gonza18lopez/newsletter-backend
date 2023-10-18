import nodemailer from "nodemailer";

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
