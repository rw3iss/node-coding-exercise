var fs = require('fs');
var path = require('path');

module.exports = function(app) {
  app.get('/partial/:name', function(req, res){
    try {
      res.render('partials/' + req.params.name);
    } catch(e) {
      res.render('error', { error: 'Page not found' });
    }
  });
};