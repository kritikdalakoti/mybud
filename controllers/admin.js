const mongoose = require('mongoose');
const User = require('../models/usermodel');
const matchModel = require('../models/match');
const { successmessage, errormessage } = require('../utils/util');


exports.getAllUsers = async (req, res) => {
    try {

        let perpage = 20;

        let { page } = req.query;
        console.log(page);
        if (!page || !parseInt(page)) {
            return res.status(400).json(errormessage("Page no should be present or should not be zero!"))
        }

        page = parseInt(page);
        let start = (page - 1) * perpage;

        let users = await User.find({}).sort({ _id: -1 }).skip(start).limit(perpage);
        res.status(200).json(successmessage("All Users", users));

    } catch (err) {
        res.status(400).json(errormessage(err.message));
    }
}

exports.getUser = async (req, res) => {
    try {

        let { id } = req.query;

        let user = await User.find({ _id: mongoose.Types.ObjectId(id) });
        if (!user) {
            return res.status(404).json(errormessage("User not found!"));
        }
        res.status(200).json(successmessage("user Details", user));

    } catch (err) {
        res.status(400).json(errormessage(err.message));
    }
}

exports.getmatches = async (req, res) => {
    try {
        let matches = await matchModel.aggregate([
            {
                $lookup: {
                    'from': 'users',
                    'let': { 'uid': '$users' },
                    'pipeline': [
                        { '$match': { '$expr': { '$in': ['$_id', '$$uid'] } } },
                        {$project:{
                            password:0,
                            confirmationcode:0,
                            status:0
                        }}
                    ],
                    'as': 'userdata'
                }
            },
            
        ]).allowDiskUse(true);
        res.status(200).json(successmessage("user Details", matches));

    } catch (err) {
        res.status(400).json(errormessage(err.message));
    }
}



