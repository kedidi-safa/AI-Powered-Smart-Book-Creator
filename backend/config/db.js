const mongoose = require("mongoose");

const password = encodeURIComponent(process.env.MONGO_PASSWORD.trim());
const connectionString = `mongodb+srv://test:${password}@smartbookcreator.7zcnjf7.mongodb.net/?appName=smartBookCreator`;

const connectDB = async () => {
  try {
    await mongoose.connect(connectionString, {});
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
};

module.exports = connectDB;
