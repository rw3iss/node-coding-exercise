'use strict';

exports.up = function(db) {
	// Association of social network profiles with a Blobs user
	db.createTable('user_network_profiles', {
	    id: { 
	    	type: 'bigserial', 
	   		unique: true,
	   		primaryKey: true
	   	},
	    user_id: {
			type: 'bigint',
	   		nutNull: true,
	   		references: 'users(id)'
	    },
	    network: 'character(32)',
	    network_profile_id: { //unique id from the network's end
			type: 'character(32)',
	   		nutNull: true
	    },
	    network_profile: 'json', //json blob of their network profile,	
	    access_token: 'text',
	    access_token_updated: 'timestamp',
	    created: 'timestamp',
	    updated: 'timestamp'
	});
	db.createIndex('user_network_profiles', 'user_id');
	db.createIndex('user_network_profiles', 'network');
	db.createIndex('user_network_profiles', 'network_profile_id');
	
};

exports.down = function(db) {
	db.dropTable('user_network_profiles');
};
