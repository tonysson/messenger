const mongoose = require('mongoose');


const connect = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URL);
		console.log('connected to Mongo DB');
	} catch (error) {
		throw error;
	}
};

module.exports = connect