const mongoose=require('mongoose');

const tagSchema=mongoose.Schema({
    profileid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Profile',
    },
    tag:{
        type:String,
        required:true,
    }
});

module.exports={tagSchema};