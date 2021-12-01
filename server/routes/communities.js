const express = require("express");
const router = express.Router();

const { Community } = require("../models/Community");
const { auth } = require("../middleware/auth");

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

// delete community posts
router.delete;

// write community comment
router.post("/comments", auth, (req, res) => {
  let newComment = {
    userId: req.user._id,
    content: req.body.content,
  };
  Community.findOne({ id: req.query.communityId }, (err, community) => {
    community.comments.push(newComment);
    community.save((err, saved) => {
      if (err) {
        return res.status(400).json({ msg: err });
      }
      return res.status(201).json({ commentId: community.comments });
    });
  });
});

module.exports = router;
