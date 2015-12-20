'use strict';

exports.up = function(db) {

	// Insert some basic data -------------

	//create a 'SYSTEM' user:
	db.sql("insert into users (username) values ('SYSTEM')");

	//create basic admin user:
	db.sql("insert into users (username, password, email, created, updated) values " +
			"('{username}', '{password}', '{email}', {created}, {updated})", {
				username: 'rw3iss', password: 'qazokm', email: 'rw3iss@gmail.com', created: 'NOW()', updated: 'NOW()'
			});

	//create basic content types:
	db.sql("insert into blob_entry_types (type_name, author_id) values ('string', (select id from users where username='SYSTEM'))");
	db.sql("insert into blob_entry_types (type_name, author_id) values ('image', (select id from users where username='SYSTEM'))");
	db.sql("insert into blob_entry_types (type_name, author_id) values ('audio', (select id from users where username='SYSTEM'))");
	db.sql("insert into blob_entry_types (type_name, author_id) values ('video', (select id from users where username='SYSTEM'))");
	db.sql("insert into blob_entry_types (type_name, author_id) values ('rich', (select id from users where username='SYSTEM'))");

	//create basic blob attachment types:
	db.sql("insert into blob_entry_attachment_types (type_name) values ('image')");
	db.sql("insert into blob_entry_attachment_types (type_name) values ('audio')");
	db.sql("insert into blob_entry_attachment_types (type_name) values ('video')");
	db.sql("insert into blob_entry_attachment_types (type_name) values ('pagelink')");

	//create basic blob attribute types:
	db.sql("insert into blob_entry_attribute_types (type_name) values ('string')");
	db.sql("insert into blob_entry_attribute_types (type_name) values ('number')");
	db.sql("insert into blob_entry_attribute_types (type_name) values ('image')");
	db.sql("insert into blob_entry_attribute_types (type_name) values ('date')");
};

exports.down = function(db) {
	db.sql('delete from blob_entry_attribute_types');
	db.sql('delete from blob_entry_attributes');
	db.sql('delete from blob_entry_attachment_types');
	db.sql('delete from blob_entry_attachments');
	db.sql('delete from blob_entry_types');
	db.sql('delete from blob_entries');
	db.sql('delete from blobs');
	db.sql('delete from user_profiles');
	db.sql('delete from users');
};
