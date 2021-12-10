const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

exports.generateToken = (userid) => {
    const token= jwt.sign(userid,process.env.TOKEN_SECRET);
    // const token = jwt.sign(userid, "MYBUDSECRET");
    return token;
}

exports.hashPassword = (password) => {
    let hashedpassword = bcrypt.hashSync(password, 8);
    return hashedpassword;
}

exports.verifypassword = (password, hashedpassword) => {
    return bcrypt.compareSync(password, hashedpassword);
}

exports.successmessage = (message, payload) => {
    return {
        success: true,
        message,
        data: payload
    }
}
exports.errormessage = (error) => {
    return {
        success: false,
        error
    }
}

exports.sendEmail = async (email, code, username) => {
    
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail = {
    sender: {
      name: 'MyBud',
      email: 'noreply@eramcapital.com',
    },
    to: [
      {
        email,
        name: username,
      },
    ],
    subject: `Verification Link`,

    htmlContent:`<h1>Email Confirmation</h1>
    <h2>Hello ${username}</h2>
    <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
    <a href=https://sheltered-earth-76230.herokuapp.com/user/confirm/${code}> Click here</a>
    </div>`,
  }

  try{
    let res=await apiInstance.sendTransacEmail(sendSmtpEmail);
    return res;
  }catch(err){
    return this.errormessage(err.message)
  }
    

}