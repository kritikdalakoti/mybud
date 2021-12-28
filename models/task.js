const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    task: [
        {
            taskname:String,
            status:Boolean,
            completiondate:{type:Date}
        }
    ],
    userid: mongoose.Types.ObjectId
}, { timestamps: true })

module.exports = mongoose.model('Task', TaskSchema);