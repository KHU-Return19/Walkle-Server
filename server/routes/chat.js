const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth'); //인증
const { Profile } = require('../models/UserProfile/Profile');
const {ChattingRoom} = require('../models/Chatting/ChattingRoom');
const {ChattingRoomMember} = require('../models/Chatting/ChattingRoomMember');

router.post('/room',auth,(req,res)=>{
    Profile.findOne({nickname:req.body.nickname}).then((result)=>{
        var newRoom=new ChattingRoom({user_uid:req.user._id,room_name:req.body.nickname});
        newRoom.save()
        .then((doc)=>{
            console.log(doc._id);
            var newMember=new ChattingRoomMember({chattingroom_uid:doc._id,user_uid:result.user_uid});
            newMember.save()
            .then(()=>{res.status(201).json({success:true})})
            .catch((err)=>{res.status(400).json({err})})
        })
        .catch((err)=>{res.status(400).json({err})})
        
    }).catch((err)=>{res.status(400).json({err});})
    // var newRoom=new ChattingRoom({
    //     room_name:req.body.user
    // })
})
router.post('/')
module.exports = router;