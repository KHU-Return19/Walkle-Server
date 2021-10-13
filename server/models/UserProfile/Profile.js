const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    nickname:{
        type:String,
        required:true,
    },
    job:{
        type:String,
    },
    // location:{

    // },
    // field:{

    // },
    // tag:{

    // }
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
module.exports = { profileSchema }