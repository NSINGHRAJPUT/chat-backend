const mongoose = require("mongoose");

const Feeds = require("../model/feeds");
const User = require("../model/user");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MOONGOOSE_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const models = { Feeds, User };

module.exports = { connectDB, models };
