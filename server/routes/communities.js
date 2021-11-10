const express = require("express");
const router = express.Router();

const { Board } = require("../models/Community/Board");
const { auth } = require("../middleware/auth");
const mongoose = require("mongoose");

router.get("/", auth, (req, res) => {
  Board.find((err, boards) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      return res.json({ success: true, boards: boards });
    }
  });
});

router.get("/:id", auth, (req, res) => {
  let userId = req.user._id;

  Board.findOne({ _id: req.params.id, userId: userId }, (err, board) => {
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

module.exports = router;
