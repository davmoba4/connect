const express = require("express");
const {
  sendMessage,
  fetchMessages,
  readMessage,
} = require("../controllers/messageControllers");
const { JWTAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", JWTAuth, sendMessage);
router.get("/:chatId", JWTAuth, fetchMessages);
router.put("/read", JWTAuth, readMessage);

module.exports = router;
