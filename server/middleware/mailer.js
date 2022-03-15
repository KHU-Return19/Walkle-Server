const nodeMailer = require('nodemailer');


const mailPoster = nodeMailer.createTransport({
  service: 'naver',
  host: 'smtp.naver.com',
  port: 587,
  auth: {
    user: process.env.NAVER_MAIL,
    pass: process.env.NAVER_PASSWORD
  }
});
const mailOpt = (email, title, contents) => {
  const mailOptions = {
    from: process.env.NAVER_MAIL,
    to: email ,
    subject: title,
    text: contents
  };
  return mailOptions;
}
const sendMail=(email,title,content,cb)=>{
    mailPoster.sendMail(mailOpt(email,title,content),function(err,info){
        if(err){
            console.log('에러'+err);
            return cb(err);
        }else{
            console.log("전송 완료"+info);
            return cb(null,info);
        }
    })
}
module.exports={sendMail};