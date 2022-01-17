const mongoose=require('mongoose');

const ChallengeSchema=new mongoose.Schema({
    name:String,
    days:Number,
    counter:[{
        type:Date
    }],
    userid:mongoose.Types.ObjectId,
    isCompleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

ChallengeSchema.index({name:1,userid:1});

module.exports=mongoose.model('Challenge',ChallengeSchema);