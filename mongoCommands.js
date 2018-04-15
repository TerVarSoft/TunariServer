// Update Prices 04-14-2018:
db.getCollection('products').find({category: 'Invitaciones'}).forEach(function(doc) {doc.prices=[];var newPrice={}, newPrice2={};newPrice.type=0;newPrice2.type=1;newPrice.value=doc.clientPackagePrice;newPrice2.value=doc.publicPackagePrice;doc.prices.push(newPrice);doc.prices.push(newPrice2);db.products.save(doc);})

// Filter when the collection is to big for the update an dmongo fails:
db.getCollection('products').find({properties: {type: 'Santos'}, sortTag: { $gt: 'Santos130' }}).forEach(function(doc) {doc.prices=[];var newPrice={}, newPrice2={};newPrice.type=0;newPrice2.type=1;newPrice.value=doc.clientPackagePrice;newPrice2.value=doc.publicPackagePrice;doc.prices.push(newPrice);doc.prices.push(newPrice2);db.products.save(doc);})