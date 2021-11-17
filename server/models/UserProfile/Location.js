const mongoose=require('mongoose');

const locationSchema=mongoose.Schema({
    user_uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    lat:{
        type:Number,
        required:true,
    },lon:{
        type:Number,
        required:true,
    }
})
locationSchema.statics.getlocation = async function(user_uid){
    var user=this;
    var res;
    await this.findOne({user_uid}).then((result)=>{
        if(result){
            res=[result.lat,result.lon];
        }else{
            res="";
        }
    }).catch(err=>{res=err})
    return res;
}
const Location=mongoose.model('Location',locationSchema);
module.exports={Location};