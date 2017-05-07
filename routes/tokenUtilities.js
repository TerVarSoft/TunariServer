var jwt = require('jwt-simple');

var createSendToken = function(user, res) {
  var payload = {    
    sub: user._id
  };
  
  var token = jwt.encode(payload, process.env.TUNARI_SECRET);

  res.status(200).sendWrapped({
    user: user.removePassword(),
    token: token
  });                  
};

module.exports.createSendToken = createSendToken;