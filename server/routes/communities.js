const express = require("express");
const router = express.Router();

const { Board } = require("../models/Community/Board");
const { Comment } = require("../models/Community/Comment");

const { auth } = require("../middleware/auth");

// Boards
router.get("/boards", auth, (req, res) => {
  let myboard = req.query.myboard;
  if (myboard) {
    let userId = req.user._id;
    Board.find({ userId: userId }, (err, boards) => {
      if (err) {
        return res.json({ success: false, msg: err });
      } else {
        return res.json({ success: true, boards: boards });
      }
    });
  } else {
    Board.find((err, boards) => {
      if (err) {
        return res.json({ success: false, msg: err });
      } else {
        return res.json({ success: true, boards: boards });
      }
    });
  }
});

router.get("/boards/:no", auth, (req, res) => {
  Board.findOne({ no: req.params.no }, (err, board) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      if (!board) {
        return res
          .status(404)
          .json({ succress: false, msg: "Board Not Found" });
      } else {
        board.updateView(() => {
          return res.json({ success: true, board: board });
        });
      }
    }
  });
});

router.post("/boards", auth, (req, res) => {
  let userId = req.user._id;
  let newBoard = new Board({
    title: req.body.title,
    content: req.body.content,
    userId: userId,
  });
  newBoard.save((err, data) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      return res.json({
        success: true,
        msg: "Create new board in community",
      });
    }
  });
});

router.put("/hearts/:no", auth, (req, res) => {
  let userId = req.user._id;
  Board.findOne({ no: req.params.no }, (err, board) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      if (!board) {
        return res
          .status(404)
          .json({ succress: false, msg: "Board Not Found" });
      } else {
        board.updateHeart(() => {
          return res.json({ success: true, board: board });
        });
      }
    }
  });
});

router.put("/boards/:no", auth, (req, res) => {
  let userId = req.user._id;
  Board.findOneAndUpdate(
    { no: req.params.no },
    { title: req.body.title, content: req.body.content, updateAt: Date.now() },
    (err, board) => {
      if (err) {
        return res.json({ success: false, msg: err });
      } else {
        if (!board) {
          return res
            .status(404)
            .json({ succress: false, msg: "Board Not Found" });
        } else if (userId != board.userId) {
          return res
            .status(403)
            .json({ succress: false, msg: "No Permission" });
        } else {
          return res.json({ success: true });
        }
      }
    }
  );
});

router.delete("/boards/:no", auth, (req, res) => {
  let userId = req.user._id;
  Board.findOneAndDelete({ no: req.params.no }, (err, board) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      if (!board) {
        return res
          .status(404)
          .json({ succress: false, msg: "Board Not Found" });
      } else if (userId != board.userId) {
        return res.status(403).json({ succress: false, msg: "No Permission" });
      } else {
        return res.json({ success: true, board: board });
      }
    }
  });
});

// Comment
router.put("/comments/:id", auth, (req, res) => {});
router.get("/comments/", auth, (req, res) => {
  Comment.find({ boardId: req.query.boardId }, (err, comments) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      return res.json({
        success: true,
        comments: comments,
        len: comments.length,
      });
    }
  });
});
router.post("/comments", auth, (req, res) => {
  let userId = req.user._id;
  Board.getObjectIdByNo(req.query.boardNo, (err, boardId) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      if (!boardId) {
        return res
          .status(404)
          .json({ succress: false, msg: "Board Not Found" });
      } else {
        let newComment = new Comment({
          boardId: boardId,
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

// For dev -r
router.delete("/clear", auth, (req, res) => {
  Board.deleteMany((err, boards) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      if (!boards) {
        return res
          .status(404)
          .json({ succress: false, msg: "Board Not Found" });
      } else {
        return res.json({ success: true });
      }
    }
  });
});

module.exports = router;
