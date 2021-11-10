const express = require("express");
const router = express.Router();

const { Board } = require("../../models/Community/Board");
const { Comment } = require("../../models/Community/Comment");

const { auth } = require("../../middleware/auth");
const { Types } = require("mongoose");

// Comment

router.get("/", auth, (req, res) => {
  console.log(req.query.boardNo);
  Board.findOne({ no: req.query.boardNo }, (err, board) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      if (!board) {
        return res
          .status(404)
          .json({ succress: false, msg: "Board Not Found" });
      } else {
        Comment.find({ boardId: board._id }, (err, comments) => {
          return res.json({
            success: true,
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
      return res.json({ success: false, msg: err });
    } else {
      if (!board) {
        return res
          .status(404)
          .json({ succress: false, msg: "Board Not Found" });
      } else {
        let newComment = new Comment({
          boardId: board._id,
          content: req.body.content,
          userId: userId,
        });
        newComment.save((err, data) => {
          if (err) {
            return res.json({ success: false, msg: err });
          } else {
            return res.json({
              success: true,
              msg: "Create new Comment",
            });
          }
        });
      }
    }
  });
});

router.put("/:no", auth, (req, res) => {
  let userId = new Types.ObjectId(req.user._id);
  Comment.findOne({ no: req.params.no }, (err, comment) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      if (!comment) {
        return res
          .status(404)
          .json({ succress: false, msg: "Comment Not Found" });
      } else if (!userId.equals(comment.userId)) {
        return res.status(403).json({ succress: false, msg: "No Permission" });
      } else {
        comment.update(
          {
            content: req.body.content,
            updateAt: Date.now(),
          },
          (err, board) => {
            if (err) {
              return res.json({ success: false, msg: err });
            } else {
              return res.json({ success: true });
            }
          }
        );
      }
    }
  });
});

router.delete("/:no", auth, (req, res) => {
  let userId = new Types.ObjectId(req.user._id);
  Comment.findOne({ no: req.params.no }, (err, comment) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      if (!comment) {
        return res
          .status(404)
          .json({ succress: false, msg: "Comment Not Found" });
      } else if (!userId.equals(comment.userId)) {
        return res.status(403).json({ succress: false, msg: "No Permission" });
      } else {
        comment.delete((err, board) => {
          if (err) {
            return res.json({ success: false, msg: err });
          } else {
            return res.json({ success: true });
          }
        });
      }
    }
  });
});

module.exports = router;
