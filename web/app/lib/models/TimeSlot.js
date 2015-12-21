'use strict';

class TimeSlot {
  constructor (open, openPeriod, closed, closedPeriod) {
    this._open = open || null;
    this._openPeriod = openPeriod || null;
    this._closed = closed || null;
    this._closedPeriod = closedPeriod || null;
  }

  get open() {
    return this._open;
  }  

  get openPeriod() {
    return this._openPeriod;
  }

  get closed() {
    return this._closed;
  }

  get closedPeriod() {
    return this._closedPeriod;
  }

  toJson() {
    return {
      open: this._open,
      openPeriod: this._openPeriod,
      closed: this._closed,
      closedPeriod: this._closedPeriod
    }
  }
}

module.exports = TimeSlot;
