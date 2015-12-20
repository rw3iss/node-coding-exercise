var app = require('../../web/app/middleware/appInit.js')();
var utils = require('../../web/lib/Blobs/utils.js');
var Blob = require(app.config.container.Models.Blob);
var BlobService = require(app.config.container.BlobService)(app);

describe("get a blob", function () {
  it("should be a blob", function (done) {
  	var blobSearch = "test";

    BlobService.findOne({ title: "test" })
      .then(function(result) {
        expect(result.title).toBe("A Test Blob");
      })
      .catch(function(err) {
        console.log("ERROR", err);
      })
      .finally(done);
  });

});   