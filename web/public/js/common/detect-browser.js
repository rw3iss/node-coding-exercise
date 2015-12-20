define([],
	function($) {

		var Browser = {};

		var isUA = function(str){
			return navigator.userAgent.indexOf(str) === -1 ? false : true;
		};

		var matchUA = function(str){
			return navigator.userAgent.match(str);
		};

		Browser.getAndroidVersion = function() {
			var match = matchUA(/Android\s([0-9\.]*)/);
			return match ? match[1] : -1;
		};

		Browser.getIOSVersion = function() {

			if (/iP(hone|od|ad)/.test(navigator.userAgent)) {
				var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
				return parseInt(v[1], 10) + '.' + parseInt(v[2], 10) + '.' + parseInt(v[3] || 0, 10);
			}

			return -1;
		}

		Browser._determineIEVersion = function() {

			var ua = window.navigator.userAgent;
			var msie = ua.indexOf("MSIE ");

			if (msie > 0 === true || !!matchUA(/Trident.*rv\:11\./)) {
				return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
			}

			return -1;
		};


		Browser._determineIOSVersion = function() {

			var ua = window.navigator.userAgent;
			var start = ua.indexOf( 'OS ' );

			if ( /iPhone|iPod|iPad/.test( ua ) && start > -1 ) {
				return window.Number( ua.substr( start + 3, 3 ).replace( '_', '.' ) );
			} else {
				return false;
			}
		};


		Browser.isMOBILE = isUA('Mobile') || isUA('Tablet');
		Browser.isIPHONE = isUA('iPhone') || isUA('iPod');
		Browser.isIPAD = isUA('iPad');

		if (Browser.isIPAD) {
			Browser.isIPHONE = false;
		}

		Browser.isIOS = Browser.isIPHONE || Browser.isIPAD;
		Browser.versionIOS = Browser._determineIOSVersion();
		Browser.isFACEBOOK = isUA('FBAN\/') || isUA('FB_');
		Browser.isAPPWEBVIEW = Browser.isIOS && (isUA('CriOS') || Browser.isFACEBOOK);
		Browser.isANDROID = isUA('Android');

		Browser.isCHROME = isUA('Chrome');
		Browser.isFIREFOX = isUA('Firefox');
		Browser.isSAFARI = isUA('Safari') && Browser.isCHROME === false && Browser.isIOS === false && Modernizr.touch === false;
		Browser.isIE = (Browser._determineIEVersion() === -1) === false;

		Browser.versionIE = Browser._determineIEVersion();

		Browser.isUA = isUA;

		return Browser;
	}
);

