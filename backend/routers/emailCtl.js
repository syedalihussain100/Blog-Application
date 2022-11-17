const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/Auth/authMiddleware");
const { sendEmailMsgCtrl } = require("../controllers/Email/emailCtl");

router.route("/").post(authMiddleware, sendEmailMsgCtrl);

module.exports = router;
