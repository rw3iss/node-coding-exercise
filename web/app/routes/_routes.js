//Contains all route definitions

module.exports = function(app) {

	// Main site view+edit page. Will allow viewing and editing of: site name, 
  // timezone, daylight savings, and Day entries
	require('./site')(app);

	// REST api to manage site metadata
	require('./api/site')(app);

	// REST api to manage site Day entries
	require('./api/days')(app);

};
