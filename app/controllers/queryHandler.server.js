'use strict';

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
			res.send(query);
		},

		getLatestQueries: function(req, res) {
			res.send('latest search results');
		}
	};
}

module.exports = queryHandler;