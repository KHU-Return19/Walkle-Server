const { User } = require('../models/User');

const auth = (req, res, next) => {
  var token = req.cookies.auth;
    console.log(token);
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user){
      return res.json({
        isAuth: false,
        msg: "인증 실패 :P"
      });
    }
    else{
    req.user = user;
    req.token = token;
    next();
    }
  });
};

module.exports = { auth };
