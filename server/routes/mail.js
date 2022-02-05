const express = require('express');
const router = express.Router();

const { sendMail } = require('../middleware/mailer');
const { Mail } = require('../models/Mail');
//이메일 전송
function generateRandomCode(n) {
    let str = ''
    for (let i = 0; i < n; i++) {
      str += Math.floor(Math.random() * 10)
    }
    return str
}
router.post('/',async (req,res)=>{
    var number=await generateRandomCode(6);
    console.log(number);
    sendMail(req.body.email,"Wakle 이메일 인증",`인증번호는 ${number} 입니다.`,function(err,info){
        if(err){
            res.status(400).json({success:false});
        }else{
            var mail=new Mail({messageId:info.messageId,certificationNumber:number,trial:0});
            mail.save((err,result)=>{
                if(err){
                    res.status(400).json({success:false});
                }else{
                    res.status(201).json({success:true,messageId:result.messageId,number})
                }
            })
        }
    });
})
//인증번호 확인
// router.post('/confirm',(req,res)=>{
//     var messageId=req.body.messageId;
//     var number=req.body.number;
//     Mail.findOne({messageId},(err,result)=>{
//         if(err){
//             res.status(400).json({err})
//         }else{
//             if(number==result.certificationNumber){
//                 Mail.deleteOne({messageId},(err)=>{
//                     if(err){
//                         res.status(400).json({success:false,err});
//                     }
//                 });
//                 res.status(201).json({success:true});
//             }else{
//                 Mail.findOneAndUpdate({messageId},{$inc:{trial:1}},{new:true},(err,result)=>{
//                     if(err){
//                         res.status(400).json(err);
//                     }else{
//                         console.log(result);
//                         if(result.trial==3){
//                             Mail.deleteOne({messageId},(err)=>{
//                                 if(err){
//                                     res.status(400).json({success:false,err});
//                                 }
//                             });
//                             res.status(201).json({success:false,msg:"이메일 재전송 필요"})
//                         }else{
//                             res.status(201).json({success:false,msg:"인증번호 확인 후 재시도 "})
//                         }
//                     }
//                 })
//             }
//         }
//     })
// })
module.exports = router;