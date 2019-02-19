let Promise = require('promise');
let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');

//List of promises to create
let finalList = [];
let listPromises = [];
let listRestaurant = [];
let scrapingRound = 1;

//Creating promises
function init() {
    for (let i = 1; i <= 37; i++) {
        let url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-' + i.toString();
        finalList.push(getRestaurantsList(url));
        console.log("Page " + i + " of starred Michelin restaurants added to the list");
    }
}

function createPromises() {
    return new Promise(function(resolve) {
        if (scrapingRound === 1) {
            for (let i = 0; i < listRestaurant.length / 2; i++) {
                let restaurantURL = listRestaurant[i].url;
                listPromises.push(getPostal_Price(restaurantURL, i));
                console.log( i + "th restaurant added to list");
            }
            resolve();
            scrapingRound++;
        }
        if (scrapingRound === 2) {
            for (let i = listRestaurant.length / 2; i < listRestaurant.length; i++) {
                let restaurantURL = listRestaurant[i].url;
                listPromises.push(getPostal_Price(restaurantURL, i));
                console.log( i + "th restaurant added to list");
            }
            resolve();
        }
    })
}

//Fetching list of all restaurants
function getRestaurantsList(url) {
    return new Promise(function(resolve, reject) {
        request(url, function(err, res, html) {
            if (err) {
                console.error(err);
                return reject(err);
            } else if (res.statusCode !== 200) {
                err = new Error("Unexpected status code : " + res.statusCode);
                err.res = res;
                console.error(err);
                return reject(err);
            }
            let $ = cheerio.load(html);
            $('.poi-card-link').each(function() {
                let data = $(this);
                let link = data.attr("href");
                let url = "https://restaurant.michelin.fr/" + link;
                listRestaurant.push({
                    "url": url,
                    "name": "",
                    "postalCode": "",
                    "chef": ""
                })
            });
            resolve(listRestaurant);
        });
    });
}

//Postal code and price
function getPostal_Price(url, index) {
    return new Promise(function(resolve, reject) {
        request(url, function(err, res, html) {
            if (err) {
                console.error(err);
                return reject(err);
            } else if (res.statusCode !== 200) {
                err = new Error("Unexpected status code : " + res.statusCode);
                err.res = res;
                console.error(err);
                return reject(err);
            }

            const $ = cheerio.load(html);
            $('.poi_intro-display-title').first().each(function() {
                let data = $(this);
                let name = data.text();
                name = name.replace(/\n/g, "");
                listRestaurant[index].name = name.trim();
            });

            $('.postal-code').first().each(function() {
                let data = $(this);
                let pc = data.text();
                listRestaurant[index].postalCode = pc;
            });

            $('#node_poi-menu-wrapper > div.node_poi-chef > div.node_poi_description > div.field.field--name-field-chef.field--type-text.field--label-above > div.field__items > div').first().each(function() {
                let data = $(this);
                let chefname = data.text();
                listRestaurant[index].chef = chefname;
            });
            console.log("Postal code and price of  " + index + "th restaurant added");
            resolve(listRestaurant);
        });
    });
}

//Saving the list in Json file
function save() {
    return new Promise(function(resolve) {
        try {
            console.log("Creating list of restaurants in listRestaurants.json");
            let jsonRestaurants = JSON.stringify(listRestaurant);
            fs.writeFile("listRestaurants.json", jsonRestaurants, function doneWriting(err) {
                if (err) {
                    console.error(err);
                }
            });
            console.log("saving successful");
        } catch (error) {
            console.error(error);
        }
        resolve();
    });
}

//Main()
init();
Promise.all(finalList)
    .then(createPromises)
    .then(() => {
        return Promise.all(listPromises);
    })
    .then(save)
    .then(() => {
        console.log("done");
    });

module.exports.getRestaurantsJSON = function() {
    return JSON.parse(fs.readFileSync("listRestaurants.json"));
};