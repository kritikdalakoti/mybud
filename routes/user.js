const express = require('express');
const router = express.Router();
const Usercontroller = require('../controllers/user');
const { auth } = require('../middleware/auth');
const User = require('../models/usermodel');
const multer=require('multer')

const upload=multer();

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

module.exports = router;