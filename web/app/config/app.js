//Globa app config and initialization

// Store a global reference to the application's /app directory
global.__app = __dirname + '/../';

module.exports = {

	// HTTP server port to listen on
	appPort: 3000,

	// Database configuration
	database: {
		connectionString: 'mongodb://localhost/gstv'
	},

	container: {
		// Data: MongoDB collection references for site data
		Data: {
			siteCollection: null,
			daysCollection: null
		},

		// Services: client-facing interfaces for site data
		Services: {
			SiteService: __app + 'lib/services/SiteService.js',
		},

		// Repositories: MongoDB interface for site data
		Repositories: {
			SiteRepository: __app + 'lib/repositories/SiteRepository.js',
		},
		
		// Models: representations of the app data objects (DTOs)
		Models: {
			Site: __app + 'lib/models/Site.js',
			Day: __app + 'lib/models/Day.js',
			TimeSlot: __app + 'lib/models/TimeSlot.js'
		}
	}
	
};
