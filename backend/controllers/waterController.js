const { getRainfall } = require("../services/weatherService");
const { getForecast } = require("../services/forecastService");
const { getPredictedGroundwater } = require("../services/groundwaterService");

const { getLatLonFromName } = require("../services/geocodeService");
const { getDistrictFromLatLon } = require("../services/locationService");
const { getMahaGroundwater } = require("../services/mahaGroundwaterService");

const { calculateBalance } = require("../logic/waterLogic");
const { checkCrop } = require("../logic/cropLogic");
const { smartSwap } = require("../logic/smartSwapLogic");
const { getSowingWindow } = require("../logic/sowingLogic");

const crops = require("../data/crops.json");

exports.analyzeFarm = async (req, res) => {
  try {
    const { locationName, lat, lon, crop, village } = req.body;

    // --------------------------------------------------
    // 1️⃣ Resolve coordinates (name OR lat/lon)
    // --------------------------------------------------

    let finalLat = lat;
    let finalLon = lon;

    // if only location name is provided → geocode it
    if (locationName && (!lat || !lon)) {
      const coords = await getLatLonFromName(locationName);

      if (!coords) {
        return res.status(400).json({ error: "Invalid location name" });
      }

      finalLat = coords.lat;
      finalLon = coords.lon;
    }

    if (!finalLat || !finalLon) {
      return res.status(400).json({ error: "Location required" });
    }

    // --------------------------------------------------
    // 2️⃣ Rainfall
    // --------------------------------------------------

    const rainfall = await getRainfall(finalLat, finalLon);

    // --------------------------------------------------
    // 3️⃣ Detect district from GPS
    // --------------------------------------------------

    const location = await getDistrictFromLatLon(finalLat, finalLon);

    // --------------------------------------------------
    // 4️⃣ Groundwater logic (Hybrid)
    // --------------------------------------------------

    let groundwater = null;

    // ✅ Maharashtra → real WRIS Excel data
    if (
      location?.state?.toLowerCase().includes("maharashtra")
    ) {
      groundwater = getMahaGroundwater(location.district);
    }


    // ✅ fallback → ML prediction
    if (!groundwater) {
      const depth = await getPredictedGroundwater(village || "");
      groundwater = Math.max(0, 800 - depth * 20);
    }

    // --------------------------------------------------
    // 5️⃣ Water balance
    // --------------------------------------------------

    const waterAvailable = calculateBalance(groundwater, rainfall);

    // --------------------------------------------------
    // 6️⃣ Crop solvency
    // --------------------------------------------------

    const cropResult = checkCrop(crop, waterAvailable);

    // --------------------------------------------------
    // 7️⃣ Smart crop suggestions
    // --------------------------------------------------

    const suggestions = smartSwap(waterAvailable, crops);

    // --------------------------------------------------
    // 8️⃣ Sowing window (safe)
    // --------------------------------------------------

    let sowingWindow = null;

    try {
      const forecast = await getForecast(finalLat, finalLon);
      sowingWindow = getSowingWindow(forecast);
    } catch (err) {
      console.log("Forecast error:", err.message);
    }

    // --------------------------------------------------
    // 9️⃣ Final response
    // --------------------------------------------------

    res.json({
      locationName,
      coordinates: {
        lat: finalLat,
        lon: finalLon
      },
      location,
      rainfall,
      groundwater,
      waterAvailable,
      cropResult,
      suggestions,
      sowingWindow
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
