var express = require('express');
var request = require('request');
var http = require('http');

var app = express();

var config = require("../../web/app/config.js")();
app.config = config;
app.container = config.container;

var Users = require(config.container.UserService)(app);

require(config.blobsWeb + '/routes/_routes.js')(app);

describe("POST /api/blob", function () {
  it("should return a new blob", function (done) {

	request({
	    url: 'http://localhost:3000/api/blob/1',
	    //qs: {t: +new Date()},
	    method: 'GET',
	    headers: { }
	}, function(error, response, body){
		console.log(response.body);

		expect(response.body).toBe('GET:blob');

	    done();
	  }, 250);  // timeout after 250 ms

  });
});   