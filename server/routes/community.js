const express = require("express");
const router = express.Router();

const { Community, Comment, Heart } = require("../models/Community");
const { auth } = require("../middleware/auth");
const { postPermission, commentPermission } = require("../middleware/communityPermission");
const { Profile } = require("../models/UserProfile/Profile");

router.put("/:id/comments/:commentId", auth, commentPermission, (req, res) => {
  /* 	#swagger.tags = ['Community']
      #swagger.summary = "커뮤니티 댓글 수정"*/
  const community = req.community;
  const comment = req.comment;
  comment.content = req.body.content;
  community.save((err, saved) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }
    return res.status(201).json({ commentId: comment._id });
  });
});

router.delete("/:id/comments/:commentId", auth, commentPermission, (req, res) => {
  /* 	#swagger.tags = ['Community']
      #swagger.summary = "커뮤니티 댓글 삭제" */
  const community = req.community;
  const comment = req.comment;
  comment.remove();
  community.save((err, saved) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }
    return res.status(204).json(null);
  });
});

router.post("/:id/comments", auth, (req, res) => {
  /* 	#swagger.tags = ['Community']
      #swagger.summary = "커뮤니티 댓글 작성" */
  const newComment = {
    userId: req.user._id,
    content: req.body.content,
  };
  Community.findOne({ _id: req.params.id }, (err, community) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else if (!community) {
      return res.status(400).json({ msg: "Community Not Found" });
    } else {
      // 댓글 작성
      const numOfComment = community.comments.push(newComment);

      community.save((err, saved) => {
        if (err) {
          return res.status(400).json({ msg: err });
        }
        return res.status(201).json({ commentId: community.comments[numOfComment - 1]._id });
      });
    }
  });
});

router.post("/:id/hearts", auth, (req, res) => {
  /* 	#swagger.tags = ['Community']
      #swagger.summary = "커뮤니티 게시글 공감 / 공감 취소"*/
  const communityId = req.params.id;
  const userId = req.user._id;
  const newHeart = {
    userId: userId,
  };

  Community.findOne({ _id: communityId }, (err, community) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else if (!community) {
      return res.status(400).json({ msg: "Community Not Found" });
    } else {
      const hearts = community.hearts;
      const heart = hearts.filter((e) => userId.equals(e.userId));

      if (heart.length === 0) {
        // 공감
        const numOfHeart = community.hearts.push(newHeart);

        community.save((err, saved) => {
          if (err) {
            return res.status(400).json({ msg: err });
          }
          return res.status(201).json({ communityId: communityId });
        });
      } else {
        // 공감 취소
        const removed = community.hearts.id(heart[0]._id);
        removed.remove();
        community.save((err, saved) => {
          if (err) {
            return res.status(400).json({ msg: err });
          }
          return res.status(204).json(null);
        });
      }
    }
  });
});

router.get("/users/hearts", auth, async (req, res) => {
  /* 	#swagger.tags = ['Community']
      #swagger.summary = "공감한 커뮤니티 게시글 조회"*/
  const userId = req.query.userId;

  if (userId == null) {
    userId = req.user._id;
  }

  const communities = await Community.find({ "hearts.userId": userId }).sort({
    createdAt: -1,
  });

  const response = await communityListRes(communities);

  return res.status(200).json({ communities: response });
});

router.get("/users", auth, async (req, res) => {
  /* 	#swagger.tags = ['Community']
      #swagger.summary = "작성자별 커뮤니티 게시글 조회" */
  var userId = req.user._id;

  if (req.query.userId != null) {
    userId = req.query.userId;
  }
  const communities = await Community.find({ userId: userId }).sort({
    createdAt: -1,
  });

  const response = await communityListRes(communities);

  return res.status(200).json({ communities: response });
});

router.get("/:id", auth, async (req, res) => {
  /* 	#swagger.tags = ['Community']
      #swagger.summary = "커뮤니티 게시글 조회" */
  const community = await Community.findOne({ _id: req.params.id });
  if (!community) {
    return res.status(400).json({ msg: "Community Not Found" });
  } else {
    community.updateViews(async () => {
      const response = await communityRes(community);
      return res.status(200).json({ community: response });
    });
  }
});

router.get("/", auth, async (req, res) => {
  /* 	#swagger.tags = ['Community']
      #swagger.summary = "커뮤니티 게시글 목록 조회" */
  const communities = await Community.find().sort({ createdAt: -1 });
  const response = await communityListRes(communities);
  return res.status(200).json({ communities: response });
});

router.post("/", auth, (req, res) => {
  /* 	#swagger.tags = ['Community']
      #swagger.summary = "커뮤니티 게시글 작성" */
  const newCommunity = new Community({
    userId: req.user._id,
    title: req.body.title,
    content: req.body.content,
    lon: req.body.lon,
    lat: req.body.lat,
  });

  // 이미지
  for (const image of req.body.images) {
    newCommunity.images.push({ image: image });
  }

  newCommunity.save((err, saved) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      return res.status(201).json({ communityId: saved._id });
    }
  });
});

router.put("/:id", auth, postPermission, async (req, res) => {
  /* 	#swagger.tags = ['Community']
      #swagger.summary = "커뮤니티 게시글 수정" */
  const update = {
    title: req.body.title,
    content: req.body.content,
    lon: req.body.lon,
    lat: req.body.lat,
  };

  update.images = [];
  for (const image of req.body.images) {
    update.images.push({ image: image });
  }
  await Community.updateOne({ _id: req.community.id }, update);
  return res.status(200).json({ community: req.community.id });
});

router.delete(":id", auth, postPermission, (req, res) => {
  /* 	#swagger.tags = ['Community']
      #swagger.summary = "커뮤니티 게시글 삭제" */
  const community = req.community;
  community.delete((err, deleted) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      return res.status(204).json();
    }
  });
});

// response
// 커뮤니티 게시글 목록
const communityListRes = async (communities) => {
  const response = [];
  for (const community of communities) {
    const communityRes = {
      id: community.id,
      userId: community.userId,
      title: community.title,
      content: community.content,
      createdAt: community.createdAt,
      views: community.views,
      lat: community.lat,
      lon: community.lon,
      comments: community.comments.length,
      hearts: community.hearts.length,
      nickname: await Profile.getNickname(community.userId),
      images: community.images,
    };
    response.push(communityRes);
  }
  return response;
};

// 커뮤니티 게시글 상세
const communityRes = async (community) => {
  const commentRes = [];
  for (const comment of community.comments) {
    commentRes.push({
      _id: comment.id,
      content: comment.content,
      userId: comment.userId,
      nickname: await Profile.getNickname(comment.userId),
      createdAt: comment.createdAt,
    });
  }
  const response = {
    id: community.id,
    userId: community.userId,
    nickname: await Profile.getNickname(community.userId),
    title: community.title,
    content: community.content,
    lat: community.lat,
    lon: community.lon,
    views: community.views,
    createdAt: community.createdAt,
    comments: commentRes,
    hearts: community.hearts.length,
    images: community.images,
  };
  return response;
};
module.exports = router;
