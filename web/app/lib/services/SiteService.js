'use strict';

function SiteService(app) {
	const db = app.db,
			SiteCollection = app.container.Data.siteCollection,	
			DaysCollection = app.container.Data.daysCollection,
			Day = require(app.container.Models.Day),
			Site = require(app.container.Models.Site);

	// SiteService interface
	return {
		/**
		 * Retrieves the metadata for the current site. If no data exists, it will
		 * be created.
		 * @return {json}			Json blob with metadata properties for this site.
		 */
		getSiteData: function() {
			const self = this;

			return new Promise(function(resolve, reject) {
				// try to locate the current site data
				SiteCollection.findOne({}, function(err, result) {
					if(err) return reject(err);

					// if no site data exists, we create it for a new site
					if(result == null) {
						let site = new Site();

						self.saveSiteData(site).then(function(err, site) {
							if(err) return reject(err);

							return resolve(site);
						});
					}
					else {
						// "hydrate" the existing site model data
						let site = new Site(result.name, result.timezone, 
													 result.useDaylightSavings);

						return resolve(site);
					}
				});
			});
		},

		/**
		 * Saves the metadata for the current site.
		 * @return {json}			Json blob with the success status of the request.
		 */
		saveSiteData: function(site) {
			return new Promise(function(resolve, reject) {
				// attempts to update the site data. If none exists, it will be created
				SiteCollection.update({ name: site.name }, { $set: site.toJson() }, 
					{upsert: true}).then(function(err, result) {
						if(err) return reject(err);

						return  resolve(site);
					})
			});
		},

		/**
		 * Retrieves an array of Day objects for the given from->to date range.
		 * @param  {date} dateFrom	 A date to start querying Days from (inclusive)
		 * @param  {date} dateTo		 A date to end querying Days from (inclusive)
		 * @return {array} 					 Array of Day entries for the given date range
		 */
		getDays: function(dateFrom, dateTo) {
			return new Promise(function(resolve, reject) {
				resolve('getDays response');
			});
		},

		/**
		 * Saves the TimeSlot entries for the given days. Any existing time entries
		 * for a given date will be removed before saving new ones.
		 * @param  {json} days 		An array of Day objects are to be saved.
		 * @return {json}       	A json blob of the success status.
		 */
		saveDays: function(days) {
			return new Promise(function(resolve, reject) {
				resolve('saveDays response');
			});
		}
	};

};

module.exports = SiteService;