const mongoose=require('mongoose');

const fieldSchema=mongoose.Schema({
<<<<<<< HEAD
    profile_uid:{
=======
    user_uid:{
>>>>>>> feature/profile
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
})
const Field=mongoose.model('Field',fieldSchema);
module.exports={Field};