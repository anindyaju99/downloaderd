const assert = require('assert');
const http = require('http');
const fs = require('fs');
const UUID = require('uuid-1345');

function Downloader(config) {
  const app = this;

  this.filePathFromUrl = function(url, cb) {
    UUID.v5({
      namespace: UUID.namespace.url,
      name: url
    }, function(err, result) {
      if (result) {
        result = config.data.base + '/' + result;
      }
      cb(err, result);
    });
  }

  this.downloadNoCache = function(url, path, cb) {
    // http://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
    function wcb(err, res) {
      var data = err ? undefined : path;
      cb(err, data);
    }
    var file = fs.createWriteStream(path);
    var request = http.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(wcb);  // close() is async, call cb after close completes.
      });
    }).on('error', function(err) {
      fs.unlink(path);
      wcb(err);
    });
  }

  this.findInCache = function(url, cb) {
    app.filePathFromUrl(url, function(err, path) {
      if (err) {
        cb(err);
      } else {
        // https://nodejs.org/api/fs.html#fs_fs_access_path_mode_callback
        try {
          if (!fs.existsSync(path)) {
            throw path + ' does not exist';
          }
          console.log(path + ' exists');
          cb(err, path);
        } catch (e) {
          console.log(e);
          cb(e, path);
        }
      }
    });
  }

  this.getFile = function(url, cb) {
    // provides the file path to caller.
    app.findInCache(url, function(err, path) {
      console.log(err);
      if (!err) {
        cb(err, path);
        return;
      }

      setTimeout(function() {
        app.downloadNoCache(url, path, function(err, path) {
          cb(err, path);
        });
      }, config.download.delay);
    });
  }
}

module.exports = Downloader;
