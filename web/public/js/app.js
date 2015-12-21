var cl = function() {
  if(typeof console != 'undefined') {
    console.log.apply(console, arguments);
  }
}

// inherits from app_base.js
var gstv = angular.module('gstv', ['ngRoute']);

gstv
  .config(function($routeProvider, $windowProvider) {
    $routeProvider
      .when('/', { 
        templateUrl: '/partial/site',
        controller: gstv.controller.SiteController  })
      .when('/schedule', { 
        templateUrl: '/partial/schedule',
        controller: gstv.controller.ScheduleController  })
      .otherwise({ redirectTo: '/' })
  })
  .service(gstv.service)
  .controller(gstv.controller)
  .filter(gstv.filter);

// returns the day of week string for a given date input
gstv.filter('dayOfWeek', function() {
  return function(input) {
    return moment(input).format('dddd');
  }
});

// return a standard format for a given date input
gstv.filter('dateFormat', function() {
  return function(input) {
    return moment(input).format('MM/DD/YYYY');
  }
});

// controller for the main site page (home)
gstv.controller.SiteController = function($rootScope, $scope, RequestManager, $location) {
  RequestManager.request(
    '/api/site', {}, 'GET', function(response) {
      $rootScope.site = response;
    });

  angular.extend($scope, {
    isEditing: false,

    // enters edit mode for the site data
    editSite: function() {
      $scope.originalSite = angular.copy($scope.site);
      $scope.isEditing = true;
    },

    // submits the site's data to the backend
    saveSite: function() {
      $scope.isEditing = false;
      RequestManager.request(
        '/api/site', $scope.site, 'POST', function(response) {
      });
    },

    // goes to the scheduling page
    viewSchedule: function() {
      $location.path('schedule');
    }
  });

};

// controller for the scheduling page (view and edit hours)
gstv.controller.ScheduleController = function($rootScope, $scope, RequestManager, $location, $q) {
  $scope.from = moment().startOf('day');
  $scope.to = moment().startOf('day').add(7, 'days');
  $scope.originalDays = []; //for cancelling edit
  $scope.days = [];

  // grab site data if we navigated to this page first
  if($rootScope.site == null) {
    RequestManager.request(
      '/api/site', {}, 'GET', function(response) {
        $rootScope.site = response;
      });
  }

  angular.extend($scope, {
    validOpenTimes: [ '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', 
        '3:30', '4:00', '4:30', '5:00', '5:30', '6:00', '6:30', '7:00', '7:30', 
        '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30' ],
    
    validCloseTimes: [ '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30',
       '4:00', '4:30', '5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', 
       '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', 
       '12:00 (next day)', '12:30 (next day)', '1:00 (next day)', 
       '1:30 (next day)', '2:00 (next day)', '2:30 (next day)', 
       '3:00 (next day)', '3:30 (next day)', '4:00 (next day)', 
       '4:30 (next day)', '5:00 (next day)', '5:30 (next day)', 
       '6:00 (next day)'],

    isEditing: false,

    // used to confirm a loss of changes if navigating away
    hasEdits: false,

    checkFutureDate: function() {
      if(!$scope.futureDate) {
        alert('Unable to retrieve date: Please enter a date');
        return;
      }

      var date = moment($scope.futureDate, 'MM/DD/YYYY hh:mm a');

      if(!date.isValid()) {
        alert('Unable to retrieve date: Please enter a valid date in the form: mm/dd/yyyy hh:mm a');
        return;
      }

      $scope.checkOpenAt(date).then(function(result) {
        $scope.futureStatus = (result == true ? 'OPEN' : 'CLOSED');
      });
    },

    futureDate: '12/23/2015 3:00 pm',

    // goes back to the main site page
    returnToSite: function() {
      if($scope.hasEdits) {
        if(confirm('You had made edits to this week. Leaving without ' +
          'submitting will lose any changes. Continue?')) {
          $location.path('/');
        }
      } else {
        $location.path('/');
      }
    },

    // sets the schedule view to edit mode
    editSiteHours: function() {
      $scope.isEditing = true;
    },

    // gets all day data between the given from and to period
    getSiteHours: function(from, to) {
      return RequestManager.request(
        '/api/days', { 
          from: from.format('MM/DD/YYYY'), 
          to: to.format('MM/DD/YYYY')
        }, 'GET');
    },

    // save the current week's time entries
    saveSiteHours: function() {
      if(!$scope.validateSave()) {
        return;
      }

      var days = $scope.days.filter(function(day) {
        if(day.data != null)
          return day;
      });

      RequestManager.request('/api/days', { days: days }, 'POST')
        .then( 
          function(response) {
            if(typeof response.data.success != 'undefined') {
              if(response.data.success == false) {
                alert(response.data.message);
              }
            }
            else {
              $scope.redrawDays($scope.from, $scope.to, response.data);

              if(days.length > 0) {
                $rootScope.site.hasHours = true;
              }
              $scope.isEditing = false;
              $scope.hasEdits = false;
              $scope.checkOpenNow();
            }
          });
    },

    // cancel all editing
    cancelSiteHours: function() {
      $scope.isEditing = false;
      $scope.hasEdits = false;
      
      $scope.from = moment().startOf('day');
      $scope.to = moment().startOf('day').add(7, 'days');
      $scope.days = $scope.originalDays;

      $scope.getSiteHours($scope.from, $scope.to);
    },

    // validates the current week's time entries before saving
    validateSave: function() {
      var isValid = true;

      $scope.days.map(function(day) {
        if(isValid == false)
          return;

        if(day.data == null)
          return;

        for(var i in day.data.timeSlots) {
          var ts = day.data.timeSlots[i];

          // if no close time
          if(ts.open != null && ts.closed == null) {
            alert('Unable to Create/Update: ' + 
              moment(day.date).format('MM/DD/YYYY') + 
              ' close time is required');
            isValid = false;
            return;
          }

          // if no open time
          if(ts.closed != null && ts.open == null) {
            alert('Unable to Create/Update: ' + 
              moment(day.date).format('MM/DD/YYYY') + 
              ' open time is required');
            isValid = false;
            return;
          }

          // if both are empty, remove the timeslot
          if(ts.open == null && ts.closed == null) {
            day.data.timeSlots.splice(i, 1);
            continue;
          }

          var tsOpen = $scope.getTimeSlotDate(day.date, ts.open, 
            ts.openPeriod);
          var tsClosed = $scope.getTimeSlotDate(day.date, ts.closed, 
            ts.closedPeriod);

          // if start time is before close time
          if(tsOpen > tsClosed) {
            alert('Unable to Create/Update: The start time must be before the end time');
            isValid = false;
            return;
          }

          //if start time is the same as the end time
          if(tsOpen.format('MM/DD/YYYY hh:mm a') == tsClosed.format('MM/DD/YYYY hh:mm a')) {
            alert('Unable to Create/Update: The start time may not be the same date as the end time');
            isValid = false;
            return;
          }
        }

        // check that no timeslots overlap any others on this day
        day.data.timeSlots.map(function(ts) {
          if(!isValid)
            return;

          var tsOpen = $scope.getTimeSlotDate(day.date, ts.open, 
            ts.openPeriod);
          var tsClosed = $scope.getTimeSlotDate(day.date, ts.closed, 
            ts.closedPeriod);
          
          day.data.timeSlots.map(function(tsCheck) {
            var tsOpenCheck = $scope.getTimeSlotDate(day.date, tsCheck.open,
              ts.openPeriod);
            var tsClosedCheck = $scope.getTimeSlotDate(day.date, 
              tsCheck.closed, ts.closedPeriod);

            if(tsOpen > tsOpenCheck && tsOpen < tsClosedCheck) {
              alert('Unable to Create/Update: there is at least one overlapping timeslot');
              isValid = false;  
            }
            if(tsClosed < tsClosedCheck && tsClosed > tsOpenCheck) {
              alert('Unable to Create/Update: there is at least one overlapping timeslot');
              isValid = false;
            }
          });
        });
      });

      return isValid;
    },

    // turns a day's timeslot entry (ie. 11:30 am) into a date
    getTimeSlotDate: function(day, time, period) {
      //check and handle (next day) string
      var m = moment(day.date);

      if(time.indexOf('(next day') > 0) {
        time = time.split(' ')[0];
        m.add(1, 'days');
      }

      return moment(m.format('MM/DD/YYYY') + ' ' + time + 
        ' ' + period, 'MM/DD/YYYY hh:mm a');
    },

    // change to the previous week
    prevWeek: function() {
      if($scope.hasEdits) {
        if(confirm('You had made edits to this week. Leaving without ' +
          'submitting will lose any changes. Continue?')) {
          $scope.hasEdits = false;
        } else {
          return;
        }
      }

      $scope.from.add(-7, 'days');
      $scope.to.add(-7, 'days');

      $scope.getSiteHours($scope.from, $scope.to).then(function(response) {
        $scope.redrawDays($scope.from, $scope.to, response.data);
      })
    },

    // change to the next week
    nextWeek: function() {
      if($scope.hasEdits) {
        if(confirm('You had made edits to this week. Leaving without ' +
          'submitting will lose any changes. Continue?')) {
          $scope.hasEdits = false;
        } else {
          return;
        }
      }

      $scope.from.add(7, 'days');
      $scope.to.add(7, 'days');

      $scope.getSiteHours($scope.from, $scope.to).then(function(response) {
        $scope.redrawDays($scope.from, $scope.to, response.data);
      })
    },

    // add a new timeslot to the given day
    addTime: function(day) {
      if(day.data == null)
        day.data = { timeSlots: [] };
      
      var time = { open: null, openPeriod: 'am', closed: null, closedPeriod: 'am' };
      day.data.timeSlots.push(time);

      $scope.hasEdits = true;
    },

    // remove the given timeslot from the given day
    removeTime: function(day, time) {
      for(var i in day.data.timeSlots) {
        var t = day.data.timeSlots[i];
        if(time == t) {
          day.data.timeSlots.splice(i, 1);
        }
      }
    },

    // setter for open24Hours, true or false
    setOpen24Hours: function(day, open24Hours) {
      if(day.data == null)
        day.data = { timeSlots: [] };
      
      day.data.open24Hours = open24Hours;
      day.data.timeSlots = [];

      // show one empty timeslot on removal, as per requirements
      if(!open24Hours) {
        day.data.timeSlots.push({open: null, openPeriod: 'am', 
          closed: null, closedPeriod: 'am'});
      }

      $scope.hasEdits = true;
    },

    // creates an array of days for the current week range,
    // associating any day data that exists for the given day
    redrawDays: function(from, to, days) {
      $scope.days = [];

      // iterate through the weeks for the current week range, and find
      // and associate matching day data for each day
      var start = angular.copy(from);

      for (var m = start; m.isBefore(to); m.add(1, 'days')) {
        // try to match saved day data with the current day
        var dayData = days.filter(function(day) {
          return moment(day.date).format('MM/DD/YYYY') == 
            m.format('MM/DD/YYYY');
        });

        if(dayData.length > 0)
          dayData = dayData[0];
        else
          dayData = null;

        var day = {
          date: angular.copy(m).toDate(),
          data: dayData
        }

        $scope.days.push(day);
      }

      $scope.originalDays = angular.copy($scope.days);
    },

    checkOpenNow: function() {
      //set default state
      $scope.openNow = false;

      $scope.checkOpenAt(moment()).then(function(result) {
        $scope.openNow = result;
      });
    },

    // checks the range of days from today-1 to today+1, in order to account 
    // for a day that might be open until 6am on the current day
    checkOpenAt: function(dateTime) { 
      var defer = $q.defer();

      //get all days within relevant range
      $scope.getSiteHours(
        moment(dateTime.format('MM/DD/YYYY'), 
          'MM/DD/YYYY').startOf('day').add(-1, 'days'), 
        moment(dateTime.format('MM/DD/YYYY'), 
          'MM/DD/YYYY').startOf('day').add(1, 'days')
      ).then(function(result) {
        const days = result.data;
        var isOpen = false,
            dayCount = 0;

        //iterate through each day's timeslots checking if any times fall 
        //within the current date/time
        days.map(function(day) {
          dayCount++;

          if(isOpen)
            return defer.resolve(isOpen);

          //if the day is today, and it's open 24 hours, we're open
          if(moment(day.date).format('MM/DD/YYYY') == dateTime.format('MM/DD/YYYY')) {
            if(day.open24Hours) {
              isOpen = true;
              return defer.resolve(isOpen);
            }
          }

          // iterate through day's timeslots to see if now falls within any
          day.timeSlots.map(function(ts) {
            var open = $scope.getTimeSlotDate(day, ts.open, ts.openPeriod);
            var closed = $scope.getTimeSlotDate(day, ts.closed, ts.closedPeriod);
            
            if(dateTime >= open && dateTime <= closed) {
              isOpen = true;
              return defer.resolve(isOpen);
            }
          });

          // went through all days without finding an open slot
          if(dayCount == days.length) {
            return defer.resolve(false);
          }
        });

      });

      return defer.promise;
    }

  });

  // get initial/current week's days
  $scope.getSiteHours($scope.from, $scope.to).then(function(response) {
    $scope.redrawDays($scope.from, $scope.to, response.data);
  })

  // run check to see if today is open
  $scope.checkOpenNow();
};

gstv.service('RequestManager', function($http) {
  return {
    request: function(url, params, method, callback) {
      var m = method.toUpperCase() || 'GET';

      var request = { url: url, method: m };

      if(method == 'GET')
        request.params = params;
      else if(method == 'POST')
        request.data = params;
      
      var r = $http(request);

      r.success(function(response) {
        if(typeof callback != 'undefined') {
          callback(response);
        } 
      });

      r.error(function(response) {
        alert('Request error: ', JSON.stringify(response));
      });

      return r;
    }
  }
});
