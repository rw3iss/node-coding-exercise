/*global define*/

/*
define([
], function ($) {
	'use strict';
*/

	var bindOnce = (function() {
	    var cache = {}
	    return function(view) {
	        if (!cache[view.toString()]) {
	            cache[view.toString()] = true
	            return view()
	        }
	        else return {subtree: "retain"}
	    };
	}());


/* todo: make global caching mechanism */
var viewCache = function() {
	var cache = {};

	this.set = function(viewName, view) {
		cache[viewName] = view;
	};

	this.get = function(viewName) {
		console.log("get view", viewName, cache[viewName]);

		if(typeof cache[viewName] != 'undefined')
			return cache[viewName];
		return null;
	};

	return this;
}();

//main mithril app
var App = {
	controller: function() {
		console.log("App.controller");
		this.onunload = function() {
			console.log("App.controller unload");
		};

		this.config = function() {
			console.log("App.controller.config");
		};
	},

	config: function() {
		console.log("App.config");
	},

	view: function(ctrl) {
		console.log("App.view");

		this.config = function() {
			console.log("App.view.config");
		};

		//return m("div", loginWidget());
	}
};


	var lazyRoute = function(routeName) {
		return {
			controller: function() {
				console.log("lazyRoute controller", routeName);

				//not sure of the propery way to architect this
				var routePromise = routeLoader.load(routeName);
				routePromise.then(function(routeModule) {
					console.log("routeModule", routeModule);
					this.routeModule = routeModule;
					m.redraw(); //?
				});
			},

			view: function() {
				console.log("lazyRoute view", routeName);

				//not sure of the propery way to architect this
				var routePromise = routeLoader.load(routeName);
				routePromise.then(function(routeModule) {
					console.log("routeModule", routeModule);
					this.routeModule = routeModule;
					m.redraw(); //?
				});
			}
		};
	};

	//Global route loader helper with cache capability.
	//The route loader should fetch a given route's module. It should return a promise that the calling code 
	//can rely on to initialize an asynchronous response. 
	//INCOMPLETE
	var routeLoader = function() {
		var cache = {};

		//fetch and load a given route
		this.load = function(routeName) {
			if(typeof cache[routeName] != 'undefined') {
				//loadSelf is a stub that a route/page file should use to show itself
				//<< ANY BETTER WAY? >>
				console.log("Cache has route", routeName, cache[routeName]);
				return cache[routeName];//then(function());
			} else {
				console.log("Fetching route...", routeName);
				//route result not in cache so request it from the server:
				
				//<< not sure of the proper way to architect this... return a promise and have the client always call .then()? >>
				var routePromise = m.request({ method: "GET", url: "/partial/login" });
				cache[routeName] = routePromise;
			}
		};

		return this;
	}();


	var homePage = {
	    controller: function() {
	        return { 
	        	test: 'home page!', 
	        	goToLogin: function() { m.route("/login"); },
	        	goToOther: function() { m.route("/other"); }
	        };
	    },
	    view: function(controller) {
	        return m("div", [
	        		m("div", controller.test),
	        		m("button", { onclick: controller.goToLogin }, "Go to login"),
	        		m("br"),
	        		m("button", { onclick: controller.goToOther }, "Go to other")
	        	]);
	    }
	};


	var loginPage = {
	    controller: function() {
	    	console.log("loginPage.controller");
	    },
	    view: function(controller) {
	    	console.log("loginPage.view");
	        return [
	        	m("div", "Login page script..."),
	        	m("div", { id: "login-mount" }, "(login-mount)"),
	        	bindOnce( function() {
	        		return m("script", { type: "text/javascript", src: "/js/pages/login.js" });
	        	})
	        ];
	    }
	};


	//m.mount(document.body, App)

	m.route(document.body, "/", {
	    "/": homePage,
	    "/login": loginPage, //routeLoader.load('login'),
	    "/other": lazyRoute("other") //routeLoader.load('login'),
	});

	m.route.mode = "pathname";


/*
	return App;
});
*/