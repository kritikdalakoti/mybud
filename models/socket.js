const mongoose=require('mongoose');

const SocketSchema=new mongoose.Schema({
    socketid:String,
    userid:mongoose.Types.ObjectId  
},{timestamps:true})

module.exports=mongoose.model('Socket',SocketSchema);