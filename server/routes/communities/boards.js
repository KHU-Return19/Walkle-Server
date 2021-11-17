const express = require("express");
const router = express.Router();

const { Board } = require("../../models/Community/Board");
const { Heart } = require("../../models/Community/Heart");
const { Comment } = require("../../models/Community/Comment");

const { auth } = require("../../middleware/auth");
const { boardPermission } = require("../../middleware/communityPermission");

router.get("/", auth, (req, res) => {
  // List
  Board.find().then(async (boards) => {
    var response = [];
    for (const board of boards) {
      response.push({
        id: board.id,
        title: board.title,
        userId: board.userId,
        createAt: board.createAt,
        view: board.view,
        heart: await board.getNumberOfHearts(),
        comment: await board.getNumberOfComments(),
      });
    }
    return res.json({ boards: response });
  });
});

router.get("/search", auth, (req, res) => {
  // List
  let keyword = req.query.keyword;

  Board.find({
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { content: { $regex: keyword, $options: "i" } },
    ],
  }).then(async (boards) => {
    var response = [];
    for (const board of boards) {
      response.push({
        id: board.id,
        title: board.title,
        userId: board.userId,
        createAt: board.createAt,
        view: board.view,
        heart: await board.getNumberOfHearts(),
        comment: await board.getNumberOfComments(),
      });
    }
    return res.json({ boards: response });
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
      board.updateView(async () => {
        return res.json({
          id: board.id,
          title: board.title,
          userId: board.userId,
          createAt: board.createAt,
          view: board.view,
          heart: await board.getNumberOfHearts(),
          comment: await board.getNumberOfComments(),
        });
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
      Heart.createHeart(userId, saved.id, (err, heart) => {});
      return res.status(201).json({ boardId: saved.id });
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
      Comment.deleteByBoardId(deleted.id);
      Heart.deleteByBoardId(deleted.id);
      return res.status(204).json({ boardId: board.id });
    }
  });
});

module.exports = router;
