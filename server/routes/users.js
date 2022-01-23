const express = require("express");
const router = express.Router();

const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

router.get("/auth", auth, (req, res) => {
  res.json({
    userId: req.user.userId,
    email: req.user.email,
    _id: req.user._id,
  });
});

router.post("/register", (req, res) => {
  User.findOne({ userId: req.body.userId }, (err, user) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else if (user) {
      return res.status(400).json({ msg: "Duplicate data exists" });
    } else {
      const user = new User({
        userId: req.body.userId,
        email: req.body.email,
        password: req.body.password,
      });
      user.save((err, doc) => {
        if (err) {
          return res.status(400).json({ msg: err });
        } else {
          return res.status(201).json({
            _id: doc._id,
          });
        }
      });
    }
  });
});
router.post("/login", (req, res) => {
  User.findOne({ userId: req.body.userId }, (err, user) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else if (!user) {
      return res.status(400).json({ msg: "Account does not exist" });
    } else {
      user.checkPassword(req.body.password, (err, isMatch) => {
        if (err) {
          return res.status(400).json({ msg: err });
        } else if (!isMatch) {
          return res.status(400).json({ msg: "Wrong Password" });
        } else {
          user.createToken((err, user) => {
            if (err) {
              return res.status(400).json({ msg: err });
            } else {
              res.cookie("auth", user.token).status(201).json({
                _id: user._id,
                userId: user.userId,
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
    if (err) return res.json({ msg: err });
    return res.json({
      msg: "LogOut Success",
    });
  });
});

// TODO remove
router.get("/all", (req, res) => {
  User.find((err, users) => {
    res.json(users);
  });
});
module.exports = router;
