const mongoose = require("mongoose");

const projectUserSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

const ProjectUser = mongoose.model("ProjectUser", projectUserSchema);
module.exports = { ProjectUser };
