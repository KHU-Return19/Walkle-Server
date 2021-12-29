const mongoose = require("mongoose");

const projectUserSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  projectId: {
    type: Number,
    ref: "Project",
  },
});

const ProjectUser = mongoose.model("ProjectUser", projectUserSchema);
module.exports = { ProjectUser };
