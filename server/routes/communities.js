const express = require("express");
const router = express.Router();

const { Board } = require("../models/Community/Board");
const { auth } = require("../middleware/auth");

router.get("/", auth, (req, res) => {
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

router.get("/:no", auth, (req, res) => {
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

router.put("/:no", auth, (req, res) => {
  let userId = req.user._id;
  Board.findOneAndUpdate(
    { no: req.params.no, userId: userId },
    { title: req.body.title, content: req.body.content, updateAt: Date.now() },
    (err, board) => {
      if (err) {
        return res.json({ success: false, msg: err });
      } else {
        if (!board) {
          return res
            .status(404)
            .json({ succress: false, msg: "No Match Board" });
        } else {
          return res.json({ success: true });
        }
      }
    }
  );
});

router.delete("/:no", auth, (req, res) => {
  let userId = req.user._id;
  Board.findOne({ no: req.params.no, userId: userId }, (err, board) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      if (!board) {
        return res
          .status(404)
          .json({ succress: false, msg: "Board Not Found" });
      } else {
        return res.json({ success: true, board: board });
      }
    }
  });
});

module.exports = router;
