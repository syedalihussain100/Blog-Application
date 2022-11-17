const { User } = require("../../models/User/User");
const asyncHandler = require("express-async-handler");
const generateToken = require("../../config/token/Token");
const userValidId = require("../utils/validateMongodbId");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const CloudUploadImage = require("../utils/CloudinaryCloud/Cloudinary");
const fs = require("fs");
const isBlocked = require("../utils/isBlocked");

// register
const userRegisterCtl = asyncHandler(async (req, res) => {
  const userExit = await User.findOne({ email: req?.body?.email });

  if (userExit) throw new Error("User already exists");

  try {
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });

    res.status(201).send({ message: "User is Successfully Register", user });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// login

const userLoginCtl = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("All Fields are Required");
    }

    const userFound = await User.findOne({ email });

    if (userFound?.isBlocked)
      throw new Error("Access Denied You have been Blocked");

    if (userFound && (await userFound.isPasswordmatch(password))) {
      res.json({
        _id: userFound?._id,
        firstName: userFound?.firstName,
        lastName: userFound?.lastName,
        email: userFound?.email,
        profilePhoto: userFound?.profilePhoto,
        isAdmin: userFound?.isAdmin,
        token: generateToken(userFound?._id),
        isVerified: userFound?.isAccountVerified,
      });
    } else {
      res.status(401);
      throw new Error("Invalid Login Credentials");
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// user Profile

const fetchuserCtl = asyncHandler(async (req, res) => {
  try {
    let userProfile = await User.find({}).populate("posts");

    if (!userProfile) {
      res.status(400);
      throw new Error("Network Problem!");
    }

    res.status(200).send(userProfile);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// user delete

const userdeleteCtl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // chaeck user id is here not not
  userValidId(id);

  try {
    if (!id) {
      throw new Error(`User does not exit with id ${id}`);
    }

    const userDelete = await User.findByIdAndDelete(id);

    await userDelete.remove();

    res.status(200).json({ message: "User Delete Succesfully" });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// user Details

const userDetailsCtl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  userValidId(id);
  try {
    const userDetails = await User.findById(id);

    if (!userDetails) {
      throw new Error("Network Problem");
    }

    res.status(200).json({ userDetails });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// user profile
const userprofileCtl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  userValidId(id);
  //1.Find the login user
  //2. Check this particular if the login user exists in the array of viewedBy

  //Get the login user
  const loginUserId = req?.user?._id?.toString();

  try {
    const myProfile = await User.findById(id)
      .populate("posts")
      .populate("viewedBy");
    const alreadyViewed = myProfile?.viewedBy?.find((user) => {
      return user?._id?.toString() === loginUserId;
    });
    if (alreadyViewed) {
      res.json(myProfile);
    } else {
      const profile = await User.findByIdAndUpdate(myProfile?._id, {
        $push: { viewedBy: loginUserId },
      });
      res.json(profile);
    }
  } catch (error) {
    res.json(error);
  }
});

// user update profile

const userUpdateProfileCtl = asyncHandler(async (req, res) => {
  const { _id } = req?.user;
  isBlocked(req?.user);
  userValidId(_id);
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        bio: req?.body?.bio,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// update Password
const updatePasswordCtl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const isPasswordMatch = await user.isPasswordmatch(req?.body?.oldPassword);

  if (!isPasswordMatch) {
    res.status(400);
    throw new Error("Old Password is Incorrect");
  }

  if (req?.body?.newpassword !== req?.body?.confirmPassword) {
    res.status(400);
    throw new Error("Password does not match");
  }

  user.password = req.body.newpassword;

  await user.save();

  res.status(200).json(user);
});

// Following

const userfollowingCtl = asyncHandler(async (req, res) => {
  const { followId } = req.body;
  const loginUserId = req.user.id;

  // find the target user and check if the login id exits

  const targetUser = await User.findById(followId);

  const allreadyFollowing = targetUser?.followers?.find(
    (user) => user?.toString() === loginUserId.toString()
  );

  if (allreadyFollowing) {
    throw new Error("You already following this user");
  }

  await User.findByIdAndUpdate(
    followId,
    {
      $push: { followers: loginUserId },
      isFollowing: true,
    },
    { new: true }
  );

  // update the login user following id

  await User.findByIdAndUpdate(
    loginUserId,
    {
      $push: { following: followId },
    },
    { new: true }
  );

  res.status(200).json("You have successfully Follow this user");
});

// unFollowing

const userUnFollowingCtl = asyncHandler(async (req, res) => {
  const { UnfollowId } = req.body;
  const loginUserId = req.user.id;

  await User.findByIdAndUpdate(
    UnfollowId,
    {
      $pull: { followers: loginUserId },
      isFollowing: false,
    },
    { new: true }
  );

  await User.findByIdAndUpdate(
    loginUserId,
    {
      $pull: { following: UnfollowId },
    },
    { new: true }
  );

  res.status(200).json("You have successfully unFollowed this user");
});

// Block User

const blockUserCtl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  userValidId(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: true,
    },
    { new: true }
  );
  res.status(200).json(user);
});

// UnBlock User
const unBlockUserCtl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  userValidId(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    { new: true }
  );
  res.status(200).json(user);
});

// generate verification

const generateEmailVerification = asyncHandler(async (req, res) => {
  const loginUser = req.user.id;

  const user = await User.findById(loginUser);

  try {
    const verificationToken = await user.AccountVerificationToken();

    await user.save();
    // build your message
    const message = `If you were requested to verify your account, verify now within 10 minutes, otherwise ignore this message <a href="${
      req.protocol
    }://${req.get(
      "host"
    )}/verify-account/${verificationToken}">Click to verify your account</a>`;

    await sendEmail({
      email: user?.email,
      subject: "Verify Your Account",
      html: message,
    });

    res.status(200).send(message);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// account verification

const accountVerification = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");

  // find this user by token

  const userFound = await User.findOne({
    accountVerificationToken: hashToken,
    accountVerificationTokenExpires: { $gt: new Date() },
  });

  if (!userFound) throw new Error("Token expired, try again later");

  // update the property to true
  userFound.isAccountVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationTokenExpires = undefined;

  await userFound.save();
  res.status(200).send(userFound);
});

// forget password functionality

const forgetPassword = asyncHandler(async (req, res) => {
  // find the user by email

  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) throw new Error("User not Found");

  const resetToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your Password reset token is :- \n\n  ${resetPasswordUrl} \n\n If you are not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json(`Email sent to ${user.email} Successfully`);
  } catch (error) {
    user.passwordRessetToken = undefined;
    user.passwordResetExpires = undefined;

    res.status(500).send(error.message);
  }
});

const passwordReset = asyncHandler(async (req, res) => {
  // create token hash

  const ResetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    ResetPasswordToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Reset Password Token is inValid or has been expired");
  }

  if (req.body.password !== req.body.confirmPassword) {
    res.status(400);
    throw new Error("Password does not match");
  }

  user.password = req.body.password;
  user.passwordRessetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  res.status(200).send(user);
});

const uploadprofileImage = asyncHandler(async (req, res) => {
  // Find the Login user
  const { _id } = req.user;

  const localPath = `public/images/profile/${req.file.filename}`;

  // upload to clodinary
  let imgUploaded = await CloudUploadImage(localPath);
  try {
    await User.findByIdAndUpdate(
      _id,
      {
        profilePhoto: imgUploaded?.url,
      },
      { new: true }
    );
    //  remove the save images

    fs.unlinkSync(localPath);

    res.json(imgUploaded);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = {
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
};
