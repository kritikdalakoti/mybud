const mongoose = require('mongoose');
const Message = require('../models/chat');
const Socket=require('../models/socket');
const { successmessage, errormessage } = require('../utils/util');


exports.checkroom = async (roomid) => {
    let room = await Message.findOne({ roomid });
    if (room) {
        let room1 = await Message.findOne({ roomid, memberslength: { $lt: 2 } });
        if (room1) {
            return successmessage("success");
        }
        return errormessage("room full!");
    }

    return successmessage("Success");
}

exports.addinroom = async (member, roomid) => {
    try {

        let room = await Message.findOneAndUpdate({ roomid }, { $inc: { memberslength: 1 } }, { new: true });
        if (!room) {
            let message = new Message({
                roomid,
                members: [mongoose.Schema.Types.ObjectId(member)],
                memberslength: 1,
                messages: []
            });
            await message.save();
        }
    } catch (err) {
        console.log(err.message);
        return errormessage(err.message);
    }

}

exports.storeMessage = async (message, sender, reciever) => {

    let updates = {
        sender: mongoose.Types.ObjectId(sender),
        reciever: mongoose.Types.ObjectId(reciever),
        message,
        created: Date.now()
    }

    let arr=[mongoose.Types.ObjectId(reciever),mongoose.Types.ObjectId(sender)];

    let findConditions = {
         $or:[
            {members:[mongoose.Types.ObjectId(reciever),mongoose.Types.ObjectId(sender)]},
            {members:[mongoose.Types.ObjectId(sender),mongoose.Types.ObjectId(reciever)]}
          ]
    }
    console.log('gr we here')
    let isMatch = await Message.findOne(findConditions);
    console.log('fdbg',isMatch);
    if (!isMatch) {
        let message = new Message({
            members: [mongoose.Types.ObjectId(sender),
            mongoose.Types.ObjectId(reciever)],
            memberslength:2,
            messages:[
                updates
            ]
        });
        await message.save();
        return
    }

    await Message.findOneAndUpdate(findConditions, { $push: { messages: updates } });
}

exports.getMessages=async(userid)=>{
    userid=mongoose.Types.ObjectId(userid);
    let userchats=await Message.find({members:{$in:[userid]}});
    if(userchats){
        return userchats
    }
    return [];
}

exports.deleteSocket = async (socketid) => {
    await Socket.findOneAndDelete({socketid});
}