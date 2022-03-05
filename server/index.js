const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

connectDB();
const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("API is Running");
});

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server Started on PORT ${PORT}`));
