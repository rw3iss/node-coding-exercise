'use strict';
var moment = require('moment');

/**
 * This file defines the API for managing a site's schedule.
 */

module.exports = function(app) {
	const SiteService = require(app.container.Services.SiteService)(app),
				Day = require(app.container.Models.Day),
				TimeSlot = require(app.container.Models.TimeSlot);

	/**
	 * Retrieve the hours for a given date period. Expect GET parameters
	 * 'to' and 'from' to define the date range.
	 * @return {array}			Array of Day entries for the given date range.
	 */
	app.get('/api/days', function(req, res){
		var from = req.query.from,
				to = req.query.to;

		// validate input parameters
		if (typeof from == 'undefined') {
			var response = { success: false, message: 'from parameter is missing' };
			res.send(JSON.stringify(response));
			return;
		}

		if(typeof to == 'undefined') {
			var response = { success: false, message: 'to parameter is missing' };
			res.send(JSON.stringify(response));
			return;
		}

		from = moment(from, 'MM/DD/YYYY');
		to = moment(to, 'MM/DD/YYYY');

		if(!from.isValid()) {
			var response = { success: false, message: 'from parameter is not ' +
				'a valid date' };
			res.send(JSON.stringify(response));
			return;
		}

		if(!to.isValid()) {
			var response = { success: false, message: 'to parameter is not ' +
				'a valid date' };
			res.send(JSON.stringify(response));
			return;
		}
		
		SiteService.getDays(from.toDate(), to.toDate())
			.then(function(result) {
				res.send(JSON.stringify(result));
			})
	});

	/**
	 * Saves the given time entries for an array of dates.
	 * @return {json}			Success status for the given save operation.
	 */
	app.post('/api/days', function(req, res) {
		var isValid = true;
		var error = null;

		// iterate through submitted days and validate basic entry data,
		// returning hydrated Day objects for any days that pass
		var daysToEdit = req.body.days.map(function(d) {
			var date;

			if(!isValid)
				return;

			// only submit days with a data entry
			if(d.data != null) {
				// check if any timeslots don't have complete data
				if (d.date == null) {
					isValid = false;
					error = 'Unable to Create/Update: Date is required.';
					return;
				}

				date = moment(d.date);

				if(!date.isValid()) {
					isValid = false;
					error = 'Unable to Create/Update: Date ' + d.date + ' does not ' +
						'match the expected format.';
					return;
				}

    		// turns a day's timeslot entry (ie. 11:30 am) into a date
		    function timeSlotToDate(day, time, period) {
		      //check and handle (next day) string
		      var m = moment(day.date);

		      if(time.indexOf('(next day') > 0) {
		        time = time.split(' ')[0];
		        m.add(1, 'days');
		      }

		      return moment(m.format('MM/DD/YYYY') + ' ' + time + 
		        ' ' + period, 'MM/DD/YYYY hh:mm a');
		    };

		    // iterate through the day's timeslots, validating input
				var timeSlots = d.data.timeSlots.map(function(t) {
					var tsOpen,
							tsClosed;

					if (!isValid)
						return;

					// check if any timeslots don't have complete data
					if (t.open == null || t.openPeriod == null) {
						isValid = false;
						error = 'Unable to Create/Update: Open time is required.';
						return;
					}

					if (t.closed == null || t.closedPeriod == null) {
						isValid = false;
						error = 'Unable to Create/Update: Closed time is required.';
						return;
					}

          tsOpen = timeSlotToDate(d.date, t.open, t.openPeriod);
          tsClosed = timeSlotToDate(d.date, t.closed, t.closedPeriod);

          if(!tsOpen.isValid()) {
						isValid = false;
						error = 'Unable to Create/Update: Open time does not ' +
							'match the expected format.';
						return;
					}

          if (!tsClosed.isValid()) {
						isValid = false;
						error = 'Unable to Create/Update: Closed time does not ' +
							'match the expected format.';
						return;
					}

          // check if start time is before close time
          if (tsOpen > tsClosed) {
						isValid = false;
						error = 'Unable to Create/Update: The start time must be before ' +
							'the end time.'
						return;
          }

          // checkif start time is the same as the end time
          if (tsOpen.format('MM/DD/YYYY hh:mm a') == 
          	tsClosed.format('MM/DD/YYYY hh:mm a')) {
            isValid = false;
            error = 'Unable to Create/Update: The start time may not be the ' +
            	'same date as the end time';
            return;
          }

          // timeslot is valid
					return new TimeSlot(t.open, t.openPeriod, t.closed, t.closedPeriod);
				});

				// 'hydrate' a Day object now that all data is valid
				var day = new Day(d.data.id, date.toDate(), d.data.open24Hours, 
					timeSlots);

				return day;
			}
		});

		// if no days came through, there was some unknown error
		if (daysToEdit.length == 0) {
        isValid = false;
        error = 'Unable to Update: No valid data was sent';
        return;
		}

		// compares two days, checking for any changes in their properties
		function isDayChanged(day, otherDay) {
			if(day.open24Hours != otherDay.open24Hours) {
				return true;
			}

			// iterate through each timeslot, trying to find a match in the other day
			for(var i in day.timeSlots) {
				const ts = day.timeSlots[i];
				var foundSame = false;

				for(var j in otherDay.timeSlots) {
					const ts2 = otherDay.timeSlots[j];

					if(ts.open == ts2.open && ts.openPeriod == ts2.openPeriod
						&& ts.closed == ts2.closed && ts2.closedPeriod == 
						ts2.closedPeriod) {
						foundSame = true;
						break;
					}
				}

				if(!foundSame) {
					return true;
				}
			}
		}

		// queries the server to see if any days exist which have the same 
		// date as the given new day
		function checkDuplicates(day) {
			return new Promise(function(resolve, reject) {
				SiteService.getDays(day.date, day.date).then(function(result) {
					if(result.length > 0) {
						if(moment(day.date).format('MM/DD/YYYY') == 
							moment(result.date).format('MM/DD/YYYY'))
							return resolve(true);
					}

					return resolve(false);
				});
			});
		}

		// called after all validations have been completed
		function submitAfterValidate() {
			if(!isValid) {
				var result = { success: false, message: error };
				return res.send(JSON.stringify(result));
			} 
			else {
				if(!dayChanged) {
					// Data was valid, but nothing was changed
					var result = { success: false, message: 'Unable to Update: No days '+
						'have been changed.' };
					return res.send(JSON.stringify(result));
				}

				// Everything was okay, so save the days!
				SiteService.saveDays(daysToEdit)
					.then(function(result) {
						// return the updates so the frontend can track new objects
						res.send(JSON.stringify(result));
					});
			}
		}

		// do final validations for the days that we're submitting

		var dayCount = 0;
		var dayChanged = false;

		daysToEdit.map(function(day) {
			if(dayChanged) {
				return submitAfterValidate();
			}

			if(typeof day.id != 'undefined') {
				// If an id is provided, check that there is at least one change
				SiteService.getDay(day.id).then(function(result) {
					dayCount++;

					if(isDayChanged(day, result)) {
						dayChanged = true;
					}

					// submit after iterating through all days
					if(dayCount == daysToEdit.length) {
						return submitAfterValidate();
					}
				});
			} 
			else {
				// if id is empty, it's a new day, so check if there are duplicates
				checkDuplicates(day).then(function(result) {
					dayCount++;

				 	if(result != true) {
				 		// no duplicate found, day is new
						dayChanged = true;
				 	} 
				 	else {
				 		// found a duplicate, somehow
		        isValid = false;
		        error = 'Unable to Create/Update: Day ' + day.date + ' already ' +
		        	'exists.';
		        return submitAfterValidate();
				 	}

					// submit after iterating through all days
					if(dayCount == daysToEdit.length) {
						return submitAfterValidate();
					}
				});
			}
		});
	});
};