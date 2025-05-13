import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import 'dotenv/config';
/*
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // generated ethereal user
    pass: process.env.SMTP_PASS, // generated ethereal password
  },
});

export async function sendEmail(to, subject, html, text) {
  const msg = {
    to, // list of receivers
    from: `"Machinery Market" <${process.env.SMTP_FROM}>`, // sender address
    subject, // Subject line
    text, // plain text body
    html, // html body
  };
  const info = await transporter.sendMail(msg);
  console.log('Message sent: %s', info.messageId);
  return info;
}
*/

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = async (msg) => {
  try {
    const info = await sgMail.send(msg);
    console.log('Message sent: %s', info[0].headers['x-message-id']);
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('Response:', error.response.body);
    }
  }
};

/*sendMail({
  to: 'basselabuabboud22@gmail.com',
  from: process.env.SMTP_FROM,
  subject: 'Test email',
  text: 'This is a test email',
});
*/
