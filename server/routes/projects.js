const express = require("express");
const router = express.Router();

const { Project } = require("../models/Project/Project");
const { ProjectUser } = require("../models/Project/ProjectUser");
const { auth } = require("../middleware/auth");
const { postPermission } = require("../middleware/projectPermission");
const { Category } = require("../models/Project/Category");
const { Profile } = require("../models/UserProfile/Profile");
const { Bookmark } = require("../models/Project/Bookmark");
const { ProjectCategory } = require("../models/Project/ProjectCategoty");

// Read project
router.get("/posts/:id", auth, (req, res) => {
  const projectId = req.params.id;
  Project.findOne({ id: projectId }, (err, project) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else if (!project) {
      return res.status(400).json({ msg: "Project Not Found" });
    } else {
      // Update views
      project.updateViews(async () => {
        // Get MemberList
        const memberIdList = [];
        ProjectUser.find(
          { projectId: projectId },
          async (err, projectUsers) => {
            for (const projectUser of projectUsers) {
              memberIdList.push(projectUser.userId);
            }
            // Get tags
            const tags = [];
            for (const tag of project.tags) {
              tags.push(tag.name);
            }
            // Get categories
            const categoryIdList = [];
            ProjectCategory.find(
              { projectId: projectId },
              async (err, projectCategories) => {
                for (projectCategory of projectCategories) {
                  categoryIdList.push(projectCategory.categoryId);
                }
                const response = {
                  id: project.id,
                  userId: project.userId,
                  title: project.title,
                  introduction: project.introduction,
                  description: project.description,
                  status: project.status,
                  recruitStart: project.recruitStart,
                  recruitEnd: project.recruitEnd,
                  views: project.views,
                  createdAt: project.createdAt,
                  tags: tags,
                  nickname: await Profile.getnickname(project.userId),
                  memberIdList: memberIdList,
                  categoryIdList: categoryIdList,
                };
                return res.status(200).json({ communities: response });
              }
            );
          }
        );
      });
    }
  });
});

// Write project
router.post("/posts", auth, (req, res) => {
  const newProject = new Project({
    userId: req.user._id,
    title: req.body.title,
    introduction: req.body.introduction,
    description: req.body.description,
    status: req.body.status,
  });
  if (req.body.status == 1) {
    newProject.recruitStart = req.body.recruitStart;
    newProject.recruitEnd = req.body.recruitEnd;
  }
  for (const tag of req.body.tags) {
    const newTag = {
      name: tag,
    };
    newProject.tags.push(newTag);
  }
  newProject.save((err, saved) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      // Save project member
      const memberIdList = req.body.memberIdList;
      memberIdList.push(req.user._id);
      saveProjectMember(saved.id, memberIdList);

      // Save project category
      saveProjectCategory(saved.id, req.body.categoryIdList);

      return res.status(201).json({ projectId: saved.id });
    }
  });
});

// Update project
router.put("/posts/:id", auth, postPermission, async (req, res) => {
  const projectId = req.params.id;
  const update = {
    title: req.body.title,
    introduction: req.body.introduction,
    description: req.body.description,
    status: req.body.status,
  };
  if (req.body.status == 1) {
    update.recruitStart = req.body.recruitStart;
    update.recruitEnd = req.body.recruitEnd;
  }
  update.tags = [];
  for (const tag of req.body.tags) {
    const newTag = {
      name: tag,
    };
    update.tags.push(newTag);
  }
  saveProjectMember(projectId, req.body.memberIdList);
  saveProjectCategory(projectId, req.body.categoryIdList);

  await Project.updateOne({ id: projectId }, update);
  return res.status(200).json({ projectId: projectId });
});

// Delete project
router.delete("/posts/:id", auth, postPermission, (req, res) => {
  const project = req.project;
  project.delete((err, deleted) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      return res.status(204).json();
    }
  });
});

// Save project member
const saveProjectMember = (projectId, memberIdList) => {
  ProjectUser.deleteMany({ projectId: projectId }, (err, deleted) => {
    for (const userId of memberIdList) {
      const newProjectUser = new ProjectUser({
        userId: userId,
        projectId: projectId,
      });
      newProjectUser.save();
    }
  });
};

// Save project category
const saveProjectCategory = (projectId, categoryIdList) => {
  ProjectCategory.deleteMany({ projectId: projectId }, (err, deleted) => {
    for (const categoryId of categoryIdList) {
      const newProjectCategory = new ProjectCategory({
        projectId: projectId,
        categoryId: categoryId,
      });
      newProjectCategory.save();
    }
  });
};

// Save bookmark
router.post("/bookmark", auth, (req, res) => {
  Project.findOne({ id: req.query.projectId }, (err, project) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else if (!project) {
      return res.status(400).json({ msg: "Project Not Found" });
    } else {
      const newBookmark = new Bookmark({
        userId: req.user._id,
        projectId: project.id,
      });
      newBookmark.save((err, saved) => {
        if (err) {
          return res.status(400).json({ msg: err });
        } else {
          return res.status(201).json({ bookmarkId: saved._id });
        }
      });
    }
  });
});

// Delete Bookmark
router.delete("/bookmark/:id", auth, (req, res) => {
  Bookmark.findOne({ id: req.params.id }, (err, bookmark) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else if (!bookmark) {
      return res.status(400).json({ msg: "Bookmark Not Found" });
    } else {
      bookmark.delete((err, deleted) => {
        if (err) {
          return res.status(400).json({ msg: err });
        } else {
          return res.status(204).json();
        }
      });
    }
  });
});

// Read Bookmark
router.get("/bookmark", auth, (req, res) => {
  Bookmark.find({ userId: req.user._id })
    .exec()
    .then(async (bookmarks) => {
      const response = [];

      for (const bookmark of bookmarks) {
        Project.findOne({ id: bookmark.projectId })
          .exec()
          .then(async (project) => {
            console.log("s");
            response.push({
              id: project.id,
              title: project.title,
              introduction: project.introduction,
              status: project.status,
              views: project.views,
              createdAt: project.createdAt,
              nickname: await Profile.getnickname(project.userId),
            });
          });
      }
      return res.status(200).json({ bookmarks: response });
    });
});

// Add project category
router.post("/category", auth, (req, res) => {
  const newCategory = new Category({
    name: req.body.name,
  });
  newCategory.save((err, saved) => {
    return res.status(201).json({ id: saved.id });
  });
});

// Read project category
router.get("/category", auth, (req, res) => {
  Category.find((err, categories) => {
    return res.status(200).json({ categories: categories });
  });
});
module.exports = router;
