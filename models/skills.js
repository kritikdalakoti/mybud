const mongoose = require('mongoose');

const SkillsSchema = new mongoose.Schema({
	skills: {
		type: [String],
	},
});

module.exports = mongoose.model('Skills', SkillsSchema);
