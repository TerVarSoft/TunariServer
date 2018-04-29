var express = require('express');

var logger = require('./../logger/logger');
var tokenUtilities = require('./tokenUtilities');

var loginRouter = function (User) {
  var router = express.Router();

  // Base route.
  router.route('/')
    .post(function (req, res, next) {

      req.user = req.body;

      var searchUser = { userName: req.user.userName };
      User.findOne(searchUser, function (err, user) {
        if (err) throw err;

        if (!user) {
          return res.status(401).send({ message: 'Wrong email/password' });
        }

        user.comparePasswords(req.user.password, function (err, isMatch) {
          if (err) throw err;

          if (!isMatch) {
            return res.status(401).send({ message: 'Wrong email/password' });
          } else {
            tokenUtilities.createSendToken(user, res);
          }
        });
      });
    });

  return router;
}

module.exports = loginRouter;