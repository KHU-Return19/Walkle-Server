const express = require("express");
const router = express.Router();

const { Board } = require("../../models/Community/Board");
const { Comment } = require("../../models/Community/Comment");

const { auth } = require("../../middleware/auth");
const { commentPermission } = require("../../middleware/communityPermission");

router.get("/", auth, (req, res) => {
  Comment.find({ boardId: req.query.boardId }, (err, comments) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      return res.json({
        comments: comments,
        count: comments.length,
      });
    }
  });
});

router.post("/", auth, (req, res) => {
  let userId = req.user.id;
  Board.findOne({ id: req.query.boardId }, (err, board) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      if (!board) {
        return res.status(400).json({ msg: "Board Not Found" });
      } else {
        let newComment = new Comment({
          boardId: board.id,
          content: req.body.content,
          userId: userId,
        });
        newComment.save((err, data) => {
          if (err) {
            return res.satus(400).json({ msg: err });
          } else {
            return res.json({
              commentId: newComment.id,
            });
          }
        });
      }
    }
  });
});

router.put("/:id", auth, commentPermission, (req, res) => {
  let comment = req.comment;
  comment.update(
    {
      content: req.body.content,
      updateAt: Date.now(),
    },
    (err, updated) => {
      if (err) {
        return res.status(400).json({ msg: err });
      } else {
        return res.json({ commentId: comment.id });
      }
    }
  );
});

router.delete("/:id", auth, commentPermission, (req, res) => {
  let comment = req.comment;
  comment.delete((err, board) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      return res.status(204).json();
    }
  });
});

module.exports = router;
