const express=require('express');
const router=express.Router();
const Usercontroller=require('../controllers/user');


router.post('/signup',Usercontroller.UserSignUp);



module.exports=router;