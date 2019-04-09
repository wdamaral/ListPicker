const axios = require('axios')
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
function getRandomLatitudeOffset(min, max) {
    return getRandomInt(min, max) * COEF;
}


function getRandomLongitudeOffset(min, max, latitude) {
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
    var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.MAPS_KEY}`;
    return axios
        .get(geocodeUrl)
        .then((response) => {
            // console.log(response)
            if (response.data.status === 'ZERO_RESULTS') {
                return
            }
            let objResponse = {
                latitude: response.data.results[0].geometry.location.lat + getRandomLatitudeOffset(30, 50),
                longitude: response.data.results[0].geometry.location.lng + getRandomLongitudeOffset(30, 50, response.data.results[0].geometry.location.lat)
            }
            return objResponse
        })
        .catch(err => err)
}
module.exports = {
    geocodeAddress
};