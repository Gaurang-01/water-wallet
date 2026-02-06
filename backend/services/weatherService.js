const axios = require("axios");

exports.getRainfall = async (lat, lon) => {
  const API_KEY = process.env.WEATHER_KEY;

  console.log("KEY:", API_KEY);

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const res = await axios.get(url);

    let rainfall = 0;

    res.data.list.forEach(day => {
      if (day.rain) rainfall += day.rain["3h"] || 0;
    });

    return rainfall;
  } catch (err) {
    console.log("Weather API error:", err.response?.data || err.message);
    throw err;
  }
};
