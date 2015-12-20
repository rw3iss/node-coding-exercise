'use strict';

class TimeSlot {
  constructor (open, closed) {
    this._open = open || null;
    this._closed = closed || null;
  }

  get open() {
    return this._open;
  }

  get closed() {
    return this._closed;
  }

}

module.exports = TimeSlot;
