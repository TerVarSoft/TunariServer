var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var tokenSchema = new Schema({
    value: {
        type: String
    },
    userId: {
        type: String
    }
}, { timestamps: true });

tokenSchema.index({updatedAt: 1},{expireAfterSeconds: 86400});

// the schema is useless so far
// we need to create a model using it
var Token = mongoose.model('Token', tokenSchema);

// make this available to our users in our Node applications
module.exports = Token;