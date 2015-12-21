'use strict';
var mongodb = require('mongodb');
var moment = require('moment');

/**
 * This file defines the backend data service for submitting changes to the 
 * site data and its schedule.
 */

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
				// this method resolves the getSiteData request, after it has set
				// a flag whether or not the existing site has any hour entries
				function resolveAfterHours(site) {
					DaysCollection.count(function(err, count) {
						if(err) return reject(err);

						if(count == 0)
							site.hasHours = false;
						else
							site.hasHours = true;

						return resolve(site);
		      });
				};

				// try to locate the current site data
				SiteCollection.findOne({}, function(err, result) {
					if(err) return reject(err);

					// if no site data exists, we create it for a new site
					if(result == null) {
						let site = new Site();

						self.saveSiteData(site).then(function(site) {
							if(err) return reject(err);

							return resolveAfterHours(site);
						});
					}
					else {
						// 'hydrate' the existing site model data
						let site = new Site(result._id, result.name, result.timezone, 
													 result.useDaylightSavings);

						return resolveAfterHours(site);
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
				// formulate update parameters without the ID we're passing around
				var update = site.toJson();
				var mongoId = new mongodb.ObjectID(update.id);
				delete update.id;

				SiteCollection.update({ _id: mongoId }, { $set: update }, 
					{upsert: true}, function(err, result) {
					if(err) return reject(err);

					if(typeof result.result.upserted != 'undefined')
						site.id = result.result.upserted[0]._id;

					return resolve(site);
				});
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
				DaysCollection.find({
					date: {
			        $gte: dateFrom,
			        $lt: dateTo
			    }
			  }).toArray(function(err, results) {
					if(err) return reject(err);

					var days = [];
					for(let r of results) {
						let day = new Day(r._id, moment(r.date).toDate(), r.open24Hours, 
							r.timeSlots);

						days.push(day.toJson());
					}

					return resolve(days);
				});

			});
		},

		/**
		 * Retrieves a Day object based on its existing MongoDB ObjectId.
		 * @param  {date} objectId	 The ObjectID to search for
		 * @return {Day} 					 	 The day that was found, otherwise null
		 */
		getDay: function(objectId) {
			return new Promise(function(resolve, reject) {
				var mongoId = new mongodb.ObjectID(objectId);

				DaysCollection.findOne({ _id: mongoId }, function(err, r) {
					if(err) return reject(err);

					// 'hydrate' the Day model
					let day = new Day(r._id, r.date, r.open24Hours, r.timeSlots);
					
					return resolve(day);
				});
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
				var dayCount = 0;

				try {
					var updatedDays = [];

					days.map(function(day) {
						var update = day.toJson();
						var mongoId = new mongodb.ObjectID(update.id);
						delete update.id;

						DaysCollection.update({ _id: mongoId }, { $set: update }, 
							{upsert: true}, function(err, result) {
							dayCount++;
							
							if(err) return reject(err);

							if(typeof result.result.upserted != 'undefined')
								update.id = result.result.upserted[0]._id;

							updatedDays.push(update);

							if(dayCount == days.length) {
								// end of iteration
								return resolve(updatedDays);
							}
						});
					});

				} catch(ex) {
					console.log(ex);
				}

			});
		}
	};

};

module.exports = SiteService;