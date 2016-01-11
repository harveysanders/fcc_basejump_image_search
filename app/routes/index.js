'use strict';

var path = process.cwd();
var queryHandler = require(path + '/app/controllers/queryHandler.server.js');

var queryHandler = queryHandler();

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/api/imagesearch/:query')
		.get(queryHandler.imageSearch);

	app.route('/api/latest/imagesearch/')
		.get(queryHandler.getLatestQueries);

};
