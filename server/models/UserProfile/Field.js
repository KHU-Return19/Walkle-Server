const mongoose=require('mongoose');

const fieldSchema=mongoose.Schema({
    profile_uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Profile',
    },
})
const Field=mongoose.model('Field',fieldSchema);
module.exports={Field};