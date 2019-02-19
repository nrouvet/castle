let Promise = require('promise');
let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');

//List of promises to create
let finalList = [];
let listPromises = [];
let listHotels = [];
let scrapingCount = 1;

//Creation of promises
function init() {
    let url = 'https://www.relaischateaux.com/fr/site-map/etablissements';
    listPromises.push(getHotelsList(url));
    console.log("Relais&Chateaux hotels added to list");
}

function createPromises() {
    return new Promise(function(resolve) {
        if (scrapingCount === 1) {
            for (let i = 0; i < Math.trunc(listHotels.length / 2); i++) {
                let hotelURL = listHotels[i].url;
                finalList.push(getPostal_Price(hotelURL, i));
                console.log( i + "th hotel added to list");
            }
            resolve();
            scrapingCount++;
        } else if (scrapingCount === 2) {
            for (let i = listHotels.length / 2; i < Math.trunc(listHotels.length); i++) {
                let hotelURL = listHotels[i].url;
                finalList.push(getPostal_Price(hotelURL, i));
                console.log(i + "th hotel added to list");
            }
            resolve();
        }
    })
}

//Fetching list of hotels
function getHotelsList(url) {
    return new Promise(function(resolve, reject) {
        request(url, function(err, res, html) {
            if (err) {
                console.log(err);
                return reject(err);
            } else if (res.statusCode !== 200) {
                err = new Error("Unexpected status code : " + res.statusCode);
                err.res = res;
                return reject(err);
            }
            let $ = cheerio.load(html);

            let hotelsFrance = $('h3:contains("France")').next();
            hotelsFrance.find('li').length;
            hotelsFrance.find('li').each(function() {
                let data = $(this);
                let url = String(data.find('a').attr("href"));
                let name = data.find('a').first().text();
                name = name.replace(/\n/g, "");
                let chefName = String(data.find('a:contains("Chef")').text().split(' - ')[1]);
                chefName = chefName.replace(/\n/g, "");
                listHotels.push({
                    "url": url,
                    "name": name.trim(),
                    "postalCode": "",
                    "chef": chefName.trim(),
                    "price": ""
                })
            });
            resolve(listHotels);
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
                return reject(err);
            }

            const $ = cheerio.load(html);

            $('span[itemprop="postalCode"]').first().each(function() {
                let data = $(this);
                let pc = data.text();
                listHotels[index].postalCode = String(pc.split(',')[0]).trim();
            });

            $('.price').first().each(function() {
                let data = $(this);
                let price = data.text();
                listHotels[index].price = String(price);
            });
            console.log("Postal code and price of " + index + "th ohtel added");
            resolve(listHotels);
        });
    });
}

//Saving the list in Json file
function save() {
    return new Promise(function(resolve) {
        try {
            console.log("Creating list of hotel in listRelais&Chateaux.json");
            let jsonHotels = JSON.stringify(listHotels);
            fs.writeFile("listRelais&Chateaux.json", jsonHotels, function doneWriting(err) {
                if (err) {
                    console.log(err);
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
let prom = listPromises[0];
prom
    .then(createPromises)
    .then(() => {
        return Promise.all(finalList);
    })
    .then(save)
    .then(() => {
        console.log("done")
    });

module.exports.getHotelsJSON = function() {
    return JSON.parse(fs.readFileSync("listRelais&Chateaux.json"));
};