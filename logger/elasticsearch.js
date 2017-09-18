// Winston
var winston = require('winston');
var Elasticsearch = require('./../customDep/winston-elasticsearch');
var elasticsearch = require('elasticsearch');

var config = {
  host: 'http://8e4884e8.ngrok.io:80',
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