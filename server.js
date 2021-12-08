'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherData = require('./data/weather.json')
const axios = require('axios');

const app = express();
app.use(cors());
// use implies middleware
const PORT = process.env.PORT;

app.get('/test', ((req, res) => res.send('test worked')));
app.get('/weather', handleGetWeather);
app.get('/*', ((req, res) => res.status(404).send('route not found')));

function handleGetWeather(req, res) {
  //https://api.weatherbit.io/v2.0/current?lat=${req.query.lat}&lon=${req.query.lon}&key=${process.env.WEATHER_API_KEY}&units=I
  const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${req.query.lat}&lon=${req.query.lon}&key=${process.env.WEATHER_API_KEY}&units=I`
  // in theory take in query params from the client on the req
  // let city_name = req.query.city_name;
  // we care about the city name
  // look through the 3 objects in my weather data and find if there is one where the name of the city city_name matches the query city sent in
  // let cityMatch = weatherData.find(city => city.city_name.toLowerCase() === city_name.toLowerCase());
  // if (cityMatch) {
  //   let weatherDescriptions = cityMatch.data.map(day => new Forecast(day));
  //   res.status(200).send(weatherDescriptions);
  // } else {
  //   res.status(400).send('sorry no data on that city');
  // }
  // if I have a match pass the matched data through my class and make new instances of Forecast and send the array of forecast objs back
  console.log(req.query)
  axios.get(url)
    .then(results => {
      let weatherDescriptions = results.data.data.map(day => new Forecast(day));
      res.status(200).send(weatherDescriptions);
    })
    .catch (error => {
      console.error(error.message);
      res.status(500).send('server error');
    });
}

// a client can make a request at this route: weather, by submitting a city_name in the query, if we have data about that city we will send it back with a date and a description for 3 days of weather

class Forecast {
  constructor(obj) {
    this.date = obj.datetime;
    this.description = `a high of ${obj.max_temp}, a low of ${obj.low_temp}, with ${obj.weather.description}`
  }
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));