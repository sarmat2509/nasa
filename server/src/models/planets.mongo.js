const mongoos = require('mongoose');

const planetsSchema = new mongoos.Schema({
	keplerName: {
		type: Object,
		required: true
	},
});

module.exports = mongoos.model('Planet', planetsSchema);
