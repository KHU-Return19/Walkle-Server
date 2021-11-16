const express = require("express");
const router = express.Router();

const { Board } = require("../../models/Community/Board");
const { Heart } = require("../../models/Community/Heart");

const { auth } = require("../../middleware/auth");
const { boardPermission } = require("../../middleware/communityPermission");

router.get("/", auth, (req, res) => {
  // find all
  Board.find((err, boards) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      return res.json({ boards: boards });
    }
  });
});

router.get("/users", auth, (req, res) => {
  // find all
  Board.find({ userId: req.user.id }, (err, boards) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      return res.json({ boards: boards });
    }
  });
});

router.get("/:id", auth, (req, res) => {
  // find by board Id
  Board.findOne({ id: req.params.id }, (err, board) => {
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
  let userId = req.user.id;
  let newBoard = new Board({
    title: req.body.title,
    content: req.body.content,
    userId: userId,
  });
  newBoard.save((err, saved) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      Heart.createHeart(userId, saved.id, (err, heart) => {
        if (err) {
          return res.status(400).json({ msg: err });
        } else {
          return res.status(201).json({ boardId: saved.id });
        }
      });
    }
  });
});

router.put("/:id", auth, boardPermission, (req, res) => {
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
          boardId: board.id,
        });
      }
    }
  );
});

router.delete("/:id", auth, boardPermission, (req, res) => {
  let board = req.board;
  board.delete((err, deleted) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      return res.status(204).json({ boardId: board.id });
    }
  });
});

module.exports = router;
