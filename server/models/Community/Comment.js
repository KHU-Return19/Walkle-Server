const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const commentSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  userId: {
    type: Number,
    ref: "User",
    required: true,
  },
  boardId: {
    type: Number,
    ref: "Board",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
commentSchema.plugin(autoIncrement.plugin, {
  model: "comment",
  field: "id",
  startAt: 1,
  increment: 1,
});

commentSchema.statics.deleteByBoardId = function (boardId) {
  Comment.deleteMany({ boardId: boardId }, (err, deleted) => {});
};

const Comment = mongoose.model("Comment", commentSchema);
module.exports = { Comment };
