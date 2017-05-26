var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
    name : {
        type: String
    },
    lastName : {
        type: String
    },
    userName : {
        type: String
    },
    password : {
        type: String
    },
    role: {
        type: String
    }    
});

userSchema.methods.removePassword = function() {
  var user = this.toObject();
  delete user.password;
  return user;
}

userSchema.methods.comparePasswords = function(password, callback) {
  bcrypt.compare(password, this.password, callback);
}

userSchema.pre('save', function(next) {
  var user = this;

  if(!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt) {
    if(err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if(err) return next(err);

      user.password = hash;
      next();
    })
  })
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;