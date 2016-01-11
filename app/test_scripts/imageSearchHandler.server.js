'use strict';
var rest = require('rest');
require('dotenv').load();

// https://pixabay.com/api/docs/
function searchPixabay(query, res) {
	var q = encodeURIComponent(query);
	var apiKey = process.env.PIXABAY_API_KEY;
	var apiUrl = 'https://pixabay.com/api/?key=' + apiKey + '&q=' + q; 
	
	rest(apiUrl).then(function(response) {
		console.log(response.toString());
	});
}

function imageSearchHandler() {
	return {
		getImages: function(req, res) {
			searchPixabay(req.params.query, res);
		}	
	};
}

module.exports = imageSearchHandler;