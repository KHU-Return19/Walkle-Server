const express = require("express");
const router = express.Router();

const { Project } = require("../models/Project/Project");
const { auth } = require("../middleware/auth");
const { postPermission } = require("../middleware/projectPermission");
const { Category } = require("../models/Project/Category");
const { Profile } = require("../models/UserProfile/Profile");

// 프로젝트 게시글 조회
router.get("/posts/:id", auth, (req, res) => {
  const projectId = req.params.id;
  Project.findOne({ _id: projectId })
    .populate("categories.categoryId", { _id: 1, name: 2 })
    .then((project) => {
      if (!project) {
        return res.status(400).json({ msg: "Project Not Found" });
      } else {
        // 조회수 업데이트
        project.updateViews(async () => {
          return res.status(200).json({ project: project });
        });
      }
    });
});

// 프로젝트 게시글 목록 조회
router.get("/posts", auth, (req, res) => {
  const projectId = req.params.id;
  Project.find()
    .sort({ createdAt: -1 })
    .populate("categories.categoryId", { _id: 1, name: 2 })
    .then((projects) => {
      return res.status(200).json({ project: projects });
    });
});

// 프로젝트 게시글 작성
router.post("/posts", auth, (req, res) => {
  const newProject = new Project({
    userId: req.user._id,
    title: req.body.title,
    introduction: req.body.introduction,
    description: req.body.description,
    status: req.body.status,
  });

  // 모집 상태 구분
  if (req.body.status == 1) {
    // 0 : 상시모집, 1 : 기간 내 모집, 2 : 모집 종료
    newProject.startAt = req.body.startAt;
    newProject.endAt = req.body.endAt;
  }

  // 태그
  for (const tag of req.body.tags) {
    const newTag = {
      name: tag,
    };
    newProject.tags.push(newTag);
  }

  // 카테고리
  for (const cateogryId of req.body.categoryIdList) {
    const newCategory = {
      categoryId: cateogryId,
    };
    newProject.categories.push(newCategory);
  }

  // 참가자
  req.body.memberIdList.push(req.user._id);
  for (const memberId of req.body.memberIdList) {
    const newMember = {
      userId: memberId,
    };
    newProject.members.push(newMember);
  }

  newProject.save((err, project) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      return res.status(201).json({ projectId: project._id });
    }
  });
});

// 프로젝트 게시글 수정
router.put("/posts/:id", auth, postPermission, async (req, res) => {
  const projectId = req.params.id;
  const update = {
    title: req.body.title,
    introduction: req.body.introduction,
    description: req.body.description,
    status: req.body.status,
  };

  // 모집 상태 구분
  if (req.body.status == 1) {
    // 0 : 상시모집, 1 : 기간 내 모집, 2 : 모집 종료
    update.startAt = req.body.startAt;
    update.endAt = req.body.endAt;
  }

  // 태그
  update.tags = [];
  for (const tag of req.body.tags) {
    const newTag = {
      name: tag,
    };
    update.tags.push(newTag);
  }

  // 카테고리
  update.categories = [];
  for (const cateogryId of req.body.categoryIdList) {
    const newCategory = {
      categoryId: cateogryId,
    };
    update.categories.push(newCategory);
  }

  // 참가자
  update.members = [];
  for (const memberId of req.body.memberIdList) {
    const newMember = {
      userId: memberId,
    };
    update.members.push(newMember);
  }
  await Project.updateOne({ _id: projectId }, update);
  return res.status(200).json({ projectId: projectId });
});

// 프로젝트 게시글 삭제
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

// 프로젝트 카테고리 등록
router.post("/category", (req, res) => {
  const newCategory = new Category({
    name: req.body.name,
  });
  newCategory.save((err, category) => {
    return res.status(201).json({ category: category });
  });
});

// 프로젝트 카테고리 전체 조회
router.get("/category", (req, res) => {
  Category.find((err, categories) => {
    return res.status(200).json({ categories: categories });
  });
});

// 프로젝트 게시글 북마크 / 북마크 취소
router.post("/posts/:id/bookmarks", auth, (req, res) => {
  const userId = req.user._id;
  const newBookmark = {
    userId: userId,
  };
  Project.findOne({ _id: req.params.id }, (err, project) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else if (!project) {
      return res.status(400).json({ msg: "Project Not Found" });
    } else {
      const bookmarks = project.bookmarks;
      const bookmark = bookmarks.filter((e) => userId.equals(e.userId));
      if (bookmark.length === 0) {
        // 북마크
        project.bookmarks.push(newBookmark);

        project.save((err, sace) => {
          if (err) {
            return res.status(400).json({ msg: err });
          } else {
            return res.status(201).json({ projectId: project._id });
          }
        });
      } else {
        const removed = project.bookmarks.id(bookmark[0]._id);
        removed.remove();
        project.save((err, sace) => {
          if (err) {
            return res.status(400).json({ msg: err });
          } else {
            return res.status(204).json(null);
          }
        });
      }
    }
  });
});

router.get("/users/:userId/bookmarks", auth, (req, res) => {
  /* 	#swagger.tags = ['Project']
      #swagger.summary = "공감한 프로젝트 게시글 조회"*/
  const userId = req.params.userId;

  Project.find({ "bookmarks.userId": userId })
    .sort({ createdAt: -1 })
    .then(async (projects) => {
      return res.status(200).json({ project: projects });
    });
});

// 프로젝트 참가자 수정
router.put("/posts/:id/members", auth, async (req, res) => {
  const projectId = req.params.id;
  const update = {};
  // 참가자
  update.members = [];
  for (const memberId of req.body.memberIdList) {
    const newMember = {
      userId: memberId,
    };
    update.members.push(newMember);
  }
  await Project.updateOne({ _id: projectId }, update);
  return res.status(200).json({ projectId: projectId });
});

// 프로젝트 지원자 수정
router.put("/posts/:id/applicants", auth, async (req, res) => {
  const projectId = req.params.id;
  const update = {};
  // 참가자
  update.applicants = [];
  for (const applicantId of req.body.applicantIdList) {
    const newApplicant = {
      userId: applicantId,
    };
    update.applicants.push(newApplicant);
  }
  await Project.updateOne({ _id: projectId }, update);
  return res.status(200).json({ projectId: projectId });
});
// 프로젝트 참가자 초대 수정
router.put("/posts/:id/invites", auth, async (req, res) => {
  const projectId = req.params.id;
  const update = {};
  // 참가자
  update.invites = [];
  for (const inviteId of req.body.inviteIdList) {
    const newInvite = {
      userId: inviteId,
    };
    update.invites.push(newInvite);
  }
  await Project.updateOne({ _id: projectId }, update);
  return res.status(200).json({ projectId: projectId });
});
module.exports = router;
