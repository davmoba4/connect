const express = require("express");
const { signUp, logIn } = require("../controllers/userControllers");

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/log-in", logIn);

module.exports = router;
