const axios = require("axios");

exports.getDistrictFromLatLon = async (lat, lon) => {

  const url =
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

  const res = await axios.get(url, {
    headers: { "User-Agent": "water-wallet-app" }
  });

  const address = res.data.address;

  return (
    address.state_district ||
    address.district ||
    address.county ||
    null
  );
};
