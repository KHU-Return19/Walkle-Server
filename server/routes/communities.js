const express = require("express");
const router = express.Router();

const { Board } = require("../models/Community/Board");
const { auth } = require("../middleware/auth");

router.get("/", auth, (req, res) => {
  Board.find((err, boards) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      return res.json({ success: true, boards: boards });
    }
  });
});

router.get("/:no", auth, (req, res) => {
  let userId = req.user._id;

  Board.findOne({ no: req.params.no }, (err, board) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      board.updateView(() => {
        return res.json({ success: true, board: board });
      });
    }
  });
});

router.post("/", auth, (req, res) => {
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

router.put("/heart/:no", auth, (req, res) => {
  let userId = req.user._id;
  Board.findOne({ no: req.params.no }, (err, board) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      board.updateHeart(() => {
        return res.json({ success: true, board: board });
      });
    }
  });
});

router.delete("/:no", auth, (req, res) => {
  let userId = req.user._id;
  Board.findOneAndDelete(
    { no: req.params.no, userId: userId },
    (err, board) => {
      if (err) {
        return res.json({ success: false, msg: err });
      } else {
        return res.json({ success: true, board: board });
      }
    }
  );
});

module.exports = router;
