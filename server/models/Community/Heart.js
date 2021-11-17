const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const heartSchema = mongoose.Schema({
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
  state: {
    type: Boolean,
    required: true,
    default: false,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});
heartSchema.plugin(autoIncrement.plugin, {
  model: "heart",
  field: "id",
  startAt: 1,
  increment: 1,
});

heartSchema.statics.createHeart = function (userId, boardId) {
  var Heart = this;
  let newHeart = new Heart({
    userId: userId,
    boardId: boardId,
    state: false,
    updateAt: Date.now(),
  });
  newHeart.save((err, saved) => {});
};

heartSchema.methods.updateHeart = function (cb) {
  var heart = this;
  heart.state = !heart.state;
  heart.updateAt = Date.now();
  heart.save((err, saved) => {
    if (err) {
      return cb(err);
    } else {
      return cb(null, saved);
    }
  });
};
heartSchema.statics.deleteByBoardId = function (boardId) {
  Heart.deleteMany({ boardId: boardId }, (err, deleted) => {});
};
const Heart = mongoose.model("Heart", heartSchema);
module.exports = { Heart };
