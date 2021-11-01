const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    user_uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    nickname:{
        type:String,
        required:true,
    },
    job:{
        type:String,
    },
    sns_link:{
        type:String
    },
    intro:{
        type:String,
        minlength:10,
        required:true,
    },
    career:{
        type:String
    },
    age:{
        type:Number,
        required:true,
    },
    gender:{
        type:String,
        required:true,
    },
    picture:{
        type:String,
    }
})
const Profile=mongoose.model('Profile',profileSchema);
module.exports = { Profile };