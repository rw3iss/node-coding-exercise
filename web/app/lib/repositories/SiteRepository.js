//var promise = require('Bluebird');

module.exports = function(app) {
  const db = app.db,
      Site = app.container.Data.siteCollection;
      Days = app.container.Data.daysCollection;

  return {

    /**
     * Retrieves the metadata for the current site.
     * @return {json}     Json blob with metadata properties for this site.
     */
    getSiteData: function() {
      var p = new Promise(function(resolve, reject) {

        Site.
        resolve('getSiteData response');
      });

      return p;
    },

    /**
     * Saves the metadata for the current site.
     * @return {json}     Json blob with the success status of the request.
     */
    saveSiteData: function() {
      var p = new Promise(function(resolve, reject) {
        resolve('saveSiteData response');
      });

      return p;
    },

    /**
     * Retrieves an array of Day objects for the given from->to date range.
     * @param  {date} dateFrom   A date to start querying Days from (inclusive)
     * @param  {date} dateTo     A date to end querying Days from (inclusive)
     * @return {array}           Array of Day entries for the given date range
     */
    getDays: function(dateFrom, dateTo) {
      var p = new Promise(function(resolve, reject) {
        resolve('getDays response');
      });

      return p;
    },

    /**
     * Saves the TimeSlot entries for the given days. Any existing time entries
     * for a given date will be removed before saving new ones.
     * @param  {json} days    An array of Day objects are to be saved.
     * @return {json}         A json blob of the success status.
     */
    saveDays: function(days) {
      var p = new Promise(function(resolve, reject) {
        resolve('saveDays response');
      });

      return p;
    }
  };

};