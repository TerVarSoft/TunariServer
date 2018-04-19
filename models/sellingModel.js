var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var sellingSchema = new Schema({
    productName: {
        type: String
    },
    productId: {
        type: String
    },
    productType: {
        type: String
    },
    quantity: {
        type: Number
    },
    price: {
        type: Number
    },
    quantityForPrice: {
        type: Number
    },
    buyingPrice: {
        type: Number
    },
    revenue: {
        type: Number
    },
    percentage: {
        type: Number
    },
    total: {
        type: Number
    }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Selling = mongoose.model('Selling', sellingSchema);

// make this available to our users in our Node applications
module.exports = Selling;