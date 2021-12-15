const express=require('express');
const router=express.Router();
const {auth}=require('../middleware/auth');
const cardController=require('../controllers/cards');

const multer=require('multer');

const upload=multer();

router.post(
    '/swipe',
    auth,
    upload.none(),
    cardController.swipecard
)

router.get(
    '/getcards',
    auth,
    cardController.getCards
)

module.exports=router;








