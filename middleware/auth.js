const {errormessage,successmessage}=require('../utils/util')
const jwt=require('jsonwebtoken');


exports.auth=(req,res,next)=>{
    try{
        const header=req.headers["authorization"];
        console.log(header);
        const token=header.split(" ")[1];
    
        if(!token){
            return res.status(400).json(errormessage("Token not present!"));
        }
    
        let userid=jwt.verify(token,"MYBUDSECRET");
        console.log(userid);
    
        req.user=userid;
        next();
    }catch(err){
        res.status(400).json(errormessage(err.message))
    }
}