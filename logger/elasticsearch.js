// Winston
var winston = require('winston');
var Elasticsearch = require('./../customDep/winston-elasticsearch');
var elasticsearch = require('elasticsearch');

var config = {  
  host: process.env.BONSAI_URL
};
var es1 = new elasticsearch.Client(config);

var esTransportOpts = {  
  client: es1,
  index: 'logstash-products',
};
winston.add(winston.transports.Elasticsearch, esTransportOpts);

var elastic = new (winston.Logger)({
transports: [
  new Elasticsearch(esTransportOpts)
]
});

module.exports = elastic; 