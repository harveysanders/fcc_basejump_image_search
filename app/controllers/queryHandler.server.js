'use strict';

var Queries = require('../models/queries.js');
var request = require('request');

require('dotenv').load();

function useBingApi(query, page, res) {
	var q 		= encodeURIComponent(query);
	var skip 	= (page - 1) * 50 || 0;
	var acctKey = process.env.BING_API_KEY;
	var rootUri = 'https://api.datamarket.azure.com';
	var auth    = new Buffer(acctKey + ':' + acctKey).toString('base64');
	var options = {
					url: rootUri + '/Bing/Search/Image?$format=json&Query=%27' + q + '%27&$skip=' + skip,
					headers: {'Authorization' : 'Basic ' + auth}
				};

	console.log('url: ' + options.url);
	request(options, function(error, response, body) {
		if (error) {
			console.log(error);
		}
		console.log('statusCode: ' + response.statusCode);
		console.log('headers: ' + JSON.stringify(response.headers));
	 	if (!error && response.statusCode === 200) {
		    var results = JSON.parse(body);
		    var formattedResults = results.d.results.map(function(searchRes) {
		    	return {
		    		url: searchRes.MediaUrl,
					snippet: searchRes.Title,
					thumbnail: searchRes.Thumbnail.MediaUrl,
					context: searchRes.SourceUrl
		    	};
		    });
		   	res.json(formattedResults);
	  	}
	});
}

function queryHandler() {
	return {
		imageSearch: function(req, res) {

			var query = req.params.query;
			var page = req.query.offset;

			useBingApi(query, page, res);

			//keep record of searches
			var newQuery = new Queries({
				queryTerm: query,
				date: Date.now()
			});

			newQuery.save(function (err, newQuery, numAffected) {
				if (err) throw err;
				console.log(newQuery.queryTerm + ' searched at ' + newQuery.date);
				// res.send(newQuery);
			});
		},

		getLatestQueries: function(req, res) {

			Queries
				.find({})
				.sort({'date': -1}) //newest first
				.limit(10)
				.exec( function(err, queries) {
					if (err) res.send(err);
					//could just res.json(queries), but wanted to use example project's keys. Also shows you can choose what to show the client out of your db documents.
					res.json(queries.map(function(query) {
						return {
							term: query.queryTerm,
							when: query.date
						};
					}));		
				});
		}
	};
}

module.exports = queryHandler;