const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API is Running");
});

app.use("/api/user", userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server Started on PORT ${PORT}`));
