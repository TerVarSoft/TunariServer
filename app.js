
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');

// Mongo 
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect(process.env.TUNARI_DB);

express.response.sendWrapped = function(obj) {
    return this.send({ 
      version: 'v1.0',
      data: obj 
    });
};

var app = express();

// Mongoose models
var Product = require('./models/productModel');
var SellingItem = require('./models/sellingItemModel');
var Selling = require('./models/sellingModel');
var Client = require('./models/clientModel');
var Setting = require('./models/settingModel');
var User = require('./models/userModel');

// Routers
var userRouter = require('./routes/userRoutes')(User);
var loginRouter = require('./routes/loginRoutes')(User);
var configRouter = require('./routes/configRoutes')(Setting);
var productRouter = require('./routes/productRoutes')(Product);
var sellingItemRouter = require('./routes/sellingItemRoutes')(SellingItem);
var sellingRouter = require('./routes/sellingRoutes')(Selling);
var clientRouter = require('./routes/clientRoutes')(Client);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
     if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.get('/', function(req, res) {
    res.sendFile('./index.html',{root: __dirname });
    //res.send(process.env.TUNARI_DB || "No db connection string"); 
});

app.use('/api/login', loginRouter);

app.use(function(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send({
      message: "You are not authorized"
    })
  }
  else {      
    try {
      var token = req.headers.authorization.split(' ')[1];
      var payload = jwt.decode(token, process.env.TUNARI_SECRET);

      if(!payload.sub || !payload.sub.id || !payload.sub.role) {
        return res.status(401).send({ 
          message: "Authentication failed"
        });
      } else {
        next();
      }  
    } catch(err) {
      console.log(err);
      return res.status(401).send({ 
        message: "Authentication failed"
      });
    }       
  }  
});

app.use('/api/users', userRouter);
app.use('/api/settings', configRouter);
app.use('/api/products', productRouter);
app.use('/api/sellingItems', sellingItemRouter);
app.use('/api/sellings', sellingRouter);
app.use('/api/clients', clientRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
