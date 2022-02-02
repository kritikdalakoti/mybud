const mongoose=require('mongoose');
const {Schema}=mongoose;

const SwipeSchema= new Schema({
    swipedby:mongoose.Types.ObjectId,
    swipedon:mongoose.Types.ObjectId,
    status:Number,  // 1-> liked 2-> disliked  3-> saved
},{
    timestamps:{type:Date,default:Date.now}
});

SwipeSchema.index({swipedby:1,swipedon:1});

module.exports=  mongoose.model("Swipes",SwipeSchema);


