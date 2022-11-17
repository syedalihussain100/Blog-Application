const express = require("express");
const router = express.Router();
const {
  CreateCommentCtl,
  FetchAllComment,
  FetchCommentById,
  UpdateComment,
  DeleteCommentCtl,
} = require("../controllers/comment/CommentCtl");
const authMiddleware = require("../middleware/Auth/authMiddleware");

router.route("/").post(authMiddleware, CreateCommentCtl);
router.route("/").get(authMiddleware, FetchAllComment);
router.route("/:id").get(authMiddleware, FetchCommentById);
router.route("/:id").put(authMiddleware, UpdateComment);
router.route("/:id").delete(authMiddleware, DeleteCommentCtl);

module.exports = router;
