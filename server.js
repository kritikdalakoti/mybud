const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

app.use(express.json({limit: '50mb'}));
app.use(cors({limit: '50mb'}));

// Importing Routes
app.use('/user',require('./routes/user'));
app.use('/card',require('./routes/cards'));

const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverSelectionTimeoutMS: 9000000,
	socketTimeoutMS: 9000000,
};
console.log(process.env.MONGOURI)
mongoose.connect(process.env.MONGOURI, options);
mongoose.connection.on('connected', () => {
	console.log('connected to database!');
});
mongoose.connection.on('error', (err) => {
	console.log('error in connection', err);
});


app.listen(port, () => console.log(`app listening on port ${port}!`));