const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
app.use(cors());
dotenv.config();

app.get("/", (req, res) => {
  res.send("API is Running");
});

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server Started on PORT ${PORT}`));
