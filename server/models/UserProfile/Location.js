const mongoose=require('mongoose');

const locationSchema=mongoose.Schema({
    profileid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Profile',
    },
    lat:{
        type:Number,
        required:true,
    },lon:{
        type:Number,
        required:true,
    }
})

module.exports={locationSchema};