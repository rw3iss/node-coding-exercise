var loginModule = {
	mountPoint: 'login-mount',

	controller: function() {
		console.log("remote loginModule controller");
	},

	view: function() {
		console.log("remote loginModule view");
		return m("div", "REMOTE LOGIN PAGE VIEW!");
	}
};

m.render( document.getElementById(loginModule.mountPoint), 
	loginModule );

console.log("login.js finished.", loginModule.mountPoint);
