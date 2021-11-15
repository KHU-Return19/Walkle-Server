const mongoose=require('mongoose');

const fieldSchema=mongoose.Schema({
    user_uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    field:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'FieldList'
    }
})
const Field=mongoose.model('Field',fieldSchema);
module.exports={Field};