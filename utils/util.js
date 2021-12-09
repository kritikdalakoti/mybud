const jwt =require('jsonwebtoken');
const bcrypt=require('bcryptjs');

exports.generateToken=(userid)=>{
    // const token= jwt.sign(userid,process.env.TOKEN_SECRET);
    const token= jwt.sign(userid,"MYBUDSECRET");
    return token;
}

exports.hashPassword= (password)=>{
    let hashedpassword=bcrypt.hashSync(password,8);
    return hashedpassword;
}

exports.successmessage=(message,payload)=>{
    return {
        success:true,
        message,
        data:payload
    }
}
exports.errormessage=(error)=>{
    return {
        success:false,
        error
    }
}