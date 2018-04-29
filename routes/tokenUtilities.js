var jwt = require('jwt-simple');
var moment = require('moment');
var Token = require('./../models/tokenModel');

var createSendToken = function (user, res) {
  var payload = {
    sub: {
      id: user._id,
      role: user.role
    },
    iat: moment().unix()
  };
  var tokenValue = jwt.encode(payload, process.env.TUNARI_SECRET);

  var newToken = {
    value: tokenValue,
    userId: user._id
  };
  var options = { upsert: true, new: true, setDefaultsOnInsert: true };

  Token.findOneAndUpdate({ userId: user._id }, newToken, options, function (err) {
    res.status(200).sendWrapped({
      user: user.removePassword(),
      token: tokenValue
    });
  });
};

var getUserRole = function (req) {
  var public = "public";

  if (!req.headers.authorization) {
    return public;
  }
  else {
    try {
      var token = req.headers.authorization.split(' ')[1];
      var payload = jwt.decode(token, process.env.TUNARI_SECRET);

      if (!payload.sub || !payload.sub.id || !payload.sub.role) {
        return public;
      } else {
        return payload.sub.role;
      }
    } catch (err) {
      console.log(err);
      return public;
    }
  }
};

var isAdmin = function (req) {
  var userRole = getUserRole(req);
  return userRole === "admin";
}

module.exports.createSendToken = createSendToken;
module.exports.getUserRole = getUserRole;
module.exports.isAdmin = isAdmin;