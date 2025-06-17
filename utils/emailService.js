// server/utils/emailService.js
const dotenv = require('dotenv');
// const nodemailer = require('nodemailer'); // Uncomment and install 'nodemailer' for real emails

dotenv.config();

// Placeholder for a real email transporter.
// In a production app, you would configure nodemailer with your email service provider.
/*
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
*/


const sendEmail = async (to, subject, text, html = '') => {
    try {
        console.log(`--- Sending Email Notification ---`);
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body (Text): \n${text}`);
        if (html) {
            console.log(`Body (HTML): \n${html}`);
        }
        console.log(`--- Email simulated successfully ---`);

        // Uncomment the following block if you set up Nodemailer
        /*
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"Job Portal" <noreply@jobportal.com>',
            to,
            subject,
            text,
            html,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
        */
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        
        throw new Error(`Email sending failed: ${error.message}`);
    }
};

module.exports = {
    sendEmail
};
