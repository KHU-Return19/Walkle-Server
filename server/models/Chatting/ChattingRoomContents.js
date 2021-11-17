const mongoose=require('mongoose');

const chattingroomcontentsSchema=mongoose.Schema({
    user_uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    chattingroomt_uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ChattingRoom'
    },
    contents:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})
const ChattingRoomContents=mongoose.model('ChattingRoomContents',chattingroomcontentsSchema);
module.exports={ChattingRoomContents};