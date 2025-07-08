const nodemailer = require('nodemailer');

const frontendURL = process.env.FRONTEND_URL?.trim().replace(/\/+$/, '');

exports.sendVerificationEmail = async (email, token) => {
  console.log('Sending email');

  const url = `${frontendURL}/verify?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // true for port 465
    auth: {
      user: process.env.EMAIL_USER, // e.g. 'support@notepaddle.com'
      pass: process.env.EMAIL_PASS, // your Zoho email password
    },
  });

  await transporter.sendMail({
    from: `"Notepadle" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your email',
    html: `<p>Click the link below to verify your email:</p><a href="${url}">${url}</a>`,
  });
};
