const express = require("express");
const {
  create,
  createGroup,
  renameGroup,
  removeFromGroup,
  addToGroup,
  fetchAll,
} = require("../controllers/chatControllers");
const { JWTAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", JWTAuth, create);
router.post("/create-group", JWTAuth, createGroup);
router.put("/rename-group", JWTAuth, renameGroup);
router.put("/remove-from-group", JWTAuth, removeFromGroup);
router.put("/add-to-group", JWTAuth, addToGroup);
router.get("/fetch-all", JWTAuth, fetchAll);

module.exports = router;
