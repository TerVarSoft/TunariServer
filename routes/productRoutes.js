var express = require('express');
var _ = require('lodash');
var routesUtil = require('./routesUtilities');
var tokenUtilities = require('./tokenUtilities');
var productUtil = require('./productUtilities');

// Logger
var logger = require('./../logger/logger');
var elastic = require('./../logger/elasticsearch');

var publicProductProperties = "name category properties.type publicUnitPrice publicPackagePrice";
var clientProductProperties = "name category properties.type publicUnitPrice publicPackagePrice " +
    "clientUnitPrice clientPackagePrice";
var needToBeAdminMessage = "Need to be admin to perform this action";

var productRouter = function (Product) {
    var router = express.Router();

    // Base route.
    router.route('/')
        .get(function (req, res, next) {

            var query = {};
            var querySort = req.query.querySort || 'sortTag';
            var queryLimit = +req.query.queryLimit || 30;
            var page = req.query.page || 1;
            var propertiesToSelect = req.query.properties;

            var userRole = tokenUtilities.getUserRole(req);

            /** Filter properties based on user role */
            if (userRole === "public") {
                propertiesToSelect = publicProductProperties;
            } else if (userRole === "client") {
                propertiesToSelect = clientProductProperties;
            }

            query = routesUtil.buildQuery(req.query);

            Product.count(query, function (err, count) {

                Product.find(query, function (err, products) {
                    if (err) {
                        logger.log('error', err);
                        throw err;
                    }

                    res.status(200).sendWrapped({
                        meta: {
                            count: count
                        },
                        items: products
                    });
                })
                    .sort(querySort)
                    .skip(queryLimit * (page - 1))
                    .limit(queryLimit)
                    .select(propertiesToSelect)
            });
        })
        .post(function (req, res, next) {
            if (!tokenUtilities.isAdmin(req)) {
                res.status(401).send(needToBeAdminMessage);
                return;
            }

            var newProduct = new Product(req.body);
            newProduct.name = _.toUpper(newProduct.name);
            newProduct.sortTag = productUtil.getSortTag(newProduct);
            newProduct.tags = productUtil.getProductTags({}, newProduct, newProduct.tags);

            newProduct.save(function (err) {
                if (err) {
                    logger.log('error', err);

                    if (err.code = 11000) {
                        // Product name already exists
                        res.status(409).send(err);
                    }
                    else {
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(201).sendWrapped(newProduct);
                    logger.log('info',
                        'productId:' + newProduct._id + ' ' +
                        'product:' + newProduct.name + ' ' +
                        'wareHouseQuantity:' + newProduct.quantity);
                }
            });
        });

    router.route('/log')
        .get(function (req, res, next) {

            Product.find({ category: 'Invitaciones' }, function (err, products) {
                if (err) {
                    logger.log('error', err);
                    throw err;
                }
                else {

                    _.each(products, function (product) {
                        elastic.log('info', '', {
                            id: product._id,
                            tipo: product.properties.type,
                            producto: product.name,
                            etiquetaBusqueda: product.sortTag,
                            cantidad: (product.quantity ? product.quantity : 0),
                            precioPaqueteCliente: (product.clientPackagePrice ? product.clientPackagePrice : 0)
                        });
                    });

                    res.status(200).send('Products logged');
                }
            })


        });


    router.use('/:productId', function (req, res, next) {

        Product.findById(req.params.productId, function (err, product) {
            if (err)
                res.status(500).send(err);
            else if (product) {
                req.product = product;
                next();
            }
            else {
                res.status(404).send('no product found');
            }
        });
    });

    router.route('/:productId')
        .get(function (req, res) {
            var userRole = tokenUtilities.getUserRole(req);

            /** Filter properties based on user role */
            if (userRole === "public") {
                propertiesToSelect = publicProductProperties;
            } else if (userRole === "client") {
                propertiesToSelect = clientProductProperties;
            }

            res.sendWrapped(req.product);
        })
        .put(function (req, res) {
            if (!tokenUtilities.isAdmin(req)) {
                res.status(401).send(needToBeAdminMessage);
                return;
            }

            req.body.name = _.toUpper(req.body.name)
            req.product.sortTag = productUtil.getSortTag(req.body);
            req.product.tags = productUtil.getProductTags(req.product, req.body, req.body.tags);

            req.product.name = req.body.name;
            req.product.price = req.body.price;
            req.product.category = req.body.category;
            req.product.images = req.body.images;
            req.product.properties = req.body.properties;
            req.product.publicUnitPrice = req.body.publicUnitPrice;
            req.product.publicPackagePrice = req.body.publicPackagePrice;
            req.product.clientUnitPrice = req.body.clientUnitPrice;
            req.product.clientPackagePrice = req.body.clientPackagePrice;
            req.product.buyingUnitPrice = req.body.buyingUnitPrice;
            req.product.buyingPackagePrice = req.body.buyingPackagePrice;
            req.product.quantityPerPackage = req.body.quantityPerPackage;
            req.product.imageUrl = req.body.imageUrl;
            req.product.provider = req.body.provider;
            req.product.quantity = req.body.quantity;
            req.product.locations = req.body.locations;
            req.product.isFavorite = req.body.isFavorite;
            req.product.save(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.sendWrapped(req.product);
                    logger.log('info',
                        'productId:' + req.product._id + ' ' +
                        'product:' + req.product.name + ' ' +
                        'wareHouseQuantity:' + req.product.quantity);
                }
            });
        })
        .patch(function (req, res) {
            if (!tokenUtilities.isAdmin(req)) {
                res.status(401).send(needToBeAdminMessage);
                return;
            }

            if (req.body._id)
                delete req.body._id;

            for (var key in req.body) {
                req.product[key] = req.body[key];
            }
            req.product.save(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.json(req.product);
                }
            });
        })
        .delete(function (req, res) {
            if (!tokenUtilities.isAdmin(req)) {
                res.status(401).send(needToBeAdminMessage);
                return;
            }

            req.product.remove(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.status(204).send('Removed');
                }
            });
        });

    return router
}

module.exports = productRouter;
