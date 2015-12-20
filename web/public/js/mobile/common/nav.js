define(['jquery'
], function ($) {
	'use strict';

	var Nav = function() {

		this.setupBinds();
	};

	Nav.prototype.setupBinds = function() {
		var _this = this;

		$('#menu-cta').on('click', function(e) {
			e.preventDefault();
			$(this).toggleClass('close');
			_this.toggleMenu();
		});

	};

	Nav.prototype.toggleMenu = function() {
		$('#menu').toggleClass('active');
	};

	return Nav;

});
