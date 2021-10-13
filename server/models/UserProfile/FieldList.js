const mongoose=require('mongoose');

const fieldlistSchema=mongoose.Schema({
    fieldid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Field',
    },
    field:{
        type:String,
        required:true,
    }
})
module.exports={fieldlistSchema};

