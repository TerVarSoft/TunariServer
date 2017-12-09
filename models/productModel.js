var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var price = new Schema({
	type: String,
	quantity: Number,
	value: Number
});

var location = new Schema({
	type: String,
	value: String
});

// create a schema
var productSchema = new Schema({
	name: {
		type: String,
		unique: true,
		sparse: true
	},
	category: {
		type: String
	},
	sortTag: {
		type: String
	},
	tags: {
		type: [String]
	},
	images: {
		type: [String]
	},
	imageUrl : {
		type: String
	},
	thumbnailUrl : {
		type: String
	},
    quantity: {
        type: Number
    },
	quantityPerPackage: Number,
    provider: {
        type: String
    },
	isFavorite: {
		type: Boolean
	},
    locations: [location],
	clientUnitPrice: Number,
	clientPackagePrice: Number,
	publicUnitPrice: Number,
	publicPackagePrice: Number,
	buyingUnitPrice: Number,
	buyingPackagePrice: Number,
	otherPrices: [price],
	publicPrices: [price],
	clientPrices: [price],
	properties: {}
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Product = mongoose.model('Product', productSchema);

// make this available to our users in our Node applications
module.exports = Product;