const Swipe = require('../models/swipemodel');
const Match = require('../models/match');
const User = require('../models/usermodel');
const { successmessage, errormessage } = require('../utils/util');
const mongoose = require('mongoose');

exports.swipecard = async (req, res) => {
    try {

        let { swipedon, swipedby, status } = req.body;

        if (!swipedon || !swipedby || !status) {
            return res.status(400).json(errormessage("All fields should be present!"));
        }

        swipedon = mongoose.Types.ObjectId(swipedon);//2
        swipedby = mongoose.Types.ObjectId(swipedby);//1
        status = parseInt(status);

        if (status > 3 || status < 1) {
            return res.status(400).json(errormessage("Status value should be in between 1 and 3"));
        }

        let swipe = new Swipe({
            swipedby,
            swipedon,
            status
        });

        await swipe.save();

        // check if it is a match

        if (status == 1 || status == 3) {  // meaning the user liked or superliked
            let match = await Swipe.findOne({ swipedon: swipedby, swipedby: swipedon, status: { $in: [1, 3] } });
            if (match) {
                let users = [swipedon, swipedby];
                let newmatch = new Match({
                    users,
                    createdOn: Date.now(),
                    updatedAt: Date.now()
                });

                await newmatch.save();

                let user1 = await User.findOne({ _id: swipedon });
                let user2 = await User.findOne({ _id: swipedby });

                let data = {
                    swipedon: user1,
                    swipedby: user2
                }

                return res.status(200).json(successmessage("It's a Match!", data));

            }

            return res.status(200).json(successmessage("Swiped Successfuly!"));

        }

        res.status(200).json(successmessage("Swiped Successful!"));

    } catch (err) {
        res.status(400).json(errormessage(err.message));
    }
}


exports.getCards = async (req, res) => {
    try {
        let { user } = req;
        
        let perpage = 10;

        let {page}=req.query;
        console.log(page);
        if(!page||!parseInt(page)){
            return res.status(400).json(errormessage("Page no should be present or should not be zero!"))
        }

        page = parseInt(page);
        

        let start = (page - 1) * perpage;


        let ismatch=await Match.findOne({users:{$in:[mongoose.Types.ObjectId(JSON.parse(user))]}});
        if(ismatch){
            console.log(mongoose.Types.ObjectId(JSON.parse(user)));
            let user1=await User.findOne({_id:mongoose.Types.ObjectId(JSON.parse(user))});
            let user2=await User.findOne({_id:ismatch.users[0]});
            let user3=await User.findOne({_id:ismatch.users[1]});
            let userdetails;
            if(user1.username===user2.username){
                userdetails=user3;
            }else{
                userdetails=user2;
            }
           
           return res.status(200).json(successmessage("Already have a buddy!",userdetails)); 
        }
        // getting all users current user has left swiped
        let dislikedusers = await Swipe.aggregate([
            { $match: { swipedby: mongoose.Types.ObjectId(JSON.parse(user)), status: 2 } },
            {
                $group: {
                    _id: "$swipedby",
                    swipedusers: { $push: "$swipedon" }
                },
            },
            {
                $project: {
                    swipedusers: "$swipedusers"
                }
            }
        ]).allowDiskUse(true);

        console.log(dislikedusers);

        let filtered_array = dislikedusers.length?dislikedusers[0].swipedusers:[];

        filtered_array.push(mongoose.Types.ObjectId(JSON.parse(user)));

        let findConditions = {
             _id: { $nin: filtered_array },
             imagecheck:true,
             detailscheck:true,
             status:true
    };

    user=await User.findOne({_id:mongoose.Types.ObjectId(JSON.parse(user))});

    // storing the profession and objective of the user who's swiping so that can sort accordingly.
    let profession=user.Info.profession;
    let objective=user.objective.title;

    let eligibleusers = await User.aggregate([

        { $match: findConditions },
        {$addFields:{
            rank1:{$cond:[{$eq:["$Info.profession",profession]},1,-1]}
        }},
        {$addFields:{
            rank2:{$cond:[{$eq:["$objective.title",objective]},1,-1]}
        }},
        {$sort:{rank1:-1,rank2:-1}},  // sorting according the user profession and objective
        { $skip: start },
        { $limit: perpage },
    ]).allowDiskUse(true);

    let totalNumber = eligibleusers.length;

    let result = {
        message: 'File List Page Number ' + page,
        data: eligibleusers,
        count: totalNumber,
        page:page,
        success: true
    }

    res.status(200).json(result);


} catch (err) {
    res.status(400).json(errormessage(err.message));
}
}


exports.getCards1 = async (req, res) => {
    try {
        let { user } = req;
        
        let perpage = 10;

        let {page}=req.query;
        console.log(page);
        if(!page||!parseInt(page)){
            return res.status(400).json(errormessage("Page no should be present or should not be zero!"))
        }

        page = parseInt(page);
        

        let start = (page - 1) * perpage;


        let ismatch=await Match.findOne({users:{$in:[mongoose.Types.ObjectId(JSON.parse(user))]}});
        if(ismatch){
            console.log(mongoose.Types.ObjectId(JSON.parse(user)));
            let user1=await User.findOne({_id:mongoose.Types.ObjectId(JSON.parse(user))});
            let user2=await User.findOne({_id:ismatch.users[0]});
            let user3=await User.findOne({_id:ismatch.users[1]});
            let userdetails;
            if(user1.username===user2.username){
                userdetails=user3;
            }else{
                userdetails=user2;
            }
           
           return res.status(200).json(successmessage("Already have a buddy!",userdetails)); 
        }
        // getting all users current user has left swiped
        let dislikedusers = await Swipe.aggregate([
            { $match: { swipedby: mongoose.Types.ObjectId(JSON.parse(user)), status: 2 } },
            {
                $group: {
                    _id: "$swipedby",
                    swipedusers: { $push: "$swipedon" }
                },
            },
            {
                $project: {
                    swipedusers: "$swipedusers"
                }
            }
        ]).allowDiskUse(true);

        console.log(dislikedusers);

        let filtered_array = dislikedusers.length?dislikedusers[0].swipedusers:[];

        filtered_array.push(mongoose.Types.ObjectId(JSON.parse(user)));

        let findConditions = {
             _id: { $nin: filtered_array },
            //  imagecheck:true,
            //  detailscheck:true,
            //  status:true
    };

    user=await User.findOne({_id:mongoose.Types.ObjectId(JSON.parse(user))});

    // storing the profession and objective of the user who's swiping so that can sort accordingly.
    let profession=user.Info.profession;
    let objective=user.objective.title;

    let eligibleusers = await User.aggregate([

        { $match: findConditions },
        {$addFields:{
            rank1:{$cond:[{$eq:["$Info.profession",profession]},1,-1]}
        }},
        {$addFields:{
            rank2:{$cond:[{$eq:["$objective.title",objective]},1,-1]}
        }},
        {$sort:{rank1:-1,rank2:-1}},  // sorting according the user profession and objective
        { $skip: start },
        { $limit: perpage },
    ]).allowDiskUse(true);

    let totalNumber = eligibleusers.length;

    let result = {
        message: 'File List Page Number ' + page,
        data: eligibleusers,
        count: totalNumber,
        page:page,
        success: true
    }

    res.status(200).json(result);


} catch (err) {
    res.status(400).json(errormessage(err.message));
}
}