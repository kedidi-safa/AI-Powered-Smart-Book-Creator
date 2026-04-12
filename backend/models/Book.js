const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
});

const bookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      required: true,
    },
    coverImage: {
      url: { type: String, default: "" },
      key: { type: String, default: "" },
      
    },
    chapters: [chapterSchema],
    status: {
      type: String,
      enum: ["draft", "publisher"],
      default: "draft",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Book", bookSchema);
