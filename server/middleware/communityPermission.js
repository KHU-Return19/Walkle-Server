const { Board } = require("../models/Community/Board");
const { Comment } = require("../models/Community/Comment");

const { Types } = require("mongoose");

const boardPermission = (req, res, next) => {
  let userId = req.user.id;
  var boardId = req.params.id;

  Board.findOne({ boardId: boardId }, (err, board) => {
    if (err) throw err;
    if (!board) {
      return res.status(400).json({ msg: "Board Not Found" });
    } else if (userId != board.userId) {
      return res.status(403).json({ msg: "Forbidden" });
    } else {
      req.board = board;
      next();
    }
  });
};

const commentPermission = (req, res, next) => {
  let userId = req.user.id;
  var commentId = req.params.id;

  Comment.findOne({ commentId: commentId }, (err, comment) => {
    if (err) throw err;
    if (!comment) {
      return res.status(400).json({ msg: "Board Not Found" });
    } else if (userId != comment.userId) {
      return res.status(403).json({ msg: "Forbidden" });
    } else {
      req.comment = comment;
      next();
    }
  });
};

module.exports = { boardPermission, commentPermission };
