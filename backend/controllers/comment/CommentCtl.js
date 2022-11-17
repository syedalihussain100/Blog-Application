const { commentModel } = require("../../models/Comment/comment");
const expressAsyncHandler = require("express-async-handler");
const validateMongooseID = require("../utils/validateMongodbId");
const isBlocked = require("../utils/isBlocked");

// create comment
const CreateCommentCtl = expressAsyncHandler(async (req, res) => {
  const user = req?.user;
  isBlocked(user);
  const { postId, description } = req.body;

  try {
    const comment = await commentModel.create({
      post: postId,
      user: user,
      description,
    });

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// fetch all comment

const FetchAllComment = expressAsyncHandler(async (req, res) => {
  try {
    const fetchAllComment = await commentModel.find({}).sort("-createdAt");

    if (!fetchAllComment) {
      throw new Error("Network Problem");
    }

    res.status(200).json(fetchAllComment);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// fetch comment by id

const FetchCommentById = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongooseID(id);
  try {
    const FetchCommentById = await commentModel.findById(id);
    if (!FetchCommentById) {
      throw new Error("Network Problem");
    }

    res.status(200).json(FetchCommentById);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// update comment

const UpdateComment = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongooseID(id);
  const { postId, description } = req.body;
  const user = req?.user;
  try {
    const updateComment = await commentModel.findByIdAndUpdate(
      id,
      {
        post: postId,
        user,
        description,
      },
      { new: true, runValidators: true }
    );

    if (!updateComment) {
      throw new Error("Network Problem");
    }

    res.status(200).json(updateComment);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// delete comment
const DeleteCommentCtl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteComment = await commentModel.findByIdAndDelete(id);

    if (!deleteComment) {
      throw new Error("Network Problem");
    }

    res.status(200).json(deleteComment);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = {
  CreateCommentCtl,
  FetchAllComment,
  FetchCommentById,
  UpdateComment,
  DeleteCommentCtl,
};
