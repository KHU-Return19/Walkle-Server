const mongoose=require('mongoose');

const tagSchema=mongoose.Schema({
    user_uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    tag:{
        type:String,
        required:true,
    }
});
const Tag=mongoose.model('Tag',tagSchema);
module.exports={Tag};