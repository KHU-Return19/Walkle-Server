const mongoose=require('mongoose');

const fieldlistSchema=mongoose.Schema({
    field:{
        type:String,
        required:true,
    }
})
const FieldList=mongoose.model('FieldList',fieldlistSchema);
module.exports={FieldList};

