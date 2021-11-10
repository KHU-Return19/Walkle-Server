const mongoose=require('mongoose');

const fieldSchema=mongoose.Schema({
<<<<<<< HEAD
<<<<<<< HEAD
    profile_uid:{
=======
    user_uid:{
>>>>>>> feature/profile
=======
    user_uid:{
>>>>>>> feature/profile
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
})
const Field=mongoose.model('Field',fieldSchema);
module.exports={Field};