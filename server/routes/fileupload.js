
const express = require('express');
const router = express.Router();
var fs=require('fs');
const path = require('path');
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads/'))
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname.split('.')[0]}.png`)
    }
})
var upload = multer({ storage: storage })
router.post('/', upload.single("file"), (req, res) => {
    // /* 	#swagger.tags = ['Image']
    //   #swagger.summary = "이미지 추가" */
    const { originalname, destination, filename, path, size } = req.file;
    console.log("사용자가 업로드한 파일 명 : ", originalname);
    console.log("destinatin에 저장된 파일 명 : ", filename);
    console.log("업로드된 파일의 전체 경로 ", path);
    console.log("파일의 바이트(byte 사이즈)", size);
    res.json({ success: true, data: "Single Upload Ok",filename})
})
router.delete('/:imageId',(req,res)=>{
    /* 	#swagger.tags = ['Image']
      #swagger.summary = "이미지 제거" */
    console.log(req.params.imageId);
    fs.unlink(`uploads/${req.params.imageId}`,(err)=>{
        if(err){
            res.status(400).json({success:false,msg:"failed delete image"});
        }else{
            res.status(201).json({success:true});
        }
    })
})
module.exports=router;