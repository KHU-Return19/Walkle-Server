const mongoose = require("mongoose");
const { Category } = require("./Category");

// 참가
const memberSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// 지원
const applicantSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// 초대
const inviteSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// 북마크
const bookmarkSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const projectSchema = mongoose.Schema({
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
    defulat: "",
  },
  description: {
    type: String,
    defulat: "",
  },
  status: {
    type: Number,
  },
  startAt: {
    type: Date,
    default: null,
  },
  endAt: {
    type: Date,
    default: null,
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
  tags: [{ name: String }],
  members: [memberSchema],
  applicants: [applicantSchema],
  categories: [
    {
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    },
  ],
  invites: [inviteSchema],
  bookmarks: [bookmarkSchema],
});

projectSchema.methods.updateViews = function (cb) {
  var project = this;
  project.views++;
  project.save();
  return cb();
};

const Project = mongoose.model("Project", projectSchema);
const Applicant = mongoose.model("Applicant", applicantSchema);
const Member = mongoose.model("Member", memberSchema);
const Invite = mongoose.model("Invite", inviteSchema);
const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

module.exports = { Project, Applicant, Member, Invite, Bookmark };
