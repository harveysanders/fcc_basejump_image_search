'use strict';

var Queries = require('../models/queries.js');
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

// example latest searches = [
// 	{"term":"lolcats funny","when":"2016-01-07T22:30:56.731Z"},
// 	{"term":"lolcats funny","when":"2016-01-07T22:12:31.928Z"},
// 	{"term":"hello","when":"2016-01-07T22:03:49.566Z"},
//	{...}
// ]

function queryHandler() {
	return {
		imageSearch: function(req, res) {
			var query = req.params.query;

			//TODO: figure out search
			var newQuery = new Queries({
				queryTerm: query,
				date: Date.now()
			});

			newQuery.save(function (err, newQuery, numAffected) {
				if (err) throw err;
				res.json(newQuery);
			});
		},

		getLatestQueries: function(req, res) {

			Queries
				.find({})
				.limit(2)
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