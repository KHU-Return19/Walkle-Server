const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const commentSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const heartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  id: {
    type: Number,
    default: 1,
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
  hearts: [heartSchema],
});

communitySchema.plugin(autoIncrement.plugin, {
  model: "community",
  field: "id",
  startAt: 1,
  increment: 1,
});

communitySchema.methods.updateViews = function (cb) {
  var community = this;
  community.views++;
  community.save();
  return cb();
};

const Community = mongoose.model("Community", communitySchema);
module.exports = { Community };
