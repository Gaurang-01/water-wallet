const axios = require("axios");

exports.getForecast = async (lat, lon) => {
  const API_KEY = process.env.WEATHER_KEY;

  const url =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  const res = await axios.get(url);

  // simplify data
  return res.data.list.map(item => ({
    date: item.dt_txt,
    temp: item.main.temp,
    rain: item.rain ? (item.rain["3h"] || 0) : 0,
    wind: item.wind.speed
  }));
};
