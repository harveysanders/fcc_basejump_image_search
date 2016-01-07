'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuerySchema = new Schema({
	queryTerm: String,
	date: {type: Date, defualt: Date.now }
});

module.exports = mongoose.model('Query', QuerySchema);