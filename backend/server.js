// backend/server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURATION ---
const OPENWEATHER_API_KEY = "YOUR_OPENWEATHER_KEY"; // 🔴 REPLACE THIS with a free key
const NASA_START_DATE = "20230101";
const NASA_END_DATE = "20231231";

// --- 1. LOAD "WATER REQ.PDF" DATA (Extracted Standards) ---
// Based on "Guide for Estimating Irrigation Water Requirements" (Govt of India)
// Values are in mm per season (averaged for Indian climate zones)
const CROP_STANDARDS = {
    // Water intensive
    'sugarcane': { req: 2200, duration: 365, sowing: "Jan-Mar" }, 
    'paddy':     { req: 1200, duration: 120, sowing: "Jun-Jul" },
    'banana':    { req: 1800, duration: 365, sowing: "Jun-Aug" },
    // Medium
    'cotton':    { req: 700,  duration: 180, sowing: "May-Jun" },
    'maize':     { req: 500,  duration: 100, sowing: "Jun-Jul" },
    'wheat':     { req: 450,  duration: 110, sowing: "Nov-Dec" },
    // Low (Smart Swaps)
    'soybean':   { req: 450,  duration: 100, sowing: "Jun-Jul" },
    'chickpea':  { req: 300,  duration: 100, sowing: "Oct-Nov" },
    'mustard':   { req: 300,  duration: 100, sowing: "Oct-Nov" },
    'millets':   { req: 250,  duration: 90,  sowing: "Jun-Jul" }
};

// --- 2. LOAD LOCAL CSV (Pinpoint Groundwater) ---
let localVillageData = [];
// Ensure you have a 'data' folder with district.csv or create a dummy one
const CSV_PATH = path.join(__dirname, 'data', 'district.csv');

if (fs.existsSync(CSV_PATH)) {
    fs.createReadStream(CSV_PATH)
        .pipe(csv())
        .on('data', (row) => {
             // Normalize keys
             const cleanRow = {};
             Object.keys(row).forEach(k => cleanRow[k.trim().toLowerCase()] = row[k]);
             localVillageData.push(cleanRow);
        })
        .on('end', () => console.log(`✅ Loaded ${localVillageData.length} villages from CSV`));
} else {
    console.log("⚠️ No CSV found (Running in NASA-Only mode)");
}

// --- HELPER: Get Coords ---
async function getCoordinates(query) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query},India`;
        const res = await axios.get(url, { headers: { 'User-Agent': 'AgriApp/1.0' } });
        return res.data[0] ? { lat: res.data[0].lat, lon: res.data[0].lon, name: res.data[0].display_name } : null;
    } catch (e) { return null; }
}

// --- API ENDPOINT ---
app.post('/api/water/analyze', async (req, res) => {
    let { village, crop, area, lat, lon, useGPS } = req.body;
    let coords = { lat, lon };
    let locationName = village;

    console.log(`\n🔍 Analyzing for: ${useGPS ? 'GPS Location' : village}`);

    try {
        // A. RESOLVE LOCATION
        if (!useGPS) {
            const geocode = await getCoordinates(village);
            if (!geocode) return res.json({ status: "ERROR", message: "Village not found" });
            coords = { lat: geocode.lat, lon: geocode.lon };
            locationName = geocode.name;
        }

        // B. GET GROUNDWATER (Hybrid Strategy)
        let groundwaterLevel = 0;
        let source = "NASA Satellite";

        // 1. Check Local CSV first (Pinpoint)
        const localMatch = localVillageData.find(v => v.village === village.toLowerCase());
        if (localMatch) {
            groundwaterLevel = parseFloat(localMatch.water_level || localMatch.gw_level || 1000);
            source = "Local Sensor/Govt Data";
        } else {
            // 2. Fallback to NASA Rain for estimation
            const nasaUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOTCORR&community=AG&longitude=${coords.lon}&latitude=${coords.lat}&start=${NASA_START_DATE}&end=${NASA_END_DATE}&format=JSON`;
            const nasaRes = await axios.get(nasaUrl);
            const rainData = nasaRes.data.properties.parameter.PRECTOTCORR;
            let totalRain = Object.values(rainData).reduce((a, b) => b >= 0 ? a + b : a, 0);
            
            // Hydrology Logic: Recharge + Aquifer Base
            groundwaterLevel = (totalRain * 0.4) + 800; // Simplified model
        }

        // C. GET WEATHER FORECAST (OpenWeather)
        let forecast = [];
        try {
            // If you don't have a key, this block might fail, so we wrap it
            if (OPENWEATHER_API_KEY !== "YOUR_OPENWEATHER_KEY") {
                const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
                const weatherRes = await axios.get(weatherUrl);
                // Extract 5 days (noon values)
                forecast = weatherRes.data.list
                    .filter(item => item.dt_txt.includes("12:00:00"))
                    .slice(0, 5)
                    .map(item => ({
                        date: item.dt_txt.split(" ")[0],
                        temp: item.main.temp,
                        desc: item.weather[0].main
                    }));
            }
        } catch (e) { console.log("Weather API skipped (Invalid Key)"); }

        // D. CROP CALCULATIONS
        const cropInfo = CROP_STANDARDS[crop.toLowerCase()] || { req: 500, sowing: "Jun" };
        const totalRequired = cropInfo.req * parseFloat(area);
        const balance = groundwaterLevel - totalRequired;
        const isSolvent = balance >= 0;

        // E. SMART SUGGESTIONS (Logic from PDF)
        let suggestions = [];
        if (!isSolvent) {
            // Suggest low water crops
            ['chickpea', 'mustard', 'soybean'].forEach(altCrop => {
                const altReq = CROP_STANDARDS[altCrop].req * area;
                if (groundwaterLevel > altReq) {
                    suggestions.push({
                        name: altCrop.charAt(0).toUpperCase() + altCrop.slice(1),
                        waterSaved: totalRequired - altReq,
                        profit: 25000 * area // Est profit
                    });
                }
            });
        }

        res.json({
            status: isSolvent ? "SOLVENT" : "INSOLVENT",
            location: locationName,
            source: source,
            waterMath: {
                available: Math.round(groundwaterLevel),
                required: Math.round(totalRequired),
                balance: Math.round(balance)
            },
            sowing: cropInfo.sowing,
            weather: forecast,
            suggestions: suggestions.slice(0, 2)
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Analysis Failed" });
    }
});

app.listen(5000, () => console.log("🚀 Hybrid Server Running on Port 5000"));