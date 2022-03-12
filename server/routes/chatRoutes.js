const express = require("express");
const {
  createOneOnOne,
  createGroup,
  findGroupAdmin,
  changeGroupAdmin,
  renameGroup,
  removeFromGroup,
  addToGroup,
  fetchAll,
} = require("../controllers/chatControllers");
const { JWTAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-one-on-one", JWTAuth, createOneOnOne);
router.post("/create-group", JWTAuth, createGroup);
router.get("/find-group-admin", JWTAuth, findGroupAdmin);
router.put("/change-group-admin", JWTAuth, changeGroupAdmin);
router.put("/rename-group", JWTAuth, renameGroup);
router.put("/remove-from-group", JWTAuth, removeFromGroup);
router.put("/add-to-group", JWTAuth, addToGroup);
router.get("/fetch-all", JWTAuth, fetchAll);

module.exports = router;
