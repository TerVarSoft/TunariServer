var express = require('express');

var logger = require('./../logger/logger');
var tokenUtilities = require('./tokenUtilities');

var registerRouter = function(User){
  var router = express.Router();

  // Base route.
	router.route('/')
		.post(function(req, res, next) {
      var newUser = new User(req.body);

			newUser.save(function(err) {
        if(err) {
          logger.log('error',err);
          return res.status(500).send(err);
        } 

        tokenUtilities.createSendToken(newUser, res);                                    
      });
    });
  
  return router;
}

module.exports = registerRouter;