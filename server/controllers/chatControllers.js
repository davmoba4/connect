const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel")

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

const findGroupAdmin = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({ _id: req.body.chatId });

  if (chat) {
    res.status(200).json(chat.groupAdmin);
  } else {
    res.status(404);
    throw new Error("Chat not found");
  }
});

const changeGroupAdmin = asyncHandler(async (req, res) => {
  const { chatId, newAdminId } = req.body;

  const chat = await Chat.findOne({ _id: chatId });

  if (chat?.groupAdmin.toString() !== req.user._id.toString()) {
    res.status(400);
    throw new Error("Only the group admin can change the group admin");
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

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findOne({ _id: chatId });

  if (chat?.groupAdmin.toString() !== req.user._id.toString()) {
    res.status(400);
    throw new Error("Only the group admin can remove someone from the group");
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

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findOne({ _id: chatId });

  if (chat?.groupAdmin.toString() !== req.user._id.toString()) {
    res.status(400);
    throw new Error("Only the group admin can add someone to the group");
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
        })
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
  findGroupAdmin,
  changeGroupAdmin,
  renameGroup,
  removeFromGroup,
  addToGroup,
  fetchAll,
};
