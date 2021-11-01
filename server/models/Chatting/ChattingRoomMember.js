const mongoose=require('mongoose');

const chattingroommemberSchema=mongoose.Schema({
    chattingroomt_uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ChattingRoom'
    },
    user_uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})
const ChattingRoomMember=mongoose.model('ChattingRoomMember',chattingroommemberSchema);
module.exports={ChattingRoomMember};