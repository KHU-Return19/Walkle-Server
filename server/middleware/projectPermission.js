const { Project } = require("../models/Project/Project");

const postPermission = (req, res, next) => {
  const userId = req.user._id;
  const projectId = req.params.id;

  Project.findOne({ _id: projectId }, (err, project) => {
    if (err) throw err;
    if (!project) {
      return res.status(400).json({ msg: "Project Not Found" });
    } else if (!userId.equals(project.userId)) {
      return res.status(403).json({ msg: "Forbidden" });
    } else {
      req.project = project;
      next();
    }
  });
};

module.exports = { postPermission };
