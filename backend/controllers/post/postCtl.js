const expressAsyncHandler = require("express-async-handler");
const { postModel } = require("../../models/Posts/Post");
const { User } = require("../../models/User/User");
const validateMongodbId = require("../utils/validateMongodbId");
const Filter = require("bad-words");
const CloudUploadImage = require("../utils/CloudinaryCloud/Cloudinary");
const fs = require("fs");
const isBlocked = require("../utils/isBlocked");

// create post
const createPostCtl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  isBlocked(req?.user);
  // validateMongodbId(req.body.user);

  //   check for bed words

  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.title, req.body.description);

  //   Block User
  if (isProfane) {
    await User.findByIdAndUpdate(_id, {
      isBlocked: true,
    });

    throw new Error(
      "Creating Failed beacuse it contains profane words and you have been blocked"
    );
  }

  if (
    req?.user?.accountType === "Starter Account" &&
    req?.user?.postCount >= 2
  ) {
    throw new Error(
      "Starter account can only create two posts. Get more followers."
    );
  }

  const localPath = `public/images/post/${req.file.filename}`;

  // // upload to clodinary
  let imgUploaded = await CloudUploadImage(localPath);

  try {
    const post = await postModel.create({
      ...req.body,
      user: _id,
      image: imgUploaded?.url,
    });
    // update the user post count
    await User.findByIdAndUpdate(
      _id,
      { $inc: { postCount: 1 } },
      {
        new: true,
      }
    );

    fs.unlinkSync(localPath);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// fetch all posts

const fetchPostsCtl = expressAsyncHandler(async (req, res) => {
  const hasCategory = req.query.category;
  try {
    // check if it has a category
    if (hasCategory) {
      const posts = await postModel
        .find({ category: hasCategory })
        .populate("user")
        .populate("comments")
        .sort("-createdAt");
      res.json(posts);
    } else {
      const posts = await postModel
        .find({})
        .populate("user")
        .populate("comments")
        .sort("-createdAt");
      res.json(posts);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// fetch post ctl

const fetchPostCtl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const fetchPost_Details = await postModel
      .findById(id)
      .populate("user")
      .populate("disLikes")
      .populate("likes")
      .populate("comments");

    if (!fetchPost_Details) {
      throw new Error("Some Thing Went Wrong!");
    }

    await postModel.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );

    res.status(200).send(fetchPost_Details);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// updatePostCtl

const updatePostCtl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const postUpdate = await postModel.findByIdAndUpdate(
      id,
      {
        title: req?.body?.title,
        description: req?.body?.description,
        user: req.user?._id,
      },
      { new: true }
    );

    if (!postUpdate) {
      throw new Error("Some Thing Went Wrong!");
    }

    res.status(200).send(postUpdate);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// delete post

const deletePostCtl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const post = await postModel.findByIdAndDelete(id);

    if (!post) {
      throw new Error("Some Thing Went Wrong!");
    }

    res.status(200).json("Post are Deleted");
  } catch (error) {
    res.status(200).send(error.message);
  }
});

// likes

const LikePostCtl = expressAsyncHandler(async (req, res) => {
  //1 find the post to be liked
  const { postId } = req.body;

  const post = await postModel.findById(postId);

  // 2 findd the login user
  const loginUserId = req?.user?._id;
  //3 find the user has liked the post
  const isLiked = post?.isLiked;

  // 4 check if this user dislike the post

  const alreadyDisliked = post?.disLikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  // remove the user from dislikes array if exits
  if (alreadyDisliked) {
    const post = await postModel.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    return res.status(200).json(post);
  }
  // Toggle
  // remove the user if he has likes
  if (isLiked) {
    const post = await postModel.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    return res.status(200).json(post);
  } else {
    // add to likes
    const post = await postModel.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );

    res.status(200).json(post);
  }
});

// Dislikes

const DislikesCtl = expressAsyncHandler(async (req, res) => {
  const { postId } = req.body;
  const post = await postModel.findById(postId);
  //2.Find the login user
  const loginUserId = req?.user?._id;
  //3.Check if this user has already disLikes
  const isDisLiked = post?.isDisLiked;
  //4. Check if already like this post
  const alreadyLiked = post?.likes?.find(
    (userId) => userId.toString() === loginUserId?.toString()
  );
  //Remove this user from likes array if it exists
  if (alreadyLiked) {
    const post = await postModel.findOneAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    return res.status(200).json(post);
  }
  //Toggling
  //Remove this user from dislikes if already disliked
  if (isDisLiked) {
    const post = await postModel.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    return res.status(200).json(post);
  } else {
    const post = await postModel.findByIdAndUpdate(
      postId,
      {
        $push: { disLikes: loginUserId },
        isDisLiked: true,
      },
      { new: true }
    );
    res.status(200).json(post);
  }
});

module.exports = {
  createPostCtl,
  fetchPostsCtl,
  fetchPostCtl,
  updatePostCtl,
  deletePostCtl,
  LikePostCtl,
  DislikesCtl,
};
