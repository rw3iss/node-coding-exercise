define([
], function () {
	'use strict';

	var Analytics = function() {

		this.addListener();

	};
	Analytics.prototype.addListener = function() {
		var _this = this;

		$(document).on('click', '*[data-ga]', function(e) {
	        var location    = $( this ).attr( 'href' );
	        var category    = $.trim( $( this ).attr( 'data-ga' ).split( ',')[0] );
	        var action      = $.trim( $( this ).attr( 'data-ga' ).split( ',')[1] ) || 'click';
	        var opt_label   = $.trim( $( this ).attr( 'data-ga' ).split( ',')[2] );
	        var opt_value       = $.trim( $( this ).attr( 'data-ga' ).split( ',')[3] ) || '';
	        var target      = $( this ).attr( 'target' );
	        var isForm      = $( this ).is( 'button' );
	        var ref         = $( this );
	        var callback    = null;

        	e.preventDefault();

	        callback = function() {
	        	if(location !== '#') {
		            if (typeof(target) === 'undefined') {
		                window.location = location;
		            } else {
		                window.open(location, target);
		            }
	            }
	        };

	        _this.trackEvent(category, action, opt_label, opt_value);

	        setTimeout(callback, 150);

	        return false;
    	});
	};

	Analytics.prototype.trackPageView = function(page) {
		_gaq.push(['_trackPageview', page]);
	};

	Analytics.prototype.trackEvent = function(category, action, opt_label) {
		_gaq.push(['_trackEvent', category, action, opt_label]);
	};

	return Analytics;

});
