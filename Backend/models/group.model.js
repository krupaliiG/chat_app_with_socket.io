const mongoose = require("mongoose");

const groupSchema = mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Group", groupSchema);
