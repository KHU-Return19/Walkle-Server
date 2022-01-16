const express = require("express");
const router = express.Router();

const { Community, Comment, Heart } = require("../models/Community");
const { auth } = require("../middleware/auth");
const {
  postPermission,
  commentPermission,
} = require("../middleware/communityPermission");
const { Profile } = require("../models/UserProfile/Profile");

router.get("/posts/:id", auth, (req, res) => {
  /* 	#swagger.tags = ['Community']
      #swagger.summary = "커뮤니티 게시글 조회" */
  Community.findOne({ _id: req.params.id }, (err, community) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else if (!community) {
      return res.status(400).json({ msg: "Community Not Found" });
    } else {
      community.updateViews(async () => {
        const commentResponse = [];
        for (const comment of community.comments) {
          console.log(comment);
          commentResponse.push({
            _id: comment.id,
            content: comment.content,
            userId: comment.userId,
            nickname: await Profile.getnickname(comment.userId),
            createdAt: comment.createdAt,
          });
        }
        const response = {
          id: community.id,
          userId: community.userId,
          nickname: await Profile.getnickname(community.userId),
          title: community.title,
          content: community.content,
          lat: community.lat,
          lon: community.lon,
          views: community.views,
          createdAt: community.createdAt,
          comments: commentResponse,
          hearts: community.hearts.length,
        };
        return res.status(200).json({ community: response });
      });
    }
  });
});

router.get("/posts", auth, (req, res) => {
  /* 	#swagger.tags = ['Community']
      #swagger.summary = "커뮤니티 게시글 목록 조회" */
  Community.find()
    .sort({ createdAt: -1 })
    .then(async (communities) => {
      const response = [];
      for (const community of communities) {
        response.push({
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
          nickname: await Profile.getnickname(community.userId),
        });
      }
      return res.status(200).json({ communities: response });
    });
});

router.get("/users/:userId", auth, (req, res) => {
  /* 	#swagger.tags = ['Community']
      #swagger.summary = "작성자별 커뮤니티 게시글 조회" */
  const userId = req.params.userId;
  Community.find({ userId: userId })
    .sort({ createdAt: -1 })
    .then(async (communities) => {
      const response = [];

      for (const community of communities) {
        response.push({
          id: community.id,
          userId: community.userId,
          title: community.title,
          content: community.content,
          createdAt: community.createdAt,
          views: community.views,
          comments: community.comments.length,
          lat: community.lat,
          lon: community.lon,
          hearts: community.hearts.length,
          nickname: await Profile.getnickname(community.userId),
        });
      }
      return res.status(200).json({ communities: response });
    });
});

router.post("/posts", auth, (req, res) => {
  /* 	#swagger.tags = ['Community']
      #swagger.summary = "커뮤니티 게시글 작성" */
  const newCommunity = new Community({
    userId: req.user._id,
    title: req.body.title,
    content: req.body.content,
    lon: req.body.lon,
    lat: req.body.lat,
  });

  newCommunity.save((err, saved) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      return res.status(201).json({ communityId: saved._id });
    }
  });
});

router.put("/posts/:id", auth, postPermission, async (req, res) => {
  /* 	#swagger.tags = ['Community']
      #swagger.summary = "커뮤니티 게시글 수정" */
  const update = {
    title: req.body.title,
    content: req.body.content,
    lon: req.body.lon,
    lat: req.body.lat,
  };
  await Community.updateOne({ _id: req.community.id }, update);
  return res.status(200).json({ community: req.community.id });
});

router.delete("posts/:id", auth, postPermission, (req, res) => {
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

router.post("/posts/:id/comments", auth, (req, res) => {
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
      // add comments
      const numOfComment = community.comments.push(newComment);
      // save community
      community.save((err, saved) => {
        if (err) {
          return res.status(400).json({ msg: err });
        }
        return res
          .status(201)
          .json({ commentId: community.comments[numOfComment - 1]._id });
      });
    }
  });
});

router.get(
  "/posts/:id/comments/:commentId",
  auth,
  commentPermission,
  async (req, res) => {
    /* 	#swagger.tags = ['Community']
      #swagger.summary = "커뮤니티 댓글 조회" */
    const comment = req.comment;
    const commentResponse = [];
    commentResponse.push({
      _id: comment.id,
      content: comment.content,
      userId: comment.userId,
      nickname: await Profile.getnickname(comment.userId),
      createdAt: comment.createdAt,
    });

    return res.status(201).json({ comment: commentResponse });
  }
);

router.put(
  "/posts/:id/comments/:commentId",
  auth,
  commentPermission,
  (req, res) => {
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
  }
);

router.delete(
  "/posts/:id/comments/:commentId",
  auth,
  commentPermission,
  (req, res) => {
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
  }
);

router.post("/posts/:id/hearts", auth, (req, res) => {
  /* 	#swagger.tags = ['Community']
      #swagger.summary = "커뮤니티 게시글 공감 / 공감 취소"*/
  const userId = req.user._id;
  let newHeart = {
    userId: userId,
  };

  Community.findOne({ _id: req.params.id }, (err, community) => {
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
          return res.status(201).json({ hearts: numOfHeart });
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

router.get("/users/:userId/hearts", auth, (req, res) => {
  /* 	#swagger.tags = ['Community']
      #swagger.summary = "공감한 글 조회"*/
  const userId = req.params.userId;

  Community.find({ "hearts.userId": userId })
    .sort({ createdAt: -1 })
    .then(async (communities) => {
      const response = [];
      for (const community of communities) {
        response.push({
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
          nickname: await Profile.getnickname(community.userId),
        });
      }
      return res.status(200).json({ communities: response });
    });
});
module.exports = router;
