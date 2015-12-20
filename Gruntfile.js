'use strict';

module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		config: {
			source: 'web/app',
			release: 'release',
			src: 'web/assets',
			rel: 'release/public'
		},

		express: {
	      web: {
	        options: {
	          script: 'web/app/app.js',
	        }
	      },
	    },

		watch: {
			web: {
		        files: [
		          'web/app/**/*.js'
		        ],
		        tasks: [
		          'express:web'
		        ],
		        options: {
		          nospawn: true, 
		          atBegin: true,
		        }
		      }
		},

	    parallel: {
	        web: {
		        options: {
		          stream: true
		        },
		        tasks: [
		          {
			        grunt: true,
			        args: ['watch:web']
			      }
		        ]
		    }
	    }
	});

	grunt.registerTask('start', function(target) {
		grunt.task.run([
			'parallel:web'
		]);
	});

	grunt.registerTask('default', [
		'start'
	]);
};
