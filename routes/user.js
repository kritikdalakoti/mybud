const express = require('express');
const router = express.Router();
const path =require('path');
const Usercontroller = require('../controllers/user');
const { auth } = require('../middleware/auth');
const User = require('../models/usermodel');
const multer=require('multer')

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname,'../uploads'));
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})
console.log( path.join(__dirname,'../uploads') )
const upload=multer({storage});

router.post(
    '/signup',
    upload.none(),
    Usercontroller.UserSignUp
);
router.post(
    '/login',
    upload.none(),
    Usercontroller.LoginUser
);
router.get('/me', auth, async (req, res) => {
    let user = await User.findOne({ _id: JSON.parse(req.user) });
    res.json(user);
})

router.post(
    '/verifyemail',
    upload.none(),
    Usercontroller.verifyCode
);

router.post(
    '/resendotp',
    upload.none(),
    Usercontroller.resendOTP
)

router.post(
    '/upload',
    auth,
    upload.single("image"),
    Usercontroller.Uploadimage
)

router.post(
    '/get/image',
    auth,
    upload.none(),
    Usercontroller.getUserimage
)

router.post(
    '/add/details',
    auth,
    upload.none(),
    Usercontroller.setdetails
)

router.get(
    '/get/profile',
    auth,
    upload.none(),
    Usercontroller.getProfile
    
)

module.exports = router;