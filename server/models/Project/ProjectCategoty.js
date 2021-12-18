const mongoose = require("mongoose");

const projectCategorySchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
