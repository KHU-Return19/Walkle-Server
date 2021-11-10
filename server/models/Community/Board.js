const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const boardSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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
  heart: {
    type: Number,
    default: 0,
  },
  no: {
    type: Number,
    required: true,
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
  field: "no",
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

boardSchema.statics.getObjectIdByNo = function (no, cb) {
  var board = this;
  board.findOne({ no: no }, (err, founded) => {
    if (err) {
      return cb(err);
    } else {
      if (!founded) {
        return cb(null, null);
      } else {
        return cb(null, founded._id);
      }
    }
  });
};
const Board = mongoose.model("Board", boardSchema);
module.exports = { Board };
