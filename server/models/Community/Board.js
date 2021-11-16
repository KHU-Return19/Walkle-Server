const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

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
  updateAt: {
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

boardSchema.methods.updateHeart = function (cb) {
  var board = this;
  board.heart++;
  board.save();
  return cb();
};

boardSchema.methods.updateView = function (cb) {
  var board = this;
  board.view++;
  board.save();
  return cb();
};

const Board = mongoose.model("Board", boardSchema);
module.exports = { Board };
