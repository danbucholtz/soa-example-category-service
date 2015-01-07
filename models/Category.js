var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
	name: String,
	updated: { type: Date, default: Date.now },
	created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', CategorySchema);