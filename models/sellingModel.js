var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var sellingSchema = new Schema({
    productName: {
        type: String
    },
    productType: {
        type: String
    },
    quantity: {
        type: String
    }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Selling = mongoose.model('Selling', sellingSchema);

// make this available to our users in our Node applications
module.exports = Selling;