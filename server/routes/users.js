const express = require("express");
const router = express.Router();

const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

router.get("/auth", auth, (req, res) => {
  res.json({
    isAuth: true,
    userId: req.user.userId,
    email: req.user.email,
    id: req.user.id,
    msg: "Authentication Success",
  });
});

router.post("/register", (req, res) => {
  console.log(req.body);
  User.findOne({ userId: req.body.userId }, (err, user) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else if (user) {
      return res.json({ success: false, msg: "Duplicate data exists" });
    } else {
      const user = new User(req.body);
      user.save((err, doc) => {
        if (err) {
          return res.json({ success: false, msg: err });
        } else {
          return res.json({
            success: true,
            msg: "SignUp Success",
          });
        }
      });
    }
  });
});
router.post("/login", (req, res) => {
  User.findOne({ userId: req.body.userId }, (err, user) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else if (!user) {
      return res.json({ success: false, msg: "Account does not exist" });
    } else {
      user.checkPassword(req.body.password, (err, isMatch) => {
        if (err) {
          return res.json({ success: false, msg: err });
        } else if (!isMatch) {
          return res.json({ success: false, msg: "Wrong Password" });
        } else {
          user.createToken((err, user) => {
            if (err) {
              return res.json({ success: false, msg: err });
            } else {
              res.cookie("auth", user.token).json({
                success: true,
                id: user.id,
                userId: user.userId,
                msg: "LogIn Success",
              });
            }
          });
        }
      });
    }
  });
});
router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
    if (err) return res.json({ success: false, msg: err });
    return res.json({
      success: true,
      msg: "LogOut Success",
    });
  });
});

module.exports = router;
