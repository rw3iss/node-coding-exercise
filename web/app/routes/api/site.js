//api for site metadata

module.exports = function(app) {
	const SiteService = require(app.container.Services.SiteService)(app);

	app.get('/api/site', function(req, res){
		SiteService.getSiteData(/*siteId*/)
			.then(function(result) {
				res.send("api/site get site data");
			})
	});

	app.post('/api/site', function(req, res){
		// post will contain a json blob of date->hours entries array for any days that want their hours updated
		var siteData = {};

		SiteService.saveSiteData(/*siteId,*/siteData)
			.then(function(result) {
				res.send("api/site save complete");
			});
	});
};