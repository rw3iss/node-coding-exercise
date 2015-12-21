/**
 * This file defines the API for managing a site's metadata.
 */

module.exports = function(app) {
	const SiteService = require(app.container.Services.SiteService)(app),
				Site = require(app.container.Models.Site);

	app.get('/api/site', function(req, res){
		SiteService.getSiteData()
			.then(function(result) {
					res.send(JSON.stringify(result.toJson()));
			})
	});

	app.post('/api/site', function(req, res){
		// post will contain a json blob of date->hours entries array for any days that want their hours updated
		var site = new Site(req.body.id, req.body.name, req.body.timezone, req.body.useDaylightSavings);

		SiteService.saveSiteData(site)
			.then(function(result) {
				res.send("api/site save complete");
			});
	});

};