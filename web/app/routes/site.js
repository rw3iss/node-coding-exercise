//Home page

module.exports = function(app) {
  const SiteService = require(app.container.Services.SiteService)(app);

  // Main site index view+edit page
	app.get('/', function(req, res) {
    res.render('index');
	});

};