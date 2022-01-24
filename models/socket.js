const mongoose=require('mongoose');

const SocketSchema=new mongoose.Schema({
    socketid:String,
    userid:mongoose.Types.ObjectId  
},{timestamps:true})

module.exports=mongoose.model('Socket',SocketSchema);

// on privatemessage check whether particular client is offline or online
// if offline then store its message via its id and dont send the 
// message with socket . if online then store the message via id 
// and send the message with socket

// on every disconnect update socket model of that particular user
// so that we can know wheather user is onlne or offline when we 
// send private message