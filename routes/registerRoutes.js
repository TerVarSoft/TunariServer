var express = require('express');
var jwt = require('jwt-simple');

var logger = require('./../logger/logger');

var registerRouter = function(User){
  var router = express.Router();

  // Base route.
	router.route('/')
		.post(function(req, res, next) {
      var newUser = new User(req.body);

      var payload = {
        iss: req.hostname,
        sub: newUser._id
      };

      var token = jwt.encode(payload, "tunariSecret");
			newUser.save(function(err) {
				if(err) {
          logger.log('error',err);
          res.status(500).send(err);
        } else {
          res.status(201).sendWrapped({
            user: newUser.removePassword(),
            token: token
          });                
        }                                        
      });
    });
  
  return router;
}

module.exports = registerRouter;