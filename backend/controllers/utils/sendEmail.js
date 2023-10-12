const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");


const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport(
    smtpTransport({
      host: process.env.host,
      service: process.env.service,
      secure: false,
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    })
  );



  const mailOptions = {
    from: `"Hi 👻" ${process.env.user}"`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
