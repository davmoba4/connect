const asyncHandler = require("express-async-handler");
const generateJWT = require("../config/generateJWT");
const Setting = require("../models/settingModel");
const User = require("../models/userModel");

//@description     Sign up for an account
//@route           POST /api/user/sign-up
//@access          Public
const signUp = asyncHandler(async (req, res) => {
  const { username, password, picture, darkModeSetting } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Both username and password are required");
  }

  const usernameTaken = await User.findOne({ username });

  if (usernameTaken) {
    res.status(400);
    throw new Error("Username is taken");
  }

  const user = await User.create({
    username,
    password,
    picture,
  });

  if (user) {
    const setting = await Setting.create({
      user: user._id,
      darkMode: darkModeSetting,
    });

    if (setting) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        picture: user.picture,
        token: generateJWT(user._id),
      });
    } else {
      await User.deleteOne({ username: user.username });
      res.status(400);
      throw new Error("Failed to create settings for user");
    }
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

//@description     Log into your account
//@route           POST /api/user/log-in
//@access          Public
const logIn = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      picture: user.picture,
      token: generateJWT(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

//@description     Search for a user
//@route           GET /api/user?search=<username>
//@access          Protected
const search = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.query.search });

  if (user) {
    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error("Self-chat is not supported");
    }
    res.status(200).json(user._id);
  } else {
    res.status(400);
    throw new Error("User does not exist");
  }
});

module.exports = { signUp, logIn, search };
