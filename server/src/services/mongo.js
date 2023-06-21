const mongoose = require("mongoose").default;
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
	console.log('MongoDB connection ready')
});

mongoose.connection.on('error', (err) => {
	console.error(err);
})

async function mongoConnect(){
	return mongoose.connect(MONGO_URL);
}

async function mongoDisconnect(){
	return mongoose.disconnect();
}

module.exports = {
	mongoConnect,
	mongoDisconnect
}
