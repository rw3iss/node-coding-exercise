'use strict';

class Day {
  constructor (date, open24Hours) {
    this._date = date;
    this._isOpen24Hours = open24Hours || false;
    this._timeSlots = [];
  }

  get date() {
    return this._date;
  }

  get isOpen24Hours() {
    return this._isOpen24Hours;
  }

  get timeSlots() {
    return this._timeSlots;
  }

}

module.exports = Day;