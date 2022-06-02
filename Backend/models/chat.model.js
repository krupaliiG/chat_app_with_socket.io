const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    groupId: {
      type: mongoose.Types.ObjectId,
      ref: "Group",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Chat", chatSchema);
