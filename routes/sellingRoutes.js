var express = require('express');
var _ = require('underscore-node');

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

            Selling.count(query, function (err, count) {

                Selling.find(query, function (err, sellings) {
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
                })
                    .sort("-createdDate")
                    .limit(40);
            });
        })
        .post(function (req, res, next) {

            var newSelling = new Selling(req.body);

            Product.findOne({ name: req.body.productName }, function (err, product) {

                if (product && product.quantity) {
                    product.quantity -= req.body.quantity;
                    product.quantity = product.quantity < 0 ? 0 : product.quantity;

                    product.save();
                }
            });

            newSelling.save(function (err) {
                if (err) {
                    logger.log('error', err);
                    throw err;
                }
                else {
                    res.status(201).sendWrapped(newSelling);
                }
            });

        });;

    return router
}

module.exports = sellingRouter;    