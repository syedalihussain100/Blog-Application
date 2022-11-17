const express = require("express");
const router = express.Router();

const {
  createCategoryCtl,
  fetchallCategory,
  fetchSingleCategory,
  updateCategory,
  deleteCategoryCtl,
} = require("../controllers/Category/categoryCtl");
const authMiddleware = require("../middleware/Auth/authMiddleware");

router.route("/").post(authMiddleware, createCategoryCtl);
router.route("/").get( fetchallCategory);
router.route("/:id").get( fetchSingleCategory);
router.route("/:id").put(authMiddleware, updateCategory);
router.route("/:id").delete(authMiddleware, deleteCategoryCtl);

module.exports = router;
