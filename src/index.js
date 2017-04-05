(function() {
  const fs = require('fs');
  var App = require('./app');

  const configContent = fs.readFileSync("./config.json");
  const config = JSON.parse(configContent);
  var app = new App(config);
  app.initServer();
})();
