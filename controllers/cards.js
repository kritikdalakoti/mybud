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

        let filtered_array=dislikedusers[0].swipedusers;

        let eligibleusers=await User.find({_id:{$nin:filtered_array}});
        res.status(200).json(successmessage("Successfuly fetched Cards!",eligibleusers));


    } catch (err) {
        res.status(400).json(errormessage(err.message));
    }
}