const axios = require("axios");

exports.getLatLonFromName = async (place) => {

  const url =
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;

  const res = await axios.get(url, {
    headers: { "User-Agent": "water-wallet-app" }
  });

  if (!res.data.length) return null;

  return {
    lat: parseFloat(res.data[0].lat),
    lon: parseFloat(res.data[0].lon)
  };
};
