const { Community } = require("../models/Community");

const postPermission = (req, res, next) => {
  const userId = req.user._id;
  const communityId = req.params.id;

  Community.findOne({ _id: communityId }, (err, community) => {
    if (err) throw err;

    if (!community) {
      return res.status(400).json({ msg: "Community Not Found" });
    } else if (!userId.equals(community.userId)) {
      return res.status(403).json({ msg: "Forbidden" });
    } else {
      req.community = community;
      next();
    }
  });
};

const commentPermission = (req, res, next) => {
  const userId = req.user._id;
  const commentId = req.params.commentId;
  const postId = req.params.id;
  Community.findOne({ _id: postId }, (err, community) => {
    if (err) throw err;
    const comment = community.comments.id(commentId);
    if (!comment) {
      return res.status(400).json({ msg: "Comment Not Found" });
    } else if (!userId.equals(comment.userId)) {
      console.log(userId);
      return res.status(403).json({ msg: "Forbidden" });
    } else {
      req.community = community;
      req.comment = comment;
      next();
    }
  });
};

module.exports = { postPermission, commentPermission };
