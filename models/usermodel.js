const mongoose=require('mongoose')
const {isEmail } =require('validator')

const UserSchema= new mongoose.Schema({
    username:{
        type:String,
        trim:true,
        username:true
    },
    password:{type:String},
    email:{
        type:String,
        validate:[
            isEmail,
            "Invalid Email!"
        ]
    },
    phoneno:{
        type:String,
    }
})

UserSchema.index({username:1,email:1});

module.exports=mongoose.model("User",UserSchema);
