const User = require('../models/usermodel');
const { generateToken, hashPassword, successmessage, 
    errormessage, verifypassword, sendEmail ,
    uploadAws ,deletefiles,getImage 
} = require('../utils/util');
const fs=require('fs');
const { v4: uuidv4 }=require('uuid');
const path=require('path');
const mongoose = require('mongoose');

exports.UserSignUp = async (req, res) => {
    try {
        console.log(req.body)
        let { username, password, email, phoneno } = req.body;
        if (!username || !password || !email || !phoneno) {
            return res.status(400).json(errormessage("All fields must be present"));
        }

        username = username.trim();
        password = password.trim();
        email = email.trim();
        phoneno = phoneno.trim();

        //checking if email exists already and not verified
        let ismatch = await User.findOne({ email,status:false });
        if (ismatch) {
            return res.status(400).json(errormessage("Email already registered! Verify email to continue!"));
        }

        //checking if email exists already and verified
        let ismatch1 = await User.findOne({ email,status:true });
        if (ismatch1) {
            return res.status(400).json(errormessage("Email already registered and verified! Login to proceed!"));
        }



        // checking valid phone no.
        let reg = "(?:(?:\\+|0{0,2})91(\\s*[\\-]\\s*)?|[0]?)?[789]\\d{9}";
        let phonereg = new RegExp(reg);

        if (!phonereg.test(phoneno) === null) {
            return res.status(400).json(errormessage("Enter valid Phone Number"));
        }

        //hashing the password
        let hashedpassword = hashPassword(password);

        let confirmationcode = Math.floor(1000 + Math.random() * 9000);

        let user = new User({
            username,
            password: hashedpassword,
            email,
            phoneno,
            confirmationcode
        });

        //generating token
        const token = generateToken(JSON.stringify(user._id));

        await user.save();

        let result = await sendEmail(user.email, user.confirmationcode, user.username);
        console.log(result);
        if (result.error) {
            console.log("Email not sent!")
            return res.status(200).json(errormessage("Email not sent!"));
        }

        res.status(200).json(successmessage("User Created!", token));

    } catch (err) {
        res.status(400).json(errormessage(err.message))
    }
}

exports.LoginUser = async (req, res) => {
    try {
        console.log(req.headers);
        let { username, password } = req.body;

        if(!username||!password){
            return res.status(400).json(errormessage("All fields should be present!"));
        }

        username = username.trim();
        password = password.trim();

        // check whether email exists or not
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json(errormessage("Email or password incorrect!"));
        }

        if (!verifypassword(password, user.password)) {
            return res.status(400).json(errormessage("Email or password incorrect!"));
        }

        //checking whether verified email or not
        if (!user.status) {
            return res.status(400).json(errormessage("Email not Verified! Please verify your mail!"));
        }


        let token = generateToken(JSON.stringify(user._id));

        res.status(200).json(successmessage("Logged In Successfuly!", token));

    } catch (err) {
        res.status(400).json(errormessage(err.message));
    }
}

exports.verifyCode = async (req, res) => {
    try {
        let { code, email } = req.body;

        if(!code||!email){
            return res.status(400).json(errormessage("All fields must be present!"));
        }

        let user = await User.findOne({ email, confirmationcode: code });
        if (!user) {
            return res.status(404).json(errormessage("Not Valid code!"));
        }

        user.status = true;
        await user.save();
        res.status(200).json(successmessage("Verified Succesfuly!", user))
    } catch (err) {
        res.status(400).json(errormessage(err.message));
    }
}

exports.resendOTP = async (req, res) => {
    try {
        let { email } = req.body;

        if(!email){
            return res.status(400).json(errormessage("Email field should be given !"));
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json(errormessage("User not found!"));
        }

        let confirmationcode = Math.floor(1000 + Math.random() * 9000);
        user.confirmationcode = confirmationcode;
        await user.save();

        let result = await sendEmail(user.email, user.confirmationcode, user.username);

        if (result.error) {
            console.log("Email not sent!")
            return res.status(200).json(errormessage("Email not sent!"));
        }
        res.status(200).json(successmessage("Email sent!"));
    } catch (err) {
        res.status(400).json(errormessage(err.message));
    }
}

exports.Uploadimage=async(req,res)=>{
    try{
        console.log(req.file);
        if(!req.file){
            return res.status(400).json(errormessage("Image not provided!"))
        }
        let filetype=req.file.filename.split('.')[1];
        let data = fs.readFileSync(`${path.join(__dirname, '../uploads/')}${req.file.filename}`);
        let uploads={
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:`uploads/${uuidv4()}.${filetype}`,
            Body:data
        }

        let result=await uploadAws(uploads);
        if(result.error){
            res.status(500).json(errormessage(result.error));
        }

        //update the returned key in user database too.
        let updates={
            image:{
                key:result,
                filename:req.file.filename
            }
        }
        await User.findOneAndUpdate({_id: mongoose.Types.ObjectId(JSON.parse(req.user)) },{$set:updates});

        let directory=path.join(__dirname,'../uploads');
        deletefiles(directory);

        res.status(200).json(successmessage("File Uploaded Successfuly!"));


    }catch(err){
        res.status(400).json(errormessage(err.message));
    }
}

exports.getUserimage=async(req,res)=>{
    try{
        let {user}=req;
        let {key}=req.body;
        let result=await User.findOne({_id:mongoose.Types.ObjectId(JSON.parse(user))});

        if(!result){
            return res.status(404).json(errormessage("No user found!"));
        }
        console.log(result.image.key);
        let params={
            Key:key?`${key}`:`${result.image.key}` ,
            Bucket:process.env.AWS_BUCKET_NAME,
        }
        await getImage(params,res);

    }catch(err){
        res.status(400).json(errormessage(err.message));
    }
}

exports.setdetails=async(req,res)=>{
    try{
        let {profession,details,objective,target}=req.body;

        if(!profession||!details||!objective||!target){
            res.status(400).json(errormessage("All fields should be given!"));
        }

        let updates={
            Info:{
                profession,
                details
            },
            objective:{
                title:objective,
                target
            }
        }

        let user=await User.findOneAndUpdate({_id:mongoose.Types.ObjectId(JSON.parse(req.user))},{$set:updates},{new:true});
        if(!user){
            return res.status(400).json(errormessage("Something went wrong!"));
        }

        res.status(200).json(successmessage("Updated Successfuly!",user));

    }catch(err){
        res.status(400).json(errormessage(err.message));
    }
}

exports.getProfile= async (req,res)=>{
    try{
        
        let user=await User.findOne({_id: mongoose.Types.ObjectId(JSON.parse(req.user)) });
        
        if(!user){
            return res.status(404).json(errormessage("User not found!"));
        }
        res.status(200).json(successmessage("User Profile",user));

    }catch(err){
        res.status(400).json(errormessage(err.message));
    }
}

