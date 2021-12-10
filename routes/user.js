const express = require('express');
const router = express.Router();
const Usercontroller = require('../controllers/user');
const { auth } = require('../middleware/auth');
const User = require('../models/usermodel');

router.post(
    '/signup',
    Usercontroller.UserSignUp
);
router.post(
    '/login',
    Usercontroller.LoginUser
);
router.get('/me', auth, async (req, res) => {
    let user = await User.findOne({ _id: JSON.parse(req.user) });
    res.json(user);
})

router.post(
    '/verifyemail',
    Usercontroller.verifyCode
);

module.exports = router;