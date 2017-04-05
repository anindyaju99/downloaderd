(function() {
  var App = require('./app');
  var app = new App({
            server: {
              port: 8888
            },
            db: {
              url: 'mongodb://localhost:27017/tcon',
              collection: 'cached'
            },
            data: {
              base: '/data/cache-d'
            },
            download: {
              delay: 100 // ms
            }
          });
  app.initServer();
})();
