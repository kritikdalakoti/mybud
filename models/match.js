const mongoose=require('mongoose');
const {Schema}=mongoose;

const MatchSchema= new Schema({
    users:[
        {type:mongoose.Types.ObjectId}
    ]
},{
    timestamps:{type:Date,default:Date.now}
});



module.exports=  mongoose.model("matches",MatchSchema);


