var express = require('express');
const _ = require('lodash');

var tokenUtilities = require('./tokenUtilities');

// Logger
var logger = require('./../logger/logger');

var sellingRouter = function (Selling, Product) {
    var router = express.Router();

    // Base route.
    router.route('/')
        .get(function (req, res, next) {

            var query = {};

            if (req.query.from && req.query.to) {
                query = {
                    createdAt: {
                        $gte: req.query.from,
                        $lte: req.query.to
                    }
                }
            }

            if (req.query.createdAt) {
                var filterDay = new Date(req.query.createdAt);
                filterDay.setHours(filterDay.getHours() + 4);
                var filterNextDay = new Date(filterDay.valueOf());
                filterNextDay.setDate(filterNextDay.getDate() + 1);
                query = {
                    createdAt: {
                        $gte: filterDay,
                        $lte: filterNextDay
                    }
                }
            }

            Selling.count(query, function (err, count) {

                Selling.find(query, function (err, sellings) {
                    var productIds = _.map(sellings, "productId");
                    Product.find({ _id: { $in: productIds } }, function (err, products) {
                        sellings = _.map(sellings, function (selling) {
                            // Should be _id to find the product, by for some reason it works with just id
                            var sellingProduct = _.find(products, { 'id': selling.productId });
                            selling.productName = sellingProduct ? sellingProduct.name : "";
                            return selling;
                        });

                        if (err) {
                            logger.log('error', err);
                            res.status(500).send(err);
                        }

                        logger.log('info', 'get sellings called');
                        res.status(200).sendWrapped({
                            meta: {
                                count: count
                            },
                            items: sellings
                        });
                    }).select('name');

                })
                    .sort("-createdDate")
                    .limit(50);
            });
        })
        .post(function (req, res, next) {

            var newSelling = new Selling(req.body);

            Product.findOne({ _id: req.body.productId }, function (err, product) {
                if (product && product.quantity) {
                    product.quantity -= req.body.quantity;
                    product.quantity = product.quantity < 0 ? 0 : product.quantity;

                    product.save(function () {
                        newSelling.productName = product.name;
                        newSelling.save(function (err) {
                            if (err) {
                                logger.log('error', err);
                                throw err;
                            }
                            else {
                                res.status(201).sendWrapped(newSelling);
                            }
                        });
                    });
                }
            });



        });

    router.use('/:sellingId', function (req, res, next) {

        Selling.findById(req.params.sellingId, function (err, selling) {
            if (err)
                res.status(500).send(err);
            else if (selling) {
                req.selling = selling;
                next();
            }
            else {
                res.status(404).send('no selling found');
            }
        });
    });

    router.route('/:sellingId')
        .get(function (req, res) {

            res.sendWrapped(req.selling);
        })
        .put(function (req, res) {
            if (!tokenUtilities.isAdmin(req)) {
                res.status(401).send(needToBeAdminMessage);
                return;
            }

            Product.findOne({ _id: req.body.productId }, function (err, product) {
                var newProductQuantity = product.quantity + req.selling.quantity - req.body.quantity;

                req.selling.productId = req.body.productId;
                req.selling.quantity = req.body.quantity;
                req.selling.price = req.body.price;
                req.selling.quantityForPrice = req.body.quantityForPrice;
                req.selling.buyingPrice = req.body.buyingPrice;
                req.selling.revenue = req.body.revenue;
                req.selling.percentage = req.body.percentage;
                req.selling.total = req.body.total;

                req.selling.save(function (err) {

                    product.quantity = newProductQuantity;
                    product.quantity = product.quantity < 0 ? 0 : product.quantity;
                    product.save(function (err) {
                        if (err)
                            res.status(500).send(err);
                        else {
                            res.sendWrapped(req.selling);
                        }
                    });
                });
            });
        })
        .delete(function (req, res) {
            if (!tokenUtilities.isAdmin(req)) {
                res.status(401).send(needToBeAdminMessage);
                return;
            }

            req.selling.remove(function (err) {
                if (req.query.shouldUpdateQuantity === "true") {
                    Product.findOne({ _id: req.selling.productId }, function (err, product) {
                        product.quantity += req.selling.quantity;
                        product.quantity = product.quantity < 0 ? 0 : product.quantity;
                        product.save(function (err) {
                            if (err)
                                res.status(500).send(err);
                            else {
                                res.status(204).send('Removed');
                            }
                        });
                    });
                } else {
                    if (err)
                        res.status(500).send(err);
                    else {
                        res.status(204).send('Removed');
                    }
                }


            });
        });

    return router
}

module.exports = sellingRouter;    