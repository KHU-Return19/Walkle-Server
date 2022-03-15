const express = require("express");
const router = express.Router();

const { Project } = require("../models/Project/Project");
const { auth } = require("../middleware/auth");
const { postPermission } = require("../middleware/projectPermission");
const { Category } = require("../models/Project/Category");
const { Profile } = require("../models/UserProfile/Profile");
const { response } = require("express");

router.post("/:id/bookmarks", auth, (req, res) => {
  /* 	#swagger.tags = ['Project']
      #swagger.summary = "프로젝트 게시글 북마크 / 북마크 취소"*/
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

router.put("/:id/members", auth, async (req, res) => {
  /* 	#swagger.tags = ['Project']
      #swagger.summary = "프로젝트 참가자 수정"*/
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

router.put("/:id/applicants", auth, async (req, res) => {
  /* 	#swagger.tags = ['Project']
      #swagger.summary = "프로젝트 지원자 수정"*/
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

router.put("/:id/invites", auth, async (req, res) => {
  /* 	#swagger.tags = ['Project']
      #swagger.summary = "프로젝트 참가자 초대 수정"*/
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

router.get("/users/members", auth, async (req, res) => {
  /* 	#swagger.tags = ['Project']
      #swagger.summary = "참가 프로젝트 조회"*/
  var userId = req.user._id;

  if (req.query.userId != null) {
    userId = req.query.userId;
  }
  const projects = await Project.find({ "members.userId": userId });

  const response = await projectListRes(projects);

  return res.status(200).json({ projects: response });
});

router.get("/users/applicants", auth, async (req, res) => {
  /* 	#swagger.tags = ['Project']
      #swagger.summary = "지원 프로젝트 조회"*/

  var userId = req.user._id;

  if (req.query.userId != null) {
    userId = req.query.userId;
  }

  const projects = await Project.find({ "applicants.userId": userId });

  const response = await projectListRes(projects);

  return res.status(200).json({ projects: response });
});

router.get("/users/invites", auth, async (req, res) => {
  /* 	#swagger.tags = ['Project']
      #swagger.summary = "초대받은 프로젝트 조회"*/
  var userId = req.user._id;

  if (req.query.userId != null) {
    userId = req.query.userId;
  }

  const projects = await Project.find({ "invites.userId": userId });

  const response = await projectListRes(projects);

  return res.status(200).json({ projects: response });
});

router.get("/users", auth, async (req, res) => {
  /* 	#swagger.tags = ['Project']
      #swagger.summary = "작성자별 프로젝트 게시글 조회"*/

  var userId = req.user._id;

  if (req.query.userId != null) {
    userId = req.query.userId;
  }

  const projects = await Project.find({ userId: userId }).sort({
    createdAt: -1,
  });

  const response = await projectListRes(projects, userId);

  return res.status(200).json({ projects: response });
});
router.get("/bookmarks", auth, async (req, res) => {
  /* 	#swagger.tags = ['Project']
      #swagger.summary = "북마크한 프로젝트 게시글 조회"*/
  var userId = req.user._id;

  if (req.query.userId != null) {
    userId = req.query.userId;
  }

  const projects = await Project.find({ "bookmarks.userId": userId }).sort({
    createdAt: -1,
  });

  const response = await projectListRes(projects, userId);

  return res.status(200).json({ projects: response });
});

router.post("/category", (req, res) => {
  /* 	#swagger.tags = ['Project']
      #swagger.summary = "프로젝트 카테고리 등록"*/
  const newCategory = new Category({
    name: req.body.name,
  });
  newCategory.save((err, category) => {
    return res.status(201).json({ category: category });
  });
});

router.get("/category", (req, res) => {
  /* 	#swagger.tags = ['Project']
      #swagger.summary = "프로젝트 카테고리 전체 조회"*/
  Category.find((err, categories) => {
    return res.status(200).json({ categories: categories });
  });
});

router.delete("/:id", auth, postPermission, (req, res) => {
  /* 	#swagger.tags = ['Project']
      #swagger.summary = "프로젝트 게시글 삭제"*/
  const project = req.project;
  project.delete((err, deleted) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      return res.status(204).json();
    }
  });
});

router.get("/:id", auth, async (req, res) => {
  /* 	#swagger.tags = ['Project']
      #swagger.summary = "프로젝트 게시글 조회"*/
  const projectId = req.params.id;
  const project = await Project.findOne({ _id: projectId }).populate("categories.categoryId", { _id: 1, name: 2 });

  if (!project) {
    return res.status(400).json({ msg: "Project Not Found" });
  } else {
    // 조회수 업데이트
    project.updateViews(async () => {
      const response = await projectRes(project, req.user._id);
      return res.status(200).json({ project: response });
    });
  }
});

router.put("/:id", auth, postPermission, async (req, res) => {
  /* 	#swagger.tags = ['Project']
      #swagger.summary = "프로젝트 게시글 수정"*/
  const projectId = req.params.id;
  const update = {
    title: req.body.title,
    content: req.body.content,
    description: req.body.description,
    status: req.body.status,
    lon: req.body.lon,
    lat: req.body.lat,
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
    update.tags.push({ tag: tag });
  }

  // 카테고리
  update.categories = [];
  for (const cateogryId of req.body.categoryIdList) {
    update.categories.push({
      categoryId: cateogryId,
    });
  }

  await Project.updateOne({ _id: projectId }, update);
  return res.status(200).json({ projectId: projectId });
});

router.get("/", auth, async (req, res) => {
  /* 	#swagger.tags = ['Project']
      #swagger.summary = "프로젝트 게시글 목록 조회"*/
  const projects = await Project.find().sort({ createdAt: -1 }).populate("categories.categoryId", { _id: 1, name: 2 });
  const response = await projectListRes(projects, req.user._id);

  return res.status(200).json({ projects: response });
});

router.post("/", auth, (req, res) => {
  /* 	#swagger.tags = ['Project']
      #swagger.summary = "프로젝트 게시글 작성"*/
  const newProject = new Project({
    userId: req.user._id,
    title: req.body.title,
    content: req.body.content,
    description: req.body.description,
    status: req.body.status,
    lon: req.body.lon,
    lat: req.body.lat,
  });

  // 모집 상태 구분
  if (req.body.status == 1) {
    // 0 : 상시모집, 1 : 기간 내 모집, 2 : 모집 종료
    newProject.startAt = req.body.startAt;
    newProject.endAt = req.body.endAt;
  }

  // 태그
  for (const tag of req.body.tags) {
    newProject.tags.push({ tag: tag });
  }

  // 카테고리
  for (const cateogryId of req.body.categoryIdList) {
    newProject.categories.push({
      categoryId: cateogryId,
    });
  }

  // 작성자 참가자 추가
  newProject.members = [];
  newProject.members.push({
    userId: req.user._id,
  });

  newProject.save((err, project) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      return res.status(201).json({ projectId: project._id });
    }
  });
});

// response
// 프로젝트 게시글 목록
const projectListRes = async (projects, userId) => {
  const repsonse = [];
  for (const project of projects) {
    const projectResponse = await projectRes(project, userId);
    repsonse.push(projectResponse);
  }
  return repsonse;
};
// 프로젝트 게시글
const projectRes = async (project, userId) => {
  const response = {
    id: project.id,
    userId: project.userId,
    nickname: await Profile.getNickname(project.userId),
    title: project.title,
    content: project.content,
    description: project.description,
    status: project.status,
    startAt: project.startAt,
    endAt: project.endAt,
    lat: project.lat,
    lon: project.lon,
    createdAt: project.createdAt,
    tags: project.tags,
  };

  // 참가자
  const members = [];
  for (member of project.members) {
    members.push({
      userId: member.userId,
      nickname: await Profile.getNickname(member.userId),
      job: await Profile.getJob(member.userId),
    });
  }
  response.members = members;

  // 지원자
  const applicants = [];
  for (applicant of project.applicants) {
    applicants.push({
      userId: applicant.userId,
      nickname: await Profile.getNickname(applicant.userId),
      job: await Profile.getJob(applicant.userId),
    });
  }
  response.applicants = applicants;

  // 지원자
  const invites = [];
  for (invite of project.invites) {
    invites.push({
      userId: invite.userId,
      nickname: await Profile.getNickname(invite.userId),
      job: await Profile.getJob(invite.userId),
    });
  }
  response.invites = invites;

  // 카테고리
  const categories = [];
  for (category of project.categories) {
    if (!category) {
      categories.push({
        categoryId: category.categoryId._id,
        name: category.categoryId.name,
      });
    }
  }
  response.categories = categories;

  // 북마크
  const bookmark = project.bookmarks.filter((e) => userId.equals(e.userId));
  if (bookmark.length === 0) {
    response.isBookmarked = false;
  } else {
    response.isBookmarked = true;
  }

  response.bookmarks = project.bookmarks.length;

  return response;
};
module.exports = router;
