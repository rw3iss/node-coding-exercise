var express = require('express');
var request = require('request');
var http = require('http');

var app = express();

var config = require("../../Blobs.Web/config.js")();
app.config = config;
app.container = config.container;

var Blobs = require(config.container.BlobService)(app);

require(config.blobsWeb + '/routes/_routes.js')(app);

describe("GET /api/blob/:id", function () {
  it("should be a blob", function (done) {

	request("http://localhost:3000/api/blob/1", function(error, response, body){
		console.log(response.body);

		expect(response.body).toBe('GET:blob');

	    done();
	  }, 250);  // timeout after 250 ms

  });
});   