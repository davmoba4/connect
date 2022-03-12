const express = require("express");
const { JWTAuth } = require("../middleware/authMiddleware");
const {
  getDarkModeSetting,
  setDarkModeSetting,
} = require("../controllers/settingControllers");

const router = express.Router();
router
  .route("/")
  .get(JWTAuth, getDarkModeSetting)
  .put(JWTAuth, setDarkModeSetting);

module.exports = router;
