const mongoose=require('mongoose');

const fieldSchema=mongoose.Schema({
    profileid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Profile',
    },
})

module.exports={fieldSchema};