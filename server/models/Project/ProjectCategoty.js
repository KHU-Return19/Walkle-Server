const mongoose = require("mongoose");

const projectCategorySchema = mongoose.Schema({
  projectId: {
    type: Number,
    ref: "Project",
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

const ProjectCategory = mongoose.model(
  "ProjectCategory",
  projectCategorySchema
);
module.exports = { ProjectCategory };
