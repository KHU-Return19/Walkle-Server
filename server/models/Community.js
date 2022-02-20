const mongoose = require("mongoose");

// 댓글
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

// 공감
const heartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// 커뮤니티 게시글
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
  lat: {
    type: Number,
  },
  lon: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  images: [{ image: String }],
  comments: [commentSchema],
  hearts: [heartSchema],
});

communitySchema.methods.updateViews = function (cb) {
  var community = this;
  community.views++;
  community.save();
  return cb();
};

const Community = mongoose.model("Community", communitySchema);
const Comment = mongoose.model("Comment", commentSchema);

const Heart = mongoose.model("Heart", heartSchema);

module.exports = { Community, Comment, Heart };
