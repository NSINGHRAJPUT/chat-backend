// app.js

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { initSocket } = require("./socket"); // Import the initSocket function

dotenv.config();
const { connectDB } = require("./dbConfig/db");
const feedRoutes = require("./routes/feeds");
const userRouter = require("./routes/user");
const authRouter = require("./routes/authRouter");

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// // Enable CORS for HTTP requests
// app.use(cors());

// Add headers for HTTP CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

connectDB();
initSocket(server); // Initialize the io instance

app.use("/feed", feedRoutes);
app.use("/user", userRouter);
app.use("/auth", authRouter);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
