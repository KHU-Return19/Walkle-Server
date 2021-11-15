const express = require("express");
const router = express.Router();

const { Board } = require("../../models/Community/Board");

const { auth } = require("../../middleware/auth");
const { boardPermission } = require("../../middleware/communityPermission");

router.get("/", auth, (req, res) => {
  let userId = req.query.userId;

  if (userId) {
    // find by userId
    Board.find({ userId: userId }, (err, boards) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        return res.json({ boards: boards });
      }
    });
  } else {
    // find all
    Board.find((err, boards) => {
      if (err) {
        return res.status(400).json({ msg: err });
      } else {
        return res.json({ boards: boards });
      }
    });
  }
});

router.get("/:no", auth, (req, res) => {
  // find by board Id
  Board.findOne({ no: req.params.no }, (err, board) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else if (!board) {
      return res.json({ board: board });
    } else {
      board.updateView(() => {
        return res.json({ board: board });
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
      return res.status(400).json({ msg: err });
    } else {
      return res.status(201).json({ boardNo: newBoard.no });
    }
  });
});

router.put("/:no", auth, boardPermission, (req, res) => {
  // upate
  let board = req.board;
  board.update(
    {
      title: req.body.title,
      content: req.body.content,
      updateAt: Date.now(),
    },
    (err, updated) => {
      if (err) {
        return res.status(400).json({ msg: err });
      } else {
        return res.json({
          boardNo: board.no,
        });
      }
    }
  );
});

router.delete("/:no", auth, boardPermission, (req, res) => {
  let board = req.board;
  board.delete((err, deleted) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      return res.status(204).json({ boardNo: board.no });
    }
  });
});

module.exports = router;
