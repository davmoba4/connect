const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");

//@description     Create a one on one chat
//@route           POST /api/chat/create-one-on-one
//@access          Protected
const createOneOnOne = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("userId param not sent with request");
    return res.sendStatus(400);
  }

  if (userId.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("Self-chat is not supported");
  }

  var chats = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  });

  if (chats.length > 0) {
    res.status(400);
    throw new Error("Chat already exists");
  }

  try {
    var chat = await Chat.create({ users: [req.user._id, userId] });
    chat = await chat.populate("users", "-password");
    res.status(200).json(chat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create a group chat (you'll be the admin)
//@route           POST /api/chat/create-group
//@access          Protected
const createGroup = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.chatName) {
    res.status(400);
    throw new Error("Users and group name are required");
  }

  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    res.status(400);
    throw new Error("Group chats require more than 2 users in total");
  }

  users.push(req.user);
  try {
    var groupChat = await Chat.create({
      isGroupChat: true,
      chatName: req.body.chatName,
      groupAdmin: req.user,
      users: users,
    });
    groupChat = await groupChat.populate("users", "-password");
    groupChat = await groupChat.populate("groupAdmin", "-password");
    res.status(200).json(groupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Checks whether a list of JSON objects contains a given object
//@params          list: the list of objects (array of JSON objects)
//                 user: the given object (JSON object)
//@returns         Whether or not the list contains the object (Boolean)
const contains = (list, user) => {
  return list.some((elem) => {
    return JSON.stringify(user) === JSON.stringify(elem);
  });
};

//@description     Change the group admin for a chat (you are the admin)
//@route           PUT /api/chat/change-group-admin
//@access          Protected
const changeGroupAdmin = asyncHandler(async (req, res) => {
  const { chatId, newAdminId } = req.body;

  const chat = await Chat.findOne({ _id: chatId });

  if (chat?.groupAdmin.toString() !== req.user._id.toString()) {
    res.status(400);
    throw new Error("Only the group admin can change the group admin");
  }

  if (!contains(chat?.users, newAdminId)) {
    res.status(400);
    throw new Error("The new group admin must be in the group");
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { groupAdmin: newAdminId },
    { new: true }
  )
    .populate("groupAdmin", "-password")
    .populate("users", "-password");

  if (updatedChat) {
    res.status(200).json(updatedChat);
  } else {
    res.status(404);
    throw new Error("Chat not found");
  }
});

//@description     Rename a group chat
//@route           PUT /api/chat/rename-group
//@access          Protected
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, newChatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: newChatName },
    { new: true }
  )
    .populate("groupAdmin", "-password")
    .populate("users", "-password");

  if (updatedChat) {
    res.status(200).json(updatedChat);
  } else {
    res.status(404);
    throw new Error("Chat not found");
  }
});

//@description     Remove a user from a group chat (you are the admin if it's not yourself you're removing)
//@route           PUT /api/chat/remove-from-group
//@access          Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findOne({ _id: chatId });

  if (
    userId.toString() !== req.user._id.toString() &&
    chat?.groupAdmin.toString() !== req.user._id.toString()
  ) {
    res.status(400);
    throw new Error("Only the group admin can remove someone from the group");
  }

  if (
    userId.toString() === req.user._id.toString() &&
    chat?.groupAdmin.toString() === req.user._id.toString()
  ) {
    res.status(400);
    throw new Error("Please change the group admin before you leave the group");
  }

  const chatWithoutUser = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("groupAdmin", "-password")
    .populate("users", "-password");

  if (chatWithoutUser) {
    res.status(200).json(chatWithoutUser);
  } else {
    res.status(404);
    throw new Error("Chat not found");
  }
});

//@description     Add a user to a group chat (you are the admin)
//@route           PUT /api/chat/add-to-group
//@access          Protected
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findOne({ _id: chatId });

  if (chat?.groupAdmin.toString() !== req.user._id.toString()) {
    res.status(400);
    throw new Error("Only the group admin can add someone to the group");
  }

  if (contains(chat?.users, userId)) {
    res.status(400);
    throw new Error("User is already in the group");
  }

  const chatWithUser = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("groupAdmin", "-password")
    .populate("users", "-password");

  if (chatWithUser) {
    res.status(200).json(chatWithUser);
  } else {
    res.status(404);
    throw new Error("Chat not found");
  }
});

//@description     Fetch all chats of yourself
//@route           GET /api/chat/fetch-all
//@access          Protected
const fetchAll = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("groupAdmin", "-password")
      .populate("users", "-password")
      .populate("newestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "newestMessage.sender",
          select: "username picture",
        });
        results = await User.populate(results, {
          path: "newestMessage.readBy",
          select: "username picture",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  createOneOnOne,
  createGroup,
  changeGroupAdmin,
  renameGroup,
  removeFromGroup,
  addToGroup,
  fetchAll,
};
