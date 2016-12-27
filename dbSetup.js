
db.settings.insert({
    key: "imgServer",
    value: "https://192.168.1.38:5000/images"
});

db.settings.insert({
    key: "quickSearchs",
    value: [ 
        "mementos", 
        "promo", 
        "Matrimonios"
    ]
});

db.settings.insert({
    key: "productCategories",
    value: [
        {
          name: "Escritorio",
          view: ""
        },
        {
          name: "Invitaciones",
          view: "views/invitationDetails.html"
        }		
	  ]
});

db.settings.insert({
    key: "productProviders",
    value: [
        "Tunari"
    ]
});

db.settings.insert({
    key: "priceTypes",
    value: [
        'Unidad',
        'Paquete',
        'Unidad Especial',
        'Paquete Especial'
    ]
});

db.settings.insert({
    key: "locationTypes",
    value: [
        'Tienda',
        'Deposito'		
    ]
});

db.settings.insert({
    key: "invitationTypes",
    value: [
        "Mementos",
        "Virgenes",
        "Santos",
        "Promociones",
        "Bautizos",
        "1º Comunion",
        "Matrimonios",
        "Estampas"
    ]
});

db.settings.insert({
    key: "invitationsDetails",
    value: {
        Default: {			
          sizes: [
              "Postal",
              "Doble Esquela",
              "Esquela",
              "Triple",
              "Banderin",
              "Doble Postal"				
          ],
          genres: [
              "Hombre",
              "Mujer",
              "Unisex"
          ]
        },
        Mementos: {			
          sizes: [
              "Pequeño",
              "Mediano",
              "Grande"				
          ]
        },
        Matrimonios: {
            genres: ["Unisex"]
        },
        Virgenes: {
            genres: ["Unisex"]
        }
    }
});