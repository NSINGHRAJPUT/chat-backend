const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const https = require("https"); // Change http to https
const fs = require("fs"); // Required for HTTPS
const { initSocket } = require("./socket");

dotenv.config();
const { connectDB } = require("./dbConfig/db");
const feedRoutes = require("./routes/feeds");
const userRouter = require("./routes/user");
const authRouter = require("./routes/authRouter");

const app = express();

// // Load HTTPS key and certificate
// const httpsOptions = {
//   key: fs.readFileSync("your_private_key.pem"),
//   cert: fs.readFileSync("your_certificate.pem"),
// };

const server = https.createServer(app); // Use https.createServer

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
  origin: process.env.URL,
};

app.use(cors(corsOptions));

connectDB();
initSocket(server);

app.use("/feed", feedRoutes);
app.use("/user", userRouter);
app.use("/auth", authRouter);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
