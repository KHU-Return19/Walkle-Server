const express=require('express');
const router=express.Router();

const {User}=require('../models/User');
const {auth}=require('../middleware/auth');

router.get('/auth',auth,(req,res)=>{
    res.json({
        isAuth:true,
        userid:req.user.userid,
        email:req.user.email,
        msg:"인증완료"
    });
})

router.post('/register',(req,res)=>{
    User.findOne({userid:req.body.userid},(err,user)=>{
        if(err){
            return res.json({success:false,msg:err})
        }else if(user){
            return res.json({success:false,msg:"존재하는 계정"})
        }else{
            const user=new User(req.body);
            user.save((err,doc)=>{
                if(err){
                    return res.json({success:false,msg:err})
                }else{
                    return res.json({
                        success: true,
                        msg: "회원가입 성공!"
                    })    
                }
            })
        }
    })
});
router.post('/login',(req,res)=>{
    User.findOne({userid:req.body.userid},(err,user)=>{
        if(err){
            return res.json({success:false,msg:err});
        }else if(!user){
            return res.json({success:false,msg:"계정이 존재하지 않습니다."})
        }else{
            user.checkPassword(req.body.password,(err,isMatch)=>{
                if(err){
                    return res.json({success:false,msg:err});
                }else if(!isMatch){
                    return res.json({success:false,msg:"비번 틀림."})
                }else{
                    user.createToken((err,user)=>{
                        if(err){
                            return res.json({success:false,msg:err})
                        }else{
                            res.cookie('auth',user.token).json({success:true,userid:user._id,msg:"로그인 성공"})
                        }
                    })
                }
            })
        }
    })
})
router.get("/logout", auth, (req, res) => {
        User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
        if (err) return res.json({ success: false, msg:err });
        return res.json({
            success: true, msg: "로그아웃 성공"
        });
    });
});

module.exports=router;