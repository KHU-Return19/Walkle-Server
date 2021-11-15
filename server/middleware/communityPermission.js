const { Board } = require("../models/Community/Board");
const { Comment } = require("../models/Community/Comment");

const { Types } = require("mongoose");

const boardPermission = (req, res, next) => {
  let userId = new Types.ObjectId(req.user._id);
  var boardNo = req.params.no;

  Board.findByNo(boardNo, (err, board) => {
    if (err) throw err;
    if (!board) {
      return res.status(400).json({ msg: err });
    } else if (!userId.equals(board.userId)) {
      return res.status(403).json({ msg: "No Permission" });
    } else {
      req.board = board;
      next();
    }
  });
};

const commentPermission = (req, res, next) => {
  let userId = new Types.ObjectId(req.user._id);
  var commentNo = req.params.no;

  Comment.findByNo(commentNo, (err, comment) => {
    if (err) throw err;
    if (!comment) {
      return res.status(400).json({ msg: err });
    } else if (!userId.equals(comment.userId)) {
      return res.status(403).json({ msg: "No Permission" });
    } else {
      req.comment = comment;
      next();
    }
  });
};

module.exports = { boardPermission, commentPermission };
