const cron = require('node-cron');
const Challenges = require('../models/challenges');
const { todayDate } = require('./util');

// cron.schedule(
//     '58 23 * * *',
//     hello
// );

// cron.schedule(
//     '57 23 * * *',
//     checkcompletedChallenges
// );

async function hello() {
    let challenges = await Challenges.find({ isCompleted: false });
    let filtered_array = challenges.filter((challenge) => {
        let flag = 0;
        let sorted_array = challenge.counter.sort((a, b) => new Date(a) - new Date(b));
        if (sorted_array.length > 1) {
            for (var i = 0; i < sorted_array.length - 1; i++) {
                console.log((new Date(sorted_array[i + 1]).getTime() - new Date(sorted_array[i]).getTime()) / (24 * 3600 * 1000))
                if (((new Date(sorted_array[i + 1]).getTime() - new Date(sorted_array[i]).getTime()) / (24 * 3600 * 1000)) >= 3) {
                    flag = 1;
                }
            }
        }
        if (flag) {
            return challenge
        }
    })
    filtered_array.map(async arr => {
        let updates = {
            $set: {
                createdDate: todayDate()
            }
        }
        await Challenges.findOneAndUpdate({ _id: arr._id }, updates);
    })

}

const checkcompletedChallenges = async () => {
    let results=await Challenges.updateMany({isCompleted: false,finalDate: todayDate()},{$set:{isCompleted:true}},{new:true});
    console.log(results);
}
// checkcompletedChallenges();
//  hello();