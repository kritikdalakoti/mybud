const Task = require('../models/task');
const User = require('../models/usermodel');
const { successmessage, errormessage } = require('../utils/util');
const mongoose = require('mongoose');

exports.createTask = async (req, res) => {
    try {
        let { user } = req;
        user = mongoose.Types.ObjectId(JSON.parse(user));
        let { task, completiondate } = req.body;

        if (!task || !completiondate) {
            return res.status(400).json(errormessage("Provide All fields"));
        }

        let date = new Date(completiondate);
        if (date.toString() === 'Invalid Date') {
            return res.status(400).json(errormessage("Invalid Date!"))
        }

        if (date < new Date()) {
            return res.status(400).json(errormessage("Completion date should be greater than today's date"));
        }

        let isMatch = await Task.findOne({ userid: user });
        if (!isMatch) {
            let createdtask = new Task({
                task: {
                    taskname: task,
                    status: false,
                    completiondate: new Date(completiondate)
                },
                userid: user
            })

            await createdtask.save();
            return res.status(200).json(successmessage("task Created Successfuly!", createdtask));
        }

        let updates = {
            $push: {
                task: {
                    taskname: task,
                    status: false,
                    completiondate: new Date(completiondate)
                }
            }
        }

        let updatedtask = await Task.findOneAndUpdate({ userid: user }, updates, { new: true });
        res.status(200).json(successmessage("task created successfuly", updatedtask));

    } catch (err) {
        res.status(400).json(errormessage(err.message));
    }
}

exports.getTask = async (req, res) => {
    try {
        let { user } = req;
        user = mongoose.Types.ObjectId(JSON.parse(user));

        let task = await Task.findOne({ userid: user });
        if (!task) {
            return res.status(200).json("No Task Created !", []);
        }

        let results = await Task.aggregate([
            { $match: { userid: user } },
            {
                $project: {
                    tasks: {
                        $filter: {
                            input: "$task",
                            as: "task",
                            cond: {
                                $and: [
                                    { $eq: ["$$task.status", false] },
                                    { $gte: ["$$task.completiondate", new Date()] }
                                ]
                            }
                        }
                    },
                }
            },
            {$project:{
                tasks1: {
                    $map: {
                        input: "$tasks",
                        as: "task",
                        in: {
                            $mergeObjects: [
                                "$$task",
                                {
                                    "remainingdays": {
                                        $add:[
                                            {
                                                $round:{
                                                    $divide:[
                                                        {$subtract:["$$task.completiondate",new Date()]},
                                                        86400000
                                                    ]
                                                }
                                            },
                                            1
                                        ]
                                        
                                    }
                                }
                            ]
                        }
                    }
                }
            }}
        ]).allowDiskUse(true);

        res.status(200).json(successmessage("Fetched Tasks Successfuly!", results));


    } catch (err) {
        console.log(err);
        res.status(400).json(errormessage(err.message));
    }
}

exports.updateTask=async(req,res)=>{
    try{
        let {user}=req;
        let {taskid}=req.body;
        user = mongoose.Types.ObjectId(JSON.parse(user));

        let task = await Task.findOne({ userid: user });
        if (!task) {
            return res.status(200).json("No Task Created !", []);
        }

        let updates={
            "task.$.status":true
        }

        let tasks=await Task.findOneAndUpdate({userid:user,'task._id':mongoose.Types.ObjectId(taskid)},{$set:updates},{new:true});
        res.status(200).json(successmessage("UpdatesSuccessfuly!",tasks))

    }catch(err){
        res.status(200).json(errormessage(err.message));
    }
}

exports.deletetask=async(req,res)=>{
    try{
        let {taskid}=req.body;
        let {user}=req;
        user = mongoose.Types.ObjectId(JSON.parse(user));
        taskid=mongoose.Types.ObjectId(taskid);

        let isTask=await Task.findOne({userid:user,'task._id':taskid});
        if(!isTask){
            return res.status(400).json(errormessage("No task exists with this id!"));
        }
    
        let taskdoc=await Task.findOne({userid:user});
        let removeddoc=taskdoc.task.filter(tas=>tas._id.equals(taskid));

        let updatedtask=await Task.findOneAndUpdate({userid:user},{$pull:{task:removeddoc[0]}},{new:true});

        res.status(200).json(successmessage("Removed task Successfuly!",updatedtask));
    }catch(err){
        res.status(400).json(errormessage(err.message));
    }
}