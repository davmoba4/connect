const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config()

app.get("/", (req, res) => {
  res.send("API is Running");
});

const PORT = process.env.PORT

app.listen(PORT, console.log(`Server Started on PORT ${PORT}`));
