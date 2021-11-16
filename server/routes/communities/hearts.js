const express = require("express");
const router = express.Router();

const { Heart } = require("../../models/Community/Heart");
const { auth } = require("../../middleware/auth");

router.get("/", auth, (req, res) => {
  let boardId = req.query.boardId;

  Heart.find({ boardId: boardId, state: true }, (err, hearts) => {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      return res.json({ hearts: hearts, count: hearts.length });
    }
  });
});

router.get("/users-all", auth, (req, res) => {
  Heart.find({ userId: req.user.id, state: true }, (err, hearts) => {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      return res.json({ hearts: hearts });
    }
  });
});

router.get("/users", auth, (req, res) => {
  let boardId = req.query.boardId;
  console.log(boardId);
  console.log();

  Heart.find({ userId: req.user.id, boardId: boardId }, (err, heart) => {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      return res.json({ heart: heart });
    }
  });
});

router.put("/users", auth, (req, res) => {
  let boardId = req.query.boardId;
  Heart.findOne({ userId: req.user.id, boardId: boardId }, (err, heart) => {
    heart.updateHeart((err, updated) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        return res.json({ heart: updated });
      }
    });
  });
});

router.delete("/:id", auth, (req, res) => {
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
