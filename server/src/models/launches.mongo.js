const mongoos = require('mongoose');

const launchesSchema = new mongoos.Schema({
	flightNumber: {
		type: Number,
		required: true
	},
	launchDate: {
		type: Date,
		required: true,
	},
	mission: {
		type: String,
		required: true,
	},
	rocket: {
		type: String,
		required: true,
	},
	target: {
		type: String
	},
	customers: [String],
	upcoming: {
		type: Boolean,
		required: true,
	},
	success: {
		type: Boolean,
		required: true,
		default: true
	},
});

module.exports = mongoos.model('Launch', launchesSchema);
