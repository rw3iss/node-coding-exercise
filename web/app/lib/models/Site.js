'use strict';

class Site {
  constructor(id, name, timezone, useDaylightSavings) {
    this._id = id;
    this._name = name || "New Site";
    this._timezone = timezone || "Default Timezone";
    this._useDaylightSavings = useDaylightSavings || false;
    this._hasHours = false;
  }

  get id() {
    return this._id;
  }

  set id(id) {
    return this._id = id;
  }

  get name() {
    return this._name;
  }

  get timezone() {
    return this._timezone;
  }

  get useDaylightSavings() {
    return this._useDaylightSavings;
  }

  get hasHours() {
    return this._hasHours;
  }

  set hasHours(hasHours) {
    return this._hasHours = hasHours;
  }

  toJson() {
    return {
      id: this._id,
      name: this._name,
      timezone: this._timezone,
      useDaylightSavings: this._useDaylightSavings,
      hasHours: this._hasHours
    }
  }
}

module.exports = Site;
