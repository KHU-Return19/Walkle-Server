const mongoose=require('mongoose');

const locationSchema=mongoose.Schema({
    user_uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    lat:{
        type:Number,
        required:true,
    },lon:{
        type:Number,
        required:true,
    }
})
const Location=mongoose.model('Location',locationSchema);
module.exports={Location};