const { Community } = require("../models/Community");

const postPermission = (req, res, next) => {
  let userId = req.user._id;
  var communityId = req.params.id;

  Community.findOne({ id: communityId }, (err, community) => {
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

// const commentPermission = (req, res, next) => {
//   let userId = req.user.id;
//   var commentId = req.params.id;

//   Comment.findOne({ commentId: commentId }, (err, comment) => {
//     if (err) throw err;
//     if (!comment) {
//       return res.status(400).json({ msg: "Board Not Found" });
//     } else if (userId != comment.userId) {
//       return res.status(403).json({ msg: "Forbidden" });
//     } else {
//       req.comment = comment;
//       next();
//     }
//   });
// };

module.exports = { postPermission };
