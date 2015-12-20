var app = require('../../web/app/middleware/appInit.js')();
var utils = require('../../web/lib/Blobs/utils.js');
var Blob = require(app.config.container.Models.Blob);
var BlobService = require(app.config.container.BlobService)(app);

describe("create a blob", function () {
  it("should be a blob", function (done) {
  	var blob = new Blob();
  	blob.authorId = 1;
  	blob.name = "A Test Blob";
  	blob.description = "This is the description of the test blob";
  	blob.uri = "a-test-blob";
  	blob.tags = ['blob', 'test'];
    blob.created = blob.updated = utils.sqlDate(new Date());

    BlobService.create(blob)
      .then(function(result) {
        expect(result).toEqual(blob);
      })
      .catch(function(err) {
        console.log("ERROR", err);
      })
      .finally(done);
  });

});   