const mongoose = require("mongoose");

const bookmarkSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  projectId: {
    type: Number,
    ref: "Project",
  },
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
module.exports = { Bookmark };
