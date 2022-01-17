const mongoose=require('mongoose');

const ChallengeSchema=new mongoose.Schema({
    name:String,
    days:Number,
    counter:[{
        type:String
    }],
    userid:mongoose.Types.ObjectId,
    isCompleted:{
        type:Boolean,
        default:false
    },
    createdDate:String,
    finalDate:String
},{
    timestamps:true
})

ChallengeSchema.index({name:1,userid:1});

module.exports=mongoose.model('Challenge',ChallengeSchema);