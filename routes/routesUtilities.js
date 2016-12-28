var _ = require('lodash');
var logger = require('./../logger/logger');

var buildQuery = function(requestQuery){
	
	var query = requestQuery;
	var nameRangeSeparator = ";";
	var nameRanges = [];
	var excludeProductNames = [];
	
	if(query.querySort){
			query[query.querySort] = {
				$exists: true,
				 $ne: null
			};
	}

	if (query.tags) {
		var tagsString = requestQuery.tags.split(" ");        
		var tagsRegExp = [];

		// Name Filtering
		var nameRangeKey = _.findLast(tagsString, function(tag){
			return _.includes(tag, nameRangeSeparator);
		});

		if(nameRangeKey){
				nameRanges = nameRangeKey.split(nameRangeSeparator);
		}				
		
		// Tags Filtering
		tagsString = _.reject(tagsString, function(tag){
			return _.includes(tag, nameRangeSeparator)
		});
		
		for(var i=0; i<tagsString.length;i++){
			tagsRegExp[i] = new RegExp(tagsString[i], 'i');
		}
		
		if(tagsRegExp.length > 0) {
			query.tags = {
				$all:tagsRegExp, 
				$exists: true,
				$ne: null
			};
		}
		else{
			query = _.omit(query, ['tags']);
		}			
	}

	// Products Exclude
	if(query.excludeProductNames) {			
			excludeProductNames = query.excludeProductNames.split(',');			
	}

	if(query.maxQuantity){
			query.quantity = {
					$lte: +query.maxQuantity, 
					$exists: true,
					$ne: null
			};
	}

	query.name = {
			$gte: nameRanges[0] ? nameRanges[0].toUpperCase() :  "",
			$lte: nameRanges[1] ? nameRanges[1].toUpperCase() :  "zzzzzzzzzzzzzzzz",
			$exists: true,
			$ne: null,
			$nin: excludeProductNames
	}

	query = _.omit(query, ['querySort', 'queryLimit', 'page', 'maxQuantity', 'properties', 'excludeProductNames']);
	
	return query;
}
	
module.exports.buildQuery = buildQuery;