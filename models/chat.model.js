const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  time: {
    type: String,
  },
});

module.exports = mongoose.model("Chat", chatSchema);
