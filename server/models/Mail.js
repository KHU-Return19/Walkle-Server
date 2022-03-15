const mongoose=require('mongoose');

const mailSchema=mongoose.Schema({
    messageId:{
        type:String,
        required:true,
    },
    certificationNumber:{
        type:Number,
        required:true,
    },
    trial:{
        type:Number
    }
})
const Mail=mongoose.model('Mail',mailSchema);
module.exports={Mail};

