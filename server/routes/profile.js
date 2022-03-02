const express = require('express');
const router = express.Router();

const { Field } = require('../models/UserProfile/Field');
const { Profile } = require('../models/UserProfile/Profile');
const { auth } = require('../middleware/auth'); //인증

const getData = (req) => {
    const profile_data = {
        userId: req.user._id,
        nickname: req.body.nickname,
        job: req.body.job,
        snsLink: req.body.snsLink,
        intro: req.body.intro,
        career: req.body.career,
        age: req.body.age,
        gender: req.body.gender,
        picture: req.body.picture,
        location:[],
        tags:[],
        fields:[]
    };
    return { profile_data}

}
//db 필드 목록 추가
router.post('/add-field-list',(req,res)=>{
    /* 	#swagger.tags = ['Profile']
      #swagger.summary = "DB 필드 목록 추가" */
    var field=new Field(req.body);
    console.log(req.body.field);
    field.save((err,field)=>{
        if(err){
            return res.status(400).json({err});
        }else{
            console.log(field);
            return res.status(201).json({success:true})
        }
    })
})
router.get('/check-nickname',(req,res)=>{
    /* 	#swagger.tags = ['Profile']
      #swagger.summary = "닉네임 중복 확인" */
    Profile.findOne({nickname:req.query.nickname},(err,result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            if(result){
                res.status(201).json({exist:true});
            }else{
                res.status(201).json({exist:false});
            }
        }
    })
})
//프로필 등록
router.post('/', auth, async (req, res) => {
    /* 	#swagger.tags = ['Profile']
      #swagger.summary = "프로필 등록" */
    const {profile_data} = getData(req);
    for await (const item of req.body.field) {
        // await Field.findOne({field:item}).then((body)=>{
        //     if(body){
        //         profile_data.fields.push({field_uid:body._id});
        //     }
        // })
        profile_data.fields.push({field_uid:item});
    }
    const profile = new Profile(profile_data);
    //DB에 프로필이 등록되어 있는지 확인.
    Profile.findOne({ userId: req.user._id }, async (err, result) => {
        if (err) {
            return res.status(400).json({ msg: err });
        } else if (result) {
            return res.status(400).json({ msg: "이미 프로필이 등록 되어 있습니다." });
        } else {
            // profile.tags.push(...req.body.tag); 
            // console.log(req.body.tag);
            for await (const item of req.body.tag) {
                profile_data.tags.push({tag:item});
            }
            profile.location.push(...req.body.location);
            profile.save((err,profile)=>{
                if(err){
                    return res.status(400).json({msg:err});
                }else{
                    return res.status(201).json({success:true});
                }
            })
        }
    })
})
//프로필_목록 조회
router.get('/list',(req,res)=>{
    /* 	#swagger.tags = ['Profile']
      #swagger.summary = "프로필 목록 조회" */
    // var user_data={};
    Profile.find({},(err,profile)=>{
        if(err){
            res.status(400).json({err})
        }else{
            res.status(201).json(profile);
        }
    })
})
//프로필 상세 조회
router.get('/',auth,(req,res)=>{
    /* 	#swagger.tags = ['Profile']
      #swagger.summary = "프로필 상세 조회" */
    //다른 사람 프로필 조회
    if(req.query.nickname){
        Profile.findOne({nickname:req.query.nickname}).then((profile)=>{
            res.status(201).json(profile);
        }).catch((err)=>res.status(400).json({err}));
    //본인 프로필 조회
    }else{
        Profile.findOne({userId:req.user._id}).then((profile)=>{
            res.status(201).json(profile);
        }).catch((err)=>res.status(400).json({err}));
    }
})
//프로필 수정
router.put('/:nickname', auth, (req, res) => {
    /* 	#swagger.tags = ['Profile']
      #swagger.summary = "프로필 수정" */
    var user = req.user;
    Profile.findOne({ nickname: req.params.nickname }, async (err, profile) => {
        if (err) {
            return res.status(400).json({ msg: err });
        } else if (user._id.equals(profile.userId)) {
            const { profile_data,tag_data} = getData(req);
            for await (const item of req.body.field) {
                profile_data.fields.push({field_uid:item});
            }
            for await (const item of req.body.tag) {
                profile_data.tags.push({tag:item});
            }
            Profile.findOneAndReplace({ nickname: req.params.nickname }, profile_data, { returnDocument: true }, (err, profile) => {
                if (err) {
                    return res.status(400).json({ msg: err });
                } else if (profile) {
                    profile.location.push(...req.body.location);
                    profile.save((err,profile)=>{
                        if(err){
                            return res.status(400).json({msg:err});
                        }else{
                            return res.status(201).json({success:true});
                        }
                    })
                } else {
                    return res.status(400).json({ msg: err });
                }
            })
        } else {
            return res.status(400).json({ msg: "본인 프로필만 수정가능" });
        }
    })
})
//전체 필드 조회
router.get('/field',(req,res)=>{
    /* 	#swagger.tags = ['Profile']
      #swagger.summary = "분야 리스트 조회" */
  Field.find({},(err,field)=>{
      if(err){
          res.status(400).json({err});
      }else{
          res.status(201).json(field);
      }
  })  
})

module.exports = router;