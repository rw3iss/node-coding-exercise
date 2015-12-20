'use strict';

exports.up = function(db) {

/*
	Creates tables:
	users
	user_profiles
	blobs
	blob_entries
	blob_entry_types
	blob_entry_attachments
	blob_entry_attachment_types
	blob_entry_attributes
	blob_entry_attribute_types
*/

	//Users table
	db.createTable('users', {
	    id: { 
	    	type: 'bigserial', 
	   		unique: true,
	   		primaryKey: true
	   	},
	    username: 'character(32)',
	    password: 'character(32)',
	    email: 'character(128)',
	    created: 'timestamp',
	    updated: 'timestamp'
	});
	db.createIndex('users', 'username');

	//User Profiles table
	db.createTable('user_profiles', {
	    id: { 
	    	type: 'bigserial', 
	   		unique: true,
	   		primaryKey: true
	   	},
	   	user_id: {
	   		type: 'bigint',
	   		unique: true,
	   		references: 'users(id)'
	   	},
	   	updated: 'timestamp'
	});
	db.createIndex('user_profiles', 'user_id');

	//Blobs table
	db.createTable('blobs', {
		id: {
			type: 'bigserial',
	   		unique: true,
	   		primaryKey: true
		},
		author_id: {
			type: 'bigint',
	   		nutNull: true,
	   		references: 'users(id)'
	   	},
		uri: 'character(256)',
		title: 'character(256)',
		description: 'character(1024)',
		tags: 'character(1024)',
		created: 'timestamp',
		updated: 'timestamp'
	});
	db.createIndex('blobs', 'author_id');
	db.createIndex('blobs', 'uri');

	//Blob Entry Content Types table
	db.createTable('blob_entry_types', {
		id: {
			type: 'bigserial',
	   		unique: true,
	   		primaryKey: true
		},
		type_name: 'character(32)',
		author_id: {
			type: 'bigint',
	   		nutNull: true,
	   		references: 'users(id)'
	    }
	});

	//Blob Entries table
	db.createTable('blob_entries', {
		id: {
			type: 'bigserial',
	   		unique: true,
	   		primaryKey: true
		},
		blob_id: {
	   		type: 'bigint',
	   		nutNull: true,
	   		references: 'blobs(id)'
	   	},
	   	type_id: {
	   		type: 'bigint',
	   		nutNull: true,
	   		references: 'blob_entry_types(id)'
	   	},
		author_id: {
			type: 'bigint',
	   		nutNull: true,
	   		references: 'users(id)'
	   	},
		title: 'character(256)',
		description: 'character(1024)',
		content: 'text',
		created: 'timestamp',
		updated: 'timestamp'
	});
	db.createIndex('blob_entries', 'blob_id');
	db.createIndex('blob_entries', 'author_id');

	//Blob Entry Attachment Types table
	db.createTable('blob_entry_attachment_types', {
		id: {
			type: 'bigserial',
	   		unique: true,
	   		primaryKey: true
		},
		type_name: 'character(128)'
	});

	//Blob Entry Attachments table
	db.createTable('blob_entry_attachments', {
		id: {
			type: 'bigserial',
	   		unique: true,
	   		primaryKey: true
		},
		blob_id: {
			type: 'bigserial',
	   		nutNull: true,
	   		references: 'blob_entries(id)'
	    },
		author_id: {
			type: 'bigint',
	   		nutNull: true,
	   		references: 'users(id)'
	    },
		attachment_type_id: {
			type: 'int',
	   		nutNull: true,
	   		references: 'blob_entry_attachment_types(id)'
	   	},
		name: 'character(256)',
		description: 'character(1024)',
		created: 'timestamp',
		updated: 'timestamp'
	});
	db.createIndex('blob_entry_attachments', 'blob_id');
	db.createIndex('blob_entry_attachments', 'author_id');

	//Blob Entry Attribute Types table
	db.createTable('blob_entry_attribute_types', {
		id: {
			type: 'bigserial',
	   		unique: true,
	   		primaryKey: true
		},
		type_name: 'character(128)',
		data_type: 'character(32)'
	});

	//Blob Entry Attributes table
	db.createTable('blob_entry_attributes', {
		id: {
			type: 'bigserial',
	   		unique: true,
	   		primaryKey: true
		},
		blob_entry_id: {
			type: 'bigint',
	   		nutNull: true,
	   		references: 'blob_entries(id)'
	   	},
		author_id: {
			type: 'bigint',
	   		nutNull: true,
	   		references: 'users(id)'
	    },
		name: 'character(128)',
		type_id: {
			type: 'bigint',
	   		nutNull: true,
	   		references: 'blob_entry_attribute_types(id)'
	    }
	});
	db.createIndex('blob_entry_attributes', 'blob_entry_id');
	db.createIndex('blob_entry_attributes', 'author_id');

};

exports.down = function(db) {
	/*
  	db.removeForeignKey('blob_entry_attributes', 'blob_entry_attribute_types');
  	db.removeForeignKey('blob_entry_attachments', 'blob_entry_attachment_entry_id_fk');
  	db.removeForeignKey('blob_entry_attachments', 'blob_entry_attachment_type_id_fk');
  	db.removeForeignKey('blob_entry_types', 'blob_entry_type_user_id_fk');
  	db.removeForeignKey('blob_entries', 'blob_entry_type_id_fk');
  	db.removeForeignKey('blob_entries', 'blob_entry_blob_id_fk');
  	*/

	db.dropTable('blob_entry_attributes');
	db.dropTable('blob_entry_attribute_types');
	db.dropTable('blob_entry_attachments');
	db.dropTable('blob_entry_attachment_types');
	db.dropTable('blob_entries');
	db.dropTable('blob_entry_types');
	db.dropTable('blobs');
	db.dropTable('user_profiles');
	db.dropTable('users');
};
