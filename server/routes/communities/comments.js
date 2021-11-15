const express = require("express");
const router = express.Router();

const { Board } = require("../../models/Community/Board");
const { Comment } = require("../../models/Community/Comment");

const { auth } = require("../../middleware/auth");
const { commentPermission } = require("../../middleware/communityPermission");

router.get("/", auth, (req, res) => {
  Board.findOne({ no: req.query.boardNo }, (err, board) => {
    if (err) {
      return res.json({ msg: err });
    } else {
      if (!board) {
        return res.status(400).json({ msg: "Board Not Found" });
      } else {
        Comment.find({ boardId: board._id }, (err, comments) => {
          return res.json({
            comments: comments,
            len: comments.length,
          });
        });
      }
    }
  });
});

router.post("/", auth, (req, res) => {
  let userId = req.user._id;
  Board.findByNo(req.query.boardNo, (err, board) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      if (!board) {
        return res.status(400).json({ msg: "Board Not Found" });
      } else {
        let newComment = new Comment({
          boardId: board._id,
          content: req.body.content,
          userId: userId,
        });
        newComment.save((err, data) => {
          if (err) {
            return res.satus(400).json({ msg: err });
          } else {
            return res.json({
              commentNo: newComment.no,
            });
          }
        });
      }
    }
  });
});

router.put("/:no", auth, commentPermission, (req, res) => {
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
        return res.json({ commentNo: comment.no });
      }
    }
  );
});

router.delete("/:no", auth, commentPermission, (req, res) => {
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
