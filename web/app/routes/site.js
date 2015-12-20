//Home page

module.exports = function(app) {
  const SiteService = require(app.container.Services.SiteService)(app);

  // Main site index view+edit page
	app.get('/', function(req, res) {
    SiteService.getSiteData().then(function(site) {
      console.log("render site", site);

      res.render('site', site.toJson());
    });
	});

};