const mongoose=require('mongoose');
const {Schema}=mongoose;

const SwipeSchema= new Schema({
    swipedby:mongoose.Types.ObjectId,
    swipedon:mongoose.Types.ObjectId,
    status:number  // 1-> disliked 2-> liked  3-> superliked
});

SwipeSchema.index({swipedby:1,swipedon:1});

module.exports=  mongoose.model("Swipes",SwipeSchema);


