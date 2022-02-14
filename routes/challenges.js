const express=require('express');
const router=express.Router();
const controller=require('../controllers/challenges');
const {auth}=require('../middleware/auth');
const multer=require('multer');
const upload=multer();

router.get(
    '/getchallenges',
    auth,
    controller.getChallenges
)

router.post(
    '/takechallenge',
    auth,
    upload.none(),
    controller.takeChallenge
)

router.post(
    '/attendence',
    auth,
    upload.none(),
    controller.dailyattendence
)

router.get(
    '/getuserchallenges',
    auth,
    upload.none(),
    controller.getUserchallenges
)

router.post(
    '/getattendence',
    auth,
    upload.none(),
    controller.getAttendence
)

router.get(
    '/deletechallenge',
    auth,
    controller.deleteChallenge
)

module.exports=router;