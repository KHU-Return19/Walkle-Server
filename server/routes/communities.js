const express = require("express");
const router = express.Router();

const { Community } = require("../models/Community");
const { auth } = require("../middleware/auth");
const {
  postPermission,
  commentPermission,
} = require("../middleware/communityPermission");
const { Profile } = require("../models/UserProfile/Profile");

// read community post
router.get("/posts/:id", auth, (req, res) => {
  Community.findOne({ id: req.params.id }, (err, community) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else if (!community) {
      return res.status(400).json({ msg: "Community Not Found" });
    } else {
      community.updateViews(async () => {
        const response = {
          id: community.id,
          userId: community.userId,
          nickname: await Profile.getnickname(community.userId),
          title: community.title,
          createAt: community.createAt,
          views: community.views,
          comments: community.comments,
        };
        return res.status(200).json({ community: response });
      });
    }
  });
});

// read community post list
router.get("/posts", auth, (req, res) => {
  Community.find(async (err, communities) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      var response = [];

      for (const community of communities) {
        response.push({
          id: community.id,
          userId: community.userId,
          title: community.title,
          createAt: community.createAt,
          views: community.views,
          comments: community.comments.length,
          nickname: await Profile.getnickname(community.userId),
        });
      }
      return res.status(200).json({ communities: response });
    }
  });
});

// write community post
router.post("/posts", auth, (req, res) => {
  let newCommunity = new Community({
    userId: req.user._id,
    title: req.body.title,
    content: req.body.content,
  });

  newCommunity.save((err, saved) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      return res.status(201).json({ communityId: saved.id });
    }
  });
});

// modify community post
router.put("/posts/:id", auth, postPermission, async (req, res) => {
  let update = {
    title: req.body.title,
    content: req.body.content,
  };
  await Community.updateOne({ id: req.community.id }, update);
  return res.status(200).json({ community: req.community.id });
});

// delete community posts
router.delete("/posts/:id", auth, postPermission, (req, res) => {
  let community = req.community;
  community.delete((err, deleted) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      return res.status(204).json();
    }
  });
});

// write community comment
router.post("/comments", auth, (req, res) => {
  let newComment = {
    userId: req.user._id,
    content: req.body.content,
  };
  Community.findOne({ id: req.query.communityId }, (err, community) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else if (!community) {
      return res.status(400).json({ msg: "Community Not Found" });
    } else {
      // add comments
      community.comments.push(newComment);

      // save community
      community.save((err, saved) => {
        if (err) {
          return res.status(400).json({ msg: err });
        }
        return res.status(201).json({ commentId: community.comments._id });
      });
    }
  });
});

// Read community comment
router.get("/comments/:_id", auth, (req, res) => {
  const comment = req.comment;
  return res.status(201).json({ comment: comment });
});

// Update community comment
router.put("/comments/:_id", auth, commentPermission, (req, res) => {
  const community = req.community;
  const comment = req.comment;
  comment.content = req.body.content;
  console.log(req.body.content);
  community.save((err, saved) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }
    return res.status(201).json({ commentId: comment._id });
  });
});

module.exports = router;
