const express = require("express");
const router = express.Router();
const {
  createPostCtl,
  fetchPostsCtl,
  fetchPostCtl,
  updatePostCtl,
  deletePostCtl,
  LikePostCtl,
  DislikesCtl,
} = require("../controllers/post/postCtl");
const authmiddleWare = require("../middleware/Auth/authMiddleware");
const {
  profilePhotoUpload,
  postPhotoResize,
} = require("../Uploads/profilePhotoUploads");

router
  .route("/")
  .post(
    authmiddleWare,
    profilePhotoUpload.single("image"),
    postPhotoResize,
    createPostCtl
  );

  router.route("/likes").put(authmiddleWare, LikePostCtl);
  router.route("/dislikes").put(authmiddleWare, DislikesCtl);

router.route("/").get(fetchPostsCtl);

router.route("/:id").get(fetchPostCtl);
router.route("/:id").put(authmiddleWare, updatePostCtl);

router.route("/:id").delete(authmiddleWare, deletePostCtl);



module.exports = router;
