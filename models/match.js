const mongoose=require('mongoose');
const {Schema}=mongoose;

const MatchSchema= new Schema({
    users:[
        {type:mongoose.Types.ObjectId}
    ]
},{
    timestamps:{type:Date,default:Date.now}
});

MatchSchema.index({swipedby:1,swipedon:1});

module.exports=  mongoose.model("matches",MatchSchema);


