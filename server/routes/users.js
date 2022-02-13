const express = require("express");
const router = express.Router();

const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const { confirm } = require("../middleware/confirmMail");
router.get("/auth", auth, (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.summary = "사용자 인증" */
  res.json({
    loginId: req.user.loginId,
    name:req.user.name,
    email: req.user.email,
    _id: req.user._id,
  });
});
router.post('/find-id',(req,res)=>{
  /* 	#swagger.tags = ['User']
      #swagger.summary = "아이디 찾기" */
  var name=req.body.name;
  var email=req.body.email;
  User.findOne({name,email},(err,result)=>{
    if(err){
      res.status(400).json(err);
    }else{
      if(result){
        var test=result.loginId;
        var first=test.substr(0,2);
        var second="***";
        var third=test.substr(5);
        res.status(201).json({loginId:first+second+third});
      }else{
        res.status(201).json({msg:"not exist account"});
      }
    }
  })
})
router.post('/find-pw',confirm,(req,res)=>{
  /* 	#swagger.tags = ['User']
      #swagger.summary = "비밀번호 변경" */
  var loginId=req.body.loginId;
  var email=req.body.email;
  var newpassword=req.body.newpassword;
  User.findOne({loginId,email},(err,user)=>{
    if(err){
      res.status(400).json(err);
    }else{
      if(user){
        User.encpass(newpassword,(err,hash)=>{
          if(err){
            console.log(err);
            return res.status(400).json(err);
          }else{
            console.log(hash);
            User.updateOne({loginId,email},{$set:{password:hash}},(err,result)=>{
              if(err){
                res.status(400).json(err);
              }else{
                res.status(201).json({success:true});
              }
            });
          }
        });
      }else{
        res.status(201).json({msg:"존재하지 않는 계정"});
      }
    }
  })
})
router.post("/register", confirm,(req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.summary = "회원가입" */
  User.findOne({ loginId: req.body.loginId }, (err, user) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else if (user) {
      return res.status(400).json({ msg: "Duplicate data exists" });
    } else {
      const user = new User({
        loginId: req.body.loginId,
        name:req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      User.encpass(user.password,(err,hash)=>{
        if(err){
          return res.status(400).json(err);
        }else{
          user.password=hash;
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
    }
  });
});
router.post("/login", (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.summary = "로그인" */
  User.findOne({ loginId: req.body.loginId }, (err, user) => {
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
                loginId: user.loginId,
              });
            }
          });
        }
      });
    }
  });
});

router.get("/logout", auth, (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.summary = "로그아웃" */
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
    if (err) return res.json({ msg: err });
    return res.json({
      msg: "LogOut Success",
    });
  });
});

// TODO remove
router.get("/all", (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.summary = "전체 유저 조회" */
  User.find((err, users) => {
    res.json(users);
  });
});
module.exports = router;
