const express=require('express');
const router=express.Router();
const {auth}=require('../middleware/auth');
const TaskController=require('../controllers/task');
const multer=require('multer')
const upload=multer();



router.post(
    '/createtask',
    upload.none(),
    auth,
    TaskController.createTask
)

router.get(
    '/gettasks',
    auth,
    TaskController.getTask
)

router.post(
    '/taskdone',
    upload.none(),
    auth,
    TaskController.updateTask
)

router.delete(
    '/taskdelete',
    upload.none(),
    auth,
    TaskController.deletetask
)

module.exports=router;