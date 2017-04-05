const assert = require('assert');
const Downloader = require('./download');
var express = require('express');
var bodyParser = require('body-parser');

module.exports = function(config) {
  this.initServer = function() {
    var downloader = new Downloader(config);
    console.log("Initiating service");
    var service = express();
    service.use(bodyParser.json());
    
    service.post('/download', function(req, res) {
      var msg = req.body;
      downloader.getFile(msg.url, function(err, path) {
        if (err) throw err;
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
          'path': path
        }));
      });
    });
    service.listen(config.server.port);
    console.log('Server started on port ' + config.server.port);
  }
}
