const axios = require('axios');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const ss = require('simple-statistics');

// --- 1. LOAD DATA (In-Memory) ---
let waterData = [];
const csvPath = path.join(__dirname, '../data/Atal_Jal_Disclosed_Ground_Water_Level-2015-2022.csv');

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (row) => waterData.push(row))
  .on('end', () => console.log('✅ Groundwater Data Loaded:', waterData.length, 'rows'));


// --- 2. GROUNDWATER PREDICTION ENGINE ---
const predictGroundwater = (villageName) => {
    // 1. Find Village (Fuzzy Match)
    const row = waterData.find(r => 
        r.Village && r.Village.toLowerCase().includes(villageName.toLowerCase())
    );

    // 2. Fallback if not found (Use a "Good" default for Demo purposes)
    if (!row) return 12.0; 

    // 3. Extract History
    const dataPoints = [];
    for (let year = 2015; year <= 2022; year++) {
        const val = parseFloat(row[`Pre-monsoon_${year} (meters below ground level)`]);
        if (!isNaN(val)) dataPoints.push([year, val]);
    }

    // 4. Linear Regression
    if (dataPoints.length < 2) return 12.0; // Default if no history
    
    const line = ss.linearRegressionLine(ss.linearRegression(dataPoints));
    let prediction = line(2026);

    // 5. Sanity Check (Cap extreme values for demo stability)
    return Math.max(2, Math.min(prediction, 40)); 
};


// --- 3. SOWING CALENDAR LOGIC ---
const calculateSowingWindow = (dailyForecast) => {
    // We need 3 consecutive "Good Days" to recommend sowing
    // Criteria: Rain < 5mm, Wind < 15km/h, Temp 20-35°C
    
    let consecutiveGoodDays = 0;
    let startIndex = -1;

    for (let i = 0; i < dailyForecast.time.length; i++) {
        const rain = dailyForecast.precipitation_sum[i];
        const wind = dailyForecast.windspeed_10m_max[i];
        const tempMax = dailyForecast.temperature_2m_max[i];

        const isGood = rain < 10 && wind < 20 && tempMax > 20 && tempMax < 38;

        if (isGood) {
            if (consecutiveGoodDays === 0) startIndex = i;
            consecutiveGoodDays++;
            
            if (consecutiveGoodDays >= 3) {
                // Found our window!
                return {
                    start: dailyForecast.time[startIndex],
                    end: dailyForecast.time[i],
                    status: 'OPTIMAL'
                };
            }
        } else {
            consecutiveGoodDays = 0;
            startIndex = -1;
        }
    }

    // If no perfect window found, return the first day but mark as "Risk"
    return {
        start: dailyForecast.time[0],
        end: dailyForecast.time[2] || dailyForecast.time[0],
        status: 'CONDITIONAL' 
    };
};


// --- 4. MAIN CONTROLLER ---
exports.analyzeFarm = async (req, res) => {
    try {
        const { village, crop, area } = req.body;
        const acres = area || 1;

        // A. SIMULATE GEOCODING (Default to Pune region for Hackathon Demo)
        // In real app: use a geocoder. Here, we lock coords to get valid weather data.
        const lat = 19.0760; 
        const lon = 72.8777;

        // B. FETCH WEATHER (Open-Meteo is free & no-key)
        // fetching 14 days for sowing window
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum,windspeed_10m_max&hourly=soil_moisture_9_27cm&timezone=auto&forecast_days=14`;
        
        const weatherRes = await axios.get(url);
        const daily = weatherRes.data.daily;
        const hourly = weatherRes.data.hourly;

        // C. CALCULATE METRICS
        const predictedDepth = predictGroundwater(village);
        
        // Rain Sum (Next 3 days only for Water Score)
        const rainSum = daily.precipitation_sum.slice(0, 3).reduce((a, b) => a + b, 0);
        
        // Soil Moisture (Current Hour)
        const currentHour = new Date().getHours();
        const soilMoisture = hourly.soil_moisture_9_27cm[currentHour] || 0.30;

        // D. SOWING WINDOW
        const sowingWindow = calculateSowingWindow(daily);

        // E. WATER SCORE MATH (ADJUSTED TO BE LESS HARSH)
        // -----------------------------------------------
        // 1. Aquifer: Depth 0m = 600 pts. Depth 30m = 0 pts.
        let aquiferScore = Math.max(0, (30 - predictedDepth) * 20); 
        
        // 2. Rain: 1mm = 10 pts (Boosted impact of rain)
        let rainScore = rainSum * 10; 

        // 3. Soil: 100% moisture = 400 pts
        let soilScore = soilMoisture * 400; 

        // Total Score
        const totalWaterPoints = Math.round(aquiferScore + rainScore + soilScore);


        // F. CROP VALIDATION
        const cropDB = [
            { crop: 'lentil', required: 250, profit: 22000 },
            { crop: 'chickpea', required: 350, profit: 28000 },
            { crop: 'mustard', required: 450, profit: 32000 },
            { crop: 'paddy', required: 800, profit: 45000 }, // Needs lots of water
            { crop: 'sugarcane', required: 1100, profit: 85000 }
        ];

        let chosenCrop = cropDB.find(c => c.crop.toLowerCase() === crop.toLowerCase());
        if (!chosenCrop) chosenCrop = cropDB[2]; // Default Mustard

        let status = totalWaterPoints >= chosenCrop.required ? 'PASS' : 'FAIL';
        let deficit = Math.max(0, chosenCrop.required - totalWaterPoints);


        // G. SMART SWAPS
        let suggestions = cropDB
            .filter(c => c.crop !== chosenCrop.crop)
            .filter(c => c.required <= totalWaterPoints + 100) // Allow slightly higher crops to appear
            .sort((a, b) => b.profit - a.profit)
            .slice(0, 3)
            .map(c => ({
                crop: c.crop,
                profit: c.profit * acres,
                waterSaved: Math.max(0, chosenCrop.required - c.required),
                required: c.required
            }));

        // If still empty (Severe Drought), show lowest water crops
        if (suggestions.length === 0) {
            suggestions = cropDB
                .sort((a, b) => a.required - b.required)
                .slice(0, 2)
                .map(c => ({ ...c, profit: c.profit * acres, waterSaved: 0 }));
        }

        // H. RESPONSE
        res.json({
            analysis: {
                village,
                predictedDepth: `${predictedDepth.toFixed(2)}m`,
                soilMoisture: `${(soilMoisture * 100).toFixed(0)}%`,
                rainForecast: `${rainSum.toFixed(1)}mm`,
                waterScore: totalWaterPoints
            },
            cropResult: {
                status,
                deficit,
                crop: chosenCrop.crop
            },
            sowingWindow, // <--- ADDED BACK
            suggestions
        });

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: err.message });
    }
};