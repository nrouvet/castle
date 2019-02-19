//Required libraries
const hotel = require('./scraperRelais.js');
const restaurant = require('./scraperMichelin.js');
let fs = require('fs');

'use strict';


const hotelJSON = hotel.getHotelsJSON();
const restaurantsJSON = restaurant.getRestaurantsJSON();

fs.writeFileSync("Selection.json", JSON.stringify(findMutualChefsAndPCs(hotelJSON, restaurantsJSON)));

function findMutualChefsAndPCs(listHotels, listRestaurants) {
  let restaurantsJSON = [];
  for (let i = 0; i < listHotels.length; i++) {
    for (let j = 0; j < listRestaurants.length; j++) {
      if (listHotels[i].chef === listRestaurants[j].chef && listHotels[i].postalCode === listRestaurants[j].postalCode) {
        restaurantsJSON.push({
          "hotelName": listHotels[i].name,
          "restaurantName": listRestaurants[j].name,
          "chef": listHotels[i].chef,
          "postalCode": listHotels[i].postalCode,
          "price": listHotels[i].price,
          "url": listHotels[i].url
        })
      }
    }
  }
  return restaurantsJSON;
}

console.log("selection done.");