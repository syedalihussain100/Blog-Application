const expressAsyncHandler = require("express-async-handler");
const { categoryModel } = require("../../models/Category/category");
const validateMongooseID = require("../utils/validateMongodbId");

// createCategory
const createCategoryCtl = expressAsyncHandler(async (req, res) => {
  try {
    const category = await categoryModel.create({
      user: req.user._id,
      title: req.body.title,
    });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// get all category

const fetchallCategory = expressAsyncHandler(async (req, res) => {
  try {
    const category = await categoryModel
      .find({})
      .populate("user")
      .sort("-createdAt");

    if (!category) {
      throw new Error("Network Provlem");
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// get single category

const fetchSingleCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await categoryModel.findById(id).populate("user").sort("-createdAt");

    if (!category) {
      throw new Error("Network Provlem");
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// update category

const updateCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongooseID(id);
  const user = req?.user;
  try {
    const category = await categoryModel.findByIdAndUpdate(
      id,
      {
        user,
        title: req?.body?.title,
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      throw new Error("Network problem");
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// delete category

const deleteCategoryCtl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongooseID(id);

  try {
    const category = await categoryModel.findByIdAndDelete(id);

    if (!category) {
      throw new Error("Network Problem");
    }
    res.json(category);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = {
  createCategoryCtl,
  fetchallCategory,
  fetchSingleCategory,
  updateCategory,
  deleteCategoryCtl,
};
