const { User } = require("../models/User");

const auth = (req, res, next) => {
  const token = req.cookies.auth;

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.status(401).json({
        msg: "authentication failed",
      });
    } else {
      req.user = user;
      req.token = token;
      next();
    }
  });
};

module.exports = { auth };
