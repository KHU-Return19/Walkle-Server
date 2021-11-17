const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const projectSchema = mongoose.Schema({
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

projectSchema.plugin(autoIncrement.plugin, {
  model: "project",
  field: "id",
  startAt: 1,
  increment: 1,
});

projectSchema.methods.updateView = function (cb) {
  var project = this;
  project.view++;
  project.save();
  return cb();
};

projectdSchema.methods.getNumberOfComments = async function () {
  var data;
  await Comment.find({ projectId: this.id }).then((comments) => {
    data = comments.length;
  });
  return data;
};

projectSchema.methods.getNumberOfHearts = async function () {
  var data;
  await Heart.find({ boardId: this.id, state: true }).then((hearts) => {
    data = hearts.length;
  });
  return data;
};
projectSchema.methods.getComments = async function () {
  Comment.find({ boardId: this.id }, (err, comments) => {
    return comments;
  });
};
const Project = mongoose.model("Project", projectSchema);
module.exports = { Project };
