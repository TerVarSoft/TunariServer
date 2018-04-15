var _ = require('lodash');

var invitationsKey = "Invitaciones";

var getProductTags = function(oldProduct, newProduct, newProductTags) {
  
  newProductTags = newProductTags || [];  
  
  _.pull(newProductTags, _.toUpper(oldProduct.name));
  _.pull(newProductTags, _.toUpper(oldProduct.category));
  _.pull(newProductTags, _.toUpper(oldProduct.provider));

  newProductTags.push(_.toUpper(newProduct.name));
  newProductTags.push(_.toUpper(newProduct.category));
  newProductTags.push(_.toUpper(newProduct.provider));

  if(oldProduct.description) {
    var oldDescriptionTags = _.toUpper(oldProduct.description).split(" ");
    _.pullAll(newProductTags, oldDescriptionTags);
  }

  if(newProduct.description) {
    var newDescriptionTags = _.toUpper(newProduct.description).split(" ");
    newProductTags = newProductTags.concat(newDescriptionTags);
  }

  if(oldProduct.category === invitationsKey) {
    _.pull(newProductTags, _.toUpper(oldProduct.properties.type));
    _.pull(newProductTags, _.toUpper(oldProduct.properties.size));
    _.pull(newProductTags, _.toUpper(oldProduct.properties.genre));
  }

  if(newProduct.category === invitationsKey) {
    newProductTags.push(_.toUpper(newProduct.properties.type));
    newProductTags.push(_.toUpper(newProduct.properties.size));
    newProductTags.push(_.toUpper(newProduct.properties.genre));
  }  

  newProductTags = _.filter(newProductTags, function(tag) {
      return !_.isEmpty(tag);
  });
  
  newProductTags = _.uniqBy(newProductTags, function (tag) {
    return _.toUpper(tag);
  });

  return newProductTags;
}

var getSortTag = function(product) {
  var sortTag = "";
  
  sortTag = product.category + product.name;

  if(product.category === invitationsKey) {
    var invitationNumber = getInvitationNumber(product);
    sortTag = product.properties.type + invitationNumber;
  }

  return sortTag;
}

function getInvitationNumber(invitation) {
    var nameParts = invitation.name.split('-');

    var lastElement = nameParts[1];
    var isNum = /^\d+$/.test(lastElement);
    var number = "";

    if(isNum){
        number = lastElement;
    }

    return number;
}

module.exports.getProductTags = getProductTags;
module.exports.getSortTag = getSortTag;