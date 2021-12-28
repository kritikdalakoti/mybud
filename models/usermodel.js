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
    },
    confirmationcode:String,
    status:{
        type:Boolean,
        default:false
    },
    image:{
        key:String,
        filename:String,
        location:String
    },
    Info:{
        profession:String,
        details:String
    },
    objective:{
        title:String,
        target:String
    },
    skillsets:[
        {type:String}
    ],
    linkedinprofile:String
})

UserSchema.index({username:1,email:1});

module.exports=mongoose.model("User",UserSchema);
