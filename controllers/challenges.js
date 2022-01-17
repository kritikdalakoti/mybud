const {challenges,successmessage,errormessage}=require('../utils/util');
const User=require('../models/usermodel');
const Challenge=require('../models/challenges');

exports.getChallenges=()=>{
    res.status(200).json(successmessage("All Challenges",challenges));
}

exports.takeChallenge=async(req,res)=>{
    try{
        let {challenge,days}=req.body;
        if(!challenge||!days){
            return res.status(400).json(errormessage("All fields not present!"));
        }

        let {user}=req;
        user=JSON.parse(mongoose.Types.ObjectId(user) );

        days=parseInt(days);
        let user_challenge=await Challenge.findOne({name:challenge,userid:user,isCompleted:false}); //checking if user has already taken part in this challenge and not yet finished
        if(user_challenge){
            return res.status(400).json(errormessage("You have already taken this challenge and not yet finished it!"))
        }

        user_challenge=new Challenge({
            name:challenge,
            days,
            userid:user,
            isCompleted:false,
            counter:[]
        });

        await user_challenge.save();
        res.status(200).json(successmessage('Successfuly enrolled in the Challenge!',user_challenge));
    }catch(err){
        res.status(400).json(errormessage(err.message));
    }
}

exports.dailyattendence=async(req,res)=>{
    try{
        let {challenge}=req.body;
        if(!challenge){
            return res.status(400).json(errormessage("ALl fields should be present!"));
        }
        let {user}=req;

        user=JSON.parse(mongoose.Types.ObjectId(user));
        let isMatch=await Challenge.findOne({name:challenge,userid:user,isCompleted:true});
        if(isMatch){
            return res.status(400).json(errormessage("You have already completed the challenge!"));
        }
        isMatch=await Challenge.findOne({name:challenge,userid:user,counter:{$in:[Date.now()]}});
        if(isMatch){
            return res.status(400).json(errormessage("You have already marked the attendence for today!"));
        }

        let updates={
            $push:{
                counter:Date.now()
            }
        }
        let updatedchallenge=await Challenge.findOneAndUpdate({name:challenge,userid:user},updates,{new:true});
        if(!updatedchallenge){
            return res.status(400).json(errormessage("Something Went Wrong!"));
        }

        res.status(200).json(successmessage("Successfuly Updated!"),updatedchallenge);

    }catch(err){
        res.status(400).json(errormessage(err.message))
    } 
}
