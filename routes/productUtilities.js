var _ = require('lodash');

var invitationsKey = "Invitaciones";

var getProductTags = function(oldProduct, newProduct, newProductTags) {
  
  newProductTags = newProductTags || [];
  _.pull(newProductTags, oldProduct.name);
  _.pull(newProductTags, oldProduct.category);
  _.pull(newProductTags, oldProduct.provider);

  newProductTags.push(newProduct.name);
  newProductTags.push(newProduct.category);
  newProductTags.push(newProduct.provider);

  if(oldProduct.category === invitationsKey) {
    _.pull(newProductTags, oldProduct.properties.type);
    _.pull(newProductTags, oldProduct.properties.size);
    _.pull(newProductTags, oldProduct.properties.genre);
  }

  if(newProduct.category === invitationsKey) {
    newProductTags.push(newProduct.properties.type);
    newProductTags.push(newProduct.properties.size);
    newProductTags.push(newProduct.properties.genre);
  }  

  newProductTags = _.filter(newProductTags, function(tag) {
      return !_.isEmpty(tag);
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

    var lastElement = _.last(nameParts);
    var isNum = /^\d+$/.test(lastElement);
    var number = "";

    if(isNum){
        number = lastElement;
    }

    return number;
}

module.exports.getProductTags = getProductTags;
module.exports.getSortTag = getSortTag;