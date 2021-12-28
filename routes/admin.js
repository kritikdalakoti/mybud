const {Router}=require('express');
const {successmessage,errormessage}=require('../utils/util');
const adminAuth=require('../middleware/admin');
const AdminController=require('../controllers/admin');
const router=Router();

router.get(
    '/allusers',
    // adminAuth,
    AdminController.getAllUsers
)

router.get(
    '/user',
    // adminAuth,
    AdminController.getUser
)

router.get(
    '/matches',
    // adminAuth,
    AdminController.getmatches
)

module.exports=router;
