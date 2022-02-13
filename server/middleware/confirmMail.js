const { Mail } = require('../models/Mail');
//인증번호 확인
const confirm = (req, res, next) => {
    var messageId=req.body.messageId;
    var number=req.body.number;
    Mail.findOne({messageId},(err,result)=>{
        if(err){
            return res.status(400).json({err})
        }else{
            if(number==result.certificationNumber){
                Mail.deleteOne({messageId},(err)=>{
                    if(err){
                        return res.status(400).json({success:false,err});
                    }else{
                        next();
                    }
                });
                // next();
                // res.status(201).json({success:true});
            }else{
                Mail.findOneAndUpdate({messageId},{$inc:{trial:1}},{new:true},(err,result)=>{
                    if(err){
                        return res.status(400).json(err);
                    }else{
                        console.log(result);
                        if(result.trial==3){
                            Mail.deleteOne({messageId},(err)=>{
                                if(err){
                                    return res.status(400).json({success:false,err});
                                }else{
                                    return res.status(201).json({success:false,msg:"이메일 재전송 필요"})
                                }
                            });
                        }else{
                            return res.status(201).json({success:false,msg:"인증번호 확인 후 재시도 "})
                        }
                    }
                })
            }
        }
    })
  };
module.exports = {confirm};