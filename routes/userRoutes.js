var express = require('express');

var logger = require('./../logger/logger');
var tokenUtilities = require('./tokenUtilities');

var userProperties = "name lastName userName role";
var needToBeAdminMessage = "Need to be admin to perform this action";

var userRouter = function(User){
  var router = express.Router();

  // Base route.
	router.route('/')
    .get(function(req, res, next) {
      if (!tokenUtilities.isAdmin(req)) {
          res.status(401).send(needToBeAdminMessage);
          return;
      }

      User.count({}, function(err, count){
        User.find({}, function(err, users) {
          if (err) {
            logger.log('error',err);
            throw err;
          }
    				
          res.status(200).sendWrapped({
            meta: {
                count: count   
            },
            items: users
          });
        })
        .sort("name")
        .select(userProperties)
      });
    })
		.post(function(req, res, next) {      
      if (!tokenUtilities.isAdmin(req)) {
          res.status(401).send(needToBeAdminMessage);
      }

      var newUser = new User(req.body);
			newUser.save(function(err) {
        if(err) {
          logger.log('error',err);
          return res.status(500).send(err);
        } 

        tokenUtilities.createSendToken(newUser, res);                                    
      });
    });    

    router.use('/:userId', function(req, res, next) {

        User.findById(req.params.userId, function(err, user){
            if(err)
                res.status(500).send(err);
            else if(user){
                req.user = user;
                next();
            }
            else{
                res.status(404).send('no user found');                
            }
        });            
    });

    router.route('/:userId')
      .delete(function(req, res) {
          if (!tokenUtilities.isAdmin(req)) {
              res.status(401).send(needToBeAdminMessage);
              return;
          }

          req.user.remove(function(err){
              if(err)
                  res.status(500).send(err);
              else{
                  res.status(204).send('Removed'); 
              }
          });
        });
  
  return router;
}

module.exports = userRouter;