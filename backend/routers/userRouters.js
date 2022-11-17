const express = require("express");
const {
  userRegisterCtl,
  userLoginCtl,
  fetchuserCtl,
  userdeleteCtl,
  userDetailsCtl,
  userprofileCtl,
  userUpdateProfileCtl,
  updatePasswordCtl,
  userfollowingCtl,
  userUnFollowingCtl,
  blockUserCtl,
  unBlockUserCtl,
  generateEmailVerification,
  accountVerification,
  forgetPassword,
  passwordReset,
  uploadprofileImage,
} = require("../controllers/user/userController");
const authMiddleware = require("../middleware/Auth/authMiddleware");
const {
  profilePhotoUpload,
  profilePhotoResize,
} = require("../Uploads/profilePhotoUploads");

const router = express.Router();

// const bufferToStream = (buffer) => {
//   const readable = new Readable({
//     read() {
//       this.push(buffer);
//       this.push(null);
//     },
//   });
//   return readable;
// };

router.route("/register").post(userRegisterCtl);
router.route("/login").post(userLoginCtl);
router.route("/").get(authMiddleware, fetchuserCtl);
router.route("/:id").delete(authMiddleware, userdeleteCtl);
router.route("/:id").get(userDetailsCtl);
router.route("/profile/:id").get(authMiddleware, userprofileCtl);
router.route("/profile/:id").put(authMiddleware, userUpdateProfileCtl);
router.route("/password").put(authMiddleware, updatePasswordCtl);
router.route("/following").put(authMiddleware, userfollowingCtl);
router.route("/unfollowing").put(authMiddleware, userUnFollowingCtl);
router.route("/block-user/:id").put(authMiddleware, blockUserCtl);
router.route("/unblock-user/:id").put(authMiddleware, unBlockUserCtl);
router
  .route("/generate-verification-token")
  .post(authMiddleware, generateEmailVerification);
router.route("/verify-account").put(authMiddleware, accountVerification);
router.route("/forget-password").post(forgetPassword);
router.route("/password/reset/:token").put(passwordReset);
router
  .route("/upload/profile-photo")
  .put(
    authMiddleware,
    profilePhotoUpload.single("image"),
    profilePhotoResize,
    uploadprofileImage
  );

// router.put(
//   `/upload/profile-photo`,
//   authMiddleware,
//   uploads.single("image"),
//   async (req, res) => {
//     const data = await sharp(req.file.buffer)
//       .resize(250, 250)
//       .toFormat("jpeg")
//       .jpeg({ quality: 90 })
//       .webp({ quality: 20 })
//       .toBuffer();

//     const stream = cloudinary.v2.uploader.upload_stream(
//       { folder: "BLOG" },
//       (error, result) => {
//         if (error) return console.error(error);
//         return res.json({ URL: result.secure_url });
//       }
//     );

//     bufferToStream(data).pipe(stream);
//   }
// );

module.exports = router;
