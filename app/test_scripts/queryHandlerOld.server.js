'use strict';

var Queries = require('../models/queries.js');
// var imageSearchHandler = require('./imageSearchHandler.server.js');
// var imageSearch = imageSearchHandler();
var rest = require('rest');
var http = require('http');
var https = require('https');

require('dotenv').load();

//Bing Search API
var acctKey = process.env.BING_API_KEY;
var rootUri = 'api.datamarket.azure.com';
var auth    = new Buffer([ acctKey, acctKey ].join(':')).toString('base64');

// imageSearch results = [
// 	{
// 		url: '...',
// 		snippet: 'lol catz breaks ...',
// 		thumbnail: '...jpg',
// 		context: 'hosting site url'
// 	},
//	{...},
//	{...}
// ]

function queryHandler() {
	return {
		imageSearch: function(req, res) {
			var query = req.params.query;

			//TODO: figure out search

			var q = encodeURIComponent(query);
			var apiKey = process.env.PIXABAY_API_KEY;
			var apiUrl = 'https://pixabay.com/api/?key=' + apiKey + '&q=' + q; 

			var options2 = {
			  host: 'pixabay.com',
			  path: '/api?key=' + apiKey + '&q=' + q,
			};

			var options = {
			  host: 'jsonplaceholder.typicode.com',
			  path: '/users'
			};

			var options3 = {
			  host: 'api.gettyimages.com',
			  path: '/v3/search/images?fields=id,title,thumb,referral_destinations&sort_order=best'
			};

			var bingOpts = {
				host: rootUri,
				headers: {'Authorization' : 'Basic ' + auth},
				path: '/Bing/Search/Image?format=json&Query=' + q
			};

			var apiReq = http.get(bingOpts, function(apiRes) {
			  console.log('STATUS: ' + apiRes.statusCode);
			  console.log('HEADERS: ' + JSON.stringify(apiRes.headers));

			  // Buffer the body entirely for processing as a whole.
			  var bodyChunks = [];
			  apiRes.on('data', function(chunk) {
			    // You can process streamed parts here...
			    bodyChunks.push(chunk);
			  }).on('end', function() {
			    var body = Buffer.concat(bodyChunks);
			    console.log('BODY: ' + body);
			    // ...and/or process the entire body buffer here.
			    res.json(JSON.parse(body.toString()));
			  });
			});

			apiReq.on('error', function(e) {
			  console.log('ERROR: ' + e.message);
			});

			//keep record of searches
			var newQuery = new Queries({
				queryTerm: query,
				date: Date.now()
			});

			newQuery.save(function (err, newQuery, numAffected) {
				if (err) throw err;
				// res.json(newQuery);
			});
		},

		getLatestQueries: function(req, res) {

			Queries
				.find({})
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