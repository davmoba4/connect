const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

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
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (updatedChat) {
    res.status(200).json(updatedChat);
  } else {
    res.status(404);
    throw new Error("Chat not found");
  }
});

const renameGroup = asyncHandler(async (req, res) => {});

const removeFromGroup = asyncHandler(async (req, res) => {});

const addToGroup = asyncHandler(async (req, res) => {});

const fetchAll = asyncHandler(async (req, res) => {});

module.exports = {
  createOneOnOne,
  createGroup,
  changeGroupAdmin,
  renameGroup,
  removeFromGroup,
  addToGroup,
  fetchAll,
};
