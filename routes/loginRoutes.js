var express = require('express');
var jwt = require('jwt-simple');

var logger = require('./../logger/logger');

var loginRouter = function(User){
  var router = express.Router();

  // Base route.
	router.route('/')
		.post(function(req, res, next) {                                            

      req.user = req.body;

      User.findOne({userName: req.user.userName}, function(err, user) {
        if(err) throw err;

        user.comparePasswords(req.user.password, function(err, isMatch) {
          if(err) throw err;
        });
      });  
    });
  
  return router;
}

module.exports = loginRouter;