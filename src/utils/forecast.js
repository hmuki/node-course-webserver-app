const request = require("postman-request");

const forecast = (lat, long, callback) => {
  const url =
    "http://api.weatherstack.com/current?access_key=01cacdbfb153a48d478f0a933cfd899c&query=" +
    encodeURIComponent(lat + "," + long);
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to network services", undefined);
    } else if (body.error) {
      callback("Wrong coordinates. Please try another location", undefined);
    } else {
      callback(
        undefined,
        "Weather condition: " +
          body.current.weather_descriptions[0] +
          ". It feels like " +
          body.current.feelslike +
          " degrees out."
      );
    }
  });
};

module.exports = forecast;
