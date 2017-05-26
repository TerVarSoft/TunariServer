var jwt = require('jwt-simple');

var createSendToken = function(user, res) {
  var payload = {    
    sub: {
      id: user._id,
      role: user.role      
    } 
  };
  
  var token = jwt.encode(payload, process.env.TUNARI_SECRET);

  res.status(200).sendWrapped({
    user: user.removePassword(),
    token: token
  });                  
};

var getUserRole = function(req) {
  var public = "public";

  if(!req.headers.authorization) {
    return public;
  }
  else {      
    try {
      var token = req.headers.authorization.split(' ')[1];
      var payload = jwt.decode(token, process.env.TUNARI_SECRET);

      if(!payload.sub || !payload.sub.id || !payload.sub.role) {
        return public;
      } else {
        return payload.sub.role;        
      }  
    } catch(err) {
      console.log(err);
      return public;
    }       
  }                 
};

module.exports.createSendToken = createSendToken;
module.exports.getUserRole = getUserRole;