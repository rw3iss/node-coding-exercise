//api for site hours

module.exports = function(app) {
	const SiteService = require(app.container.Services.SiteService)(app);

	/**
	 * Retrieve the hours for a given date period. Expect a json post with
	 * 'to' and 'from' date entries.
	 * @return {array}			Array of Day entries for the given date range.
	 */
	app.get('/api/days', function(req, res){
		//TODO: validate the req.body to and from parameters
		var to = '', 
			from = '';
		
		SiteService.getDays(to, from)
			.then(function(result) {
				res.send("api getDays");
			})
	});

	/**
	 * Saves the given time entries for an array of dates.
	 * @return {json}			Success status for the given save operation.
	 */
	app.post('/api/days', function(req, res){
		// post will contain a json blob of Day entries that will be updated
		var days = {};

		SiteService.saveDays(days)
			.then(function(result) {
				res.send("api saveDays");
			});
	});
};