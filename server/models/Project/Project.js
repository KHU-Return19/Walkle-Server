const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

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
  id: {
    type: Number,
    default: 1,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
  },
  deadline: {
    type: Date,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tags: [{ name: String }],
});

projectSchema.plugin(autoIncrement.plugin, {
  model: "project",
  field: "id",
  startAt: 1,
  increment: 1,
});

projectSchema.methods.updateViews = function (cb) {
  var project = this;
  project.views++;
  project.save();
  return cb();
};

const Project = mongoose.model("Project", projectSchema);
module.exports = { Project };
