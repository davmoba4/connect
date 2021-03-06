const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

//@description     Create a message that is sent
//@route           POST /api/message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;

  if (!chatId || !content) {
    console.log("Need both chatId and content");
    return res.sendStatus(400);
  }

  try {
    const chat = await Chat.findOne({ _id: chatId });
    if (!chat.users.includes(req.user._id)) {
      res.status(400);
      throw new Error("User must be in the chat to send a message");
    }

    var message = await Message.create({
      chat: chatId,
      sender: req.user._id,
      content: content,
      readBy: [req.user._id],
    });

    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username picture",
    });
    message = await message.populate("sender", "username picture");
    message = await message.populate("readBy", "username picture");

    await Chat.findByIdAndUpdate(chatId, { newestMessage: message });

    res.status(200).json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Fetch all messages for a given chat
//@route           GET /api/message/<chatId>
//@access          Protected
const fetchMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate(
      "chat"
    );
    if (messages.length === 0) {
      res.status(200).json(messages);
      return;
    }
    if (!messages[0].chat.users.includes(req.user._id)) {
      res.status(400);
      throw new Error("User must be in the chat to see it's messages");
    }

    await Message.find({ chat: req.params.chatId })
      .populate("chat")
      .populate("sender", "username picture")
      .populate("readBy", "username picture")
      .then(async (results) => {
        results = await User.populate(results, {
          path: "chat.users",
          select: "username picture",
        });
        res.status(200).json(results);
      });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Update message to read by user
//@route           PUT /api/message/read
//@access          Protected
const readMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.body;

  try {
    const message = await Message.findOne({ _id: messageId }).populate("chat");
    if (!message.chat.users.includes(req.user._id)) {
      res.status(400);
      throw new Error("User must be in the chat to read the message");
    }
    if (message.readBy.includes(req.user._id)) {
      res.status(400);
      throw new Error("User already read the message");
    }

    await Message.findByIdAndUpdate(
      messageId,
      { $push: { readBy: req.user._id } },
      { new: true }
    )
      .populate("chat")
      .populate("sender", "username picture")
      .populate("readBy", "username picture")
      .then(async (results) => {
        results = await User.populate(results, {
          path: "chat.users",
          select: "username picture",
        });
        res.status(200).json(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  sendMessage,
  fetchMessages,
  readMessage,
};
