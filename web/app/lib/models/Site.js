'use strict';

class Site {
  constructor(name, timezone, useDaylightSavings) {
    this._name = name || "New Site";
    this._timezone = timezone || "Default Timezone";
    this._useDaylightSavings = useDaylightSavings || false;
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

  toJson() {
    return {
      name: this._name,
      timezone: this._timezone,
      useDaylightSavings: this._useDaylightSavings
    }
  }
}

module.exports = Site;
