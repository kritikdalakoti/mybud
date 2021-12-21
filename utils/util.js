const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const fs=require('fs');
const path=require('path');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
})


exports.generateToken = (userid) => {
  const token = jwt.sign(userid, process.env.TOKEN_SECRET);
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

exports.successmessage = (message, payload = true) => {
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

    htmlContent: `<h1>Email Confirmation</h1>
    <h2>Hello ${username}</h2>
    <p>Thank you for subscribing. Your Verification code is ${code}</div>`,
  }

  try {
    let res = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return res;
  } catch (err) {
    return this.errormessage(err.message)
  }
}

exports.uploadAws = async (params) => {

  try {
    let data = await s3.upload(params).promise();
    return data;
  } catch (err) {
    console.log(err);
    return this.errormessage(err.message);
  }
}

exports.deletefiles = (directory) => {
  try {
    let files = fs.readdirSync(directory)
    for (const file of files) {
      fs.unlinkSync(path.join(directory, file))
    }
    return this.successmessage("Files deleted !");
  } catch (err) {
    return this.errormessage(err.message);
  }

}

exports.getImage=(params,res)=>{

  return new Promise((resolve,reject)=>{
    
    s3.getObject(params).createReadStream().on(
      "error",(error)=>{
        reject(error);
      }
    ).pipe(res);
  })

  // try{
  //   console.log(params)
  //   const readstream = s3.getObject(params).createReadStream();
  //   // console.log(data);
  //   // let readStream=data.Body.createReadStream();
  //   // console.log(readStream);
  //   readstream.pipe(res);
  // }catch(err){
  //   return res.status(400).json(this.errormessage(err.message));
  // }
}