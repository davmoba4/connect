const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const create = asyncHandler(async (req, res) => {});

const createGroup = asyncHandler(async (req, res) => {});

const renameGroup = asyncHandler(async (req, res) => {});

const removeFromGroup = asyncHandler(async (req, res) => {});

const addToGroup = asyncHandler(async (req, res) => {});

const fetchAll = asyncHandler(async (req, res) => {});

module.exports = {
  create,
  createGroup,
  renameGroup,
  removeFromGroup,
  addToGroup,
  fetchAll,
};
