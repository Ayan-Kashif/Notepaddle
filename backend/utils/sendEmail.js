const nodemailer = require('nodemailer');
const frontendURL = process.env.FRONTEND_URL?.trim().replace(/\/+$/, '');
exports.sendVerificationEmail = async (email, token) => {
  console.log('Sending email')
  const url = `${frontendURL}/verify?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your SMTP provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Notepadle" <no-reply@notepadle.com>',
    to: email,
    subject: 'Verify your email',
    html: `<p>Click the link to verify:</p><a href="${url}">${url}</a>`,
  });
};
