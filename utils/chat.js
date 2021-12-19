const mongoose = require('mongoose');
const Message=require('../models/chat');
const {successmessage, errormessage} =require('../utils/util');


exports.checkroom=async (roomid)=>{
    let room=await Message.findOne({roomid});
    if(room){
       let room1=await Message.findOne({roomid,memberslength:{$lt:2}});
       if(room1){
           return successmessage("success");
       }
       return errormessage("room full!");
    }

    return successmessage("Success");
}

exports.addinroom=async(member,roomid)=>{
    try{

        let room=await Message.findOneAndUpdate({roomid},{$inc:{memberslength:1}},{new:true});
        if(!room){
            let message=new Message({
                roomid,
                members:[mongoose.Schema.Types.ObjectId(member)],
                memberslength:1,
                messages:[]
            });
            await message.save();
        }
    }catch(err){
        console.log(err.message);
        return errormessage(err.message);
    }
    
}

exports.storeMessage=async(message,roomid,sender,reciever)=>{

    let updates={
        sender:mongoose.Types.ObjectId(sender),
        reciever:mongoose.Types.ObjectId(reciever),
        message,
        created:Date.now
    }

    await Message.findOneAndUpdate({roomid},{$push:{messages:updates}});
}

exports.userunmatched=async(roomid)=>{
    await Message.findOneAndDelete({roomid});
}