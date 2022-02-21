const express = require("express");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

const app = express();
require("dotenv").config();

connectDB();
app.use(express.json()); // Allows us to accept JSON data in the body

var router = express.Router();

app.get("/", (req, res) => {
  res.send("API is running...");
  console.log("HELLO");
});

app.use("/api/users", userRoutes);
// app.use("/login", login);

app.use(notFound);
app.use(errorHandler);

app.listen(5000, console.log("Server running on port 5000"));