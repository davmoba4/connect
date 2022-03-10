const express = require("express");
const { signUp, logIn, search } = require("../controllers/userControllers");
const { JWTAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/log-in", logIn);
router.get("/", JWTAuth, search);

module.exports = router;
