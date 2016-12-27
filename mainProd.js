var app = require('./app');

var port = process.env.PORT || 5000;

var server = app.listen(port, function () {
  console.log('Tunari Server is running at %s port', port);
});
