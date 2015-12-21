'use strict';
var TimeSlot = require('./TimeSlot');

class Day {
  constructor (id, date, open24Hours, timeSlots) {
    this._id = id;
    this._date = date;
    this._open24Hours = open24Hours || false;
    this._timeSlots = [];

    if(typeof timeSlots != 'undefined') {
      for(let t of timeSlots) {
        var ts = new TimeSlot(t.open, t.openPeriod, t.closed, t.closedPeriod);
        this._timeSlots.push(ts);
      }
    }
  }

  get id() {
    return this._id;
  }

  set id(id) {
    return this._id = id;
  }

  get date() {
    return this._date;
  }

  get open24Hours() {
    return this._open24Hours;
  }

  get timeSlots() {
    return this._timeSlots;
  }

  toJson() {
    try {
      var times = this._timeSlots.map(function(t) {
        return t.toJson();
      })

      return {
        id: this._id,
        date: this._date,
        open24Hours: this._open24Hours,
        timeSlots: times
      }
    } catch (ex) {
      console.log(ex);
    }
  }
}

module.exports = Day;