const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);
const { Comment } = require("./Comment");
const { Heart } = require("./Heart");

const boardSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  userId: {
    type: Number,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  view: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

boardSchema.plugin(autoIncrement.plugin, {
  model: "board",
  field: "id",
  startAt: 1,
  increment: 1,
});

boardSchema.methods.updateView = function (cb) {
  var board = this;
  board.view++;
  board.save();
  return cb();
};

boardSchema.methods.getNumberOfComments = async function () {
  var data;
  await Comment.find({ boardId: this.id }).then((comments) => {
    data = comments.length;
  });
  return data;
};

boardSchema.methods.getNumberOfHearts = async function () {
  var data;
  await Heart.find({ boardId: this.id, state: true }).then((hearts) => {
    data = hearts.length;
  });
  return data;
};

boardSchema.methods.getComments = async function () {
  Comment.find({ boardId: this.id }, (err, comments) => {
    return comments;
  });
};
const Board = mongoose.model("Board", boardSchema);
module.exports = { Board };
