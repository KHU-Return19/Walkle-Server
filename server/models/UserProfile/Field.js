const mongoose=require('mongoose');

const fieldSchema=mongoose.Schema({
    field:{
        type:String,
        required:true,
    }
})
const Field=mongoose.model('Field',fieldSchema);
module.exports={Field};

