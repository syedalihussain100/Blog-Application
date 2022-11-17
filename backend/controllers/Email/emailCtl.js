const expressAsyncHandler = require("express-async-handler");
const { EmailModel } = require("../../models/Email/email");
const sentMail = require("../utils/sendEmail");
const Filter = require("bad-words");

const sendEmailMsgCtrl = expressAsyncHandler(async (req, res) => {
  const { to, subject, message } = req.body;

  //   get the message
  const emailMessage = subject + " " + message;

  //prevent profanity/bad words
  const filter = new Filter();

  const isProfane = filter.isProfane(emailMessage);

  if (isProfane) {
    throw new Error("Email sent failed, because it contains profane words.");
  }
  //  build up message
  try {
    await sentMail({
      email: to,
      subject: subject,
      message: message,
    });
    // save to our db
    await EmailModel.create({
      sentBy: req?.user?._id,
      fromEmail: req?.user?.email,
      toEmail: to,
      message: message,
      Subject: subject,
    });

    res.status(200).json("Mail Sent");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = { sendEmailMsgCtrl };
