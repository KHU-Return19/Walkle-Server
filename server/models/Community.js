const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const commentSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

const communitySchema = mongoose.Schema({
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
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [commentSchema],
});

communitySchema.plugin(autoIncrement.plugin, {
  model: "community",
  field: "id",
  startAt: 1,
  increment: 1,
});

commentSchema.plugin(autoIncrement.plugin, {
  model: "comment",
  field: "id",
  startAt: 1,
  increment: 1,
});

// boardSchema.methods.updateView = function (cb) {
//   var board = this;
//   board.view++;
//   board.save();
//   return cb();
// };

const Community = mongoose.model("Community", communitySchema);
module.exports = { Community };
