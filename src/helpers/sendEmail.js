const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

const sendEmail = (to, subject, text) => {
  return transporter.sendMail({
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
