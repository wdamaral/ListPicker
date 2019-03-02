const axios = require('axios')
const { mapsKey } = require('../../.env')
/* 
    Calculate one meter in degrees
    1 degree = ~111km
    1km in degree = ~0.0089
    1m in degree = ~0.0000089
*/
const COEF = 0.0000089;

/**
 * Returns an offset for coordinates in range [min, max]
*/
function getRandomLatitudeOffset(min, max){
    return getRandomInt(min, max) * COEF;
}


function getRandomLongitudeOffset(min, max, latitude){
    return (getRandomInt(min, max) * COEF) / Math.cos(latitude * 0.018);
}


/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


const geocodeAddress = (address) => {
    var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${mapsKey}`;
    return axios
        .get(geocodeUrl)
        .then((response) => {
            if(response.data.status === 'ZERO_RESULTS') {
                throw new Error('Unable to find that address.');
            }
            let objResponse = {
                latitude: response.data.results[0].geometry.location.lat + getRandomLatitudeOffset(250, 500) ,
                longitude: response.data.results[0].geometry.location.lng + getRandomLongitudeOffset(250, 500, response.data.results[0].geometry.location.lat)
            }
            return objResponse
        })
        .catch(err => err)
    }
module.exports = {
    geocodeAddress
};
