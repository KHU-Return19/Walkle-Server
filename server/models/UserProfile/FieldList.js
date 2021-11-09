const mongoose=require('mongoose');

const fieldlistSchema=mongoose.Schema({
    field_uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Field',
    },
    field:{
        type:String,
        required:true,
    }
})
const FieldList=mongoose.model('FieldList',fieldlistSchema);
module.exports={FieldList};

