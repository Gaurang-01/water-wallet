const axios = require('axios');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// --- 1. ROBUST DATA LOADER ---
let villageData = [];
let districtData = [];

const loadCSV = (filename, targetArray) => {
    const filePath = path.join(__dirname, `../data/${filename}`);
    if (fs.existsSync(filePath)) {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => targetArray.push(row));
    }
};

// Load your CSVs (Ensure these file names match your folder exactly)
loadCSV('Atal_Jal_Disclosed_Ground_Water_Level-2015-2022.csv', villageData);
loadCSV('district.csv', districtData);

// --- 2. CROP ECONOMICS DATABASE (The "Profit" Engine) ---
// Water Need (mm), Cost (₹/acre), Revenue (₹/acre)
const CROP_DB = {
    'sugarcane': { need: 2000, cost: 60000, revenue: 160000, risk: 'High', duration: 365 },
    'paddy':     { need: 1200, cost: 40000, revenue: 95000,  risk: 'High', duration: 120 },
    'cotton':    { need: 700,  cost: 25000, revenue: 65000,  risk: 'Medium', duration: 150 },
    'wheat':     { need: 450,  cost: 20000, revenue: 50000,  risk: 'Low', duration: 110 },
    'maize':     { need: 500,  cost: 18000, revenue: 48000,  risk: 'Low', duration: 100 },
    'soybean':   { need: 450,  cost: 16000, revenue: 45000,  risk: 'Low', duration: 95 },
    'chickpea':  { need: 300,  cost: 12000, revenue: 42000,  risk: 'Safe', duration: 90 },
    'mustard':   { need: 300,  cost: 10000, revenue: 38000,  risk: 'Safe', duration: 100 },
    'lentil':    { need: 250,  cost: 9000,  revenue: 35000,  risk: 'Safe', duration: 90 }
};

// --- 3. HELPER FUNCTIONS ---

const getGroundwater = (villageName) => {
    const row = villageData.find(r => r.Village && r.Village.toLowerCase().includes(villageName.toLowerCase()));
    if (row && row['Pre-monsoon_2022 (meters below ground level)']) {
        return { 
            depth: parseFloat(row['Pre-monsoon_2022 (meters below ground level)']), 
            source: 'Local Sensor (Atal Jal)' 
        };
    }
    return { depth: 15.0, source: 'District Average (Fallback)' }; // Default if not found
};

const calculateProfitPerDrop = (cropKey) => {
    const c = CROP_DB[cropKey];
    const profit = c.revenue - c.cost;
    // Profit per mm of water used (Simplified "Profit Per Drop")
    return Math.round(profit / c.need); 
};

// --- 4. MAIN ANALYZER ---
exports.analyzeFarm = async (req, res) => {
    try {
        // A. Inputs from Frontend
        const { village, crop, area } = req.body;
        const cropKey = (crop || 'sugarcane').toLowerCase();
        const acres = parseFloat(area || 1);
        
        const cropStats = CROP_DB[cropKey] || CROP_DB['sugarcane'];

        // B. Fetch Real-Time Weather (Open-Meteo)
        // Hardcoded Lat/Lon for Demo (In prod, use a Geocoder)
        const lat = 19.0760; // Maharashtra Center
        const lon = 74.8777; 
        
        let rainForecast = []; 
        let soilMoisture = 0.2; // Dry default

        try {
            const wRes = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum&hourly=soil_moisture_9_27cm&forecast_days=14`
            );
            rainForecast = wRes.data.daily.precipitation_sum;
            soilMoisture = wRes.data.hourly.soil_moisture_9_27cm[12] || 0.2;
        } catch (e) {
            console.log("⚠️ Weather API Offline, using seasonal averages");
            rainForecast = [0, 0, 5, 12, 4, 0, 0]; // Fake rain for demo
        }

        // C. Calculate Water Balance
        const gw = getGroundwater(village || 'Punade');
        
        // 1. Available Water (The "Asset")
        // Logic: Shallow aquifer (low depth) + Rain + Soil Moisture
        const aquiferHealth = Math.max(0, (40 - gw.depth) * 50); 
        const rainAsset = rainForecast.reduce((a,b)=>a+b, 0) * 10;
        const soilAsset = soilMoisture * 2000;
        
        const waterAvailable_mm = Math.round(aquiferHealth + rainAsset + soilAsset);
        const waterRequired_mm = cropStats.need;

        // D. Sowing Window Logic (The "When to Plant")
        // Look for 3 days of light rain after a dry spell
        let bestDateIndex = rainForecast.findIndex(r => r > 5); 
        if (bestDateIndex === -1) bestDateIndex = 7; // Default to next week if dry
        
        const sowStart = new Date();
        sowStart.setDate(sowStart.getDate() + bestDateIndex);
        const sowEnd = new Date(sowStart);
        sowEnd.setDate(sowEnd.getDate() + 7);

        // E. Generate Alternatives (Smart Swaps)
        const alternatives = Object.keys(CROP_DB)
            .filter(key => CROP_DB[key].need < waterAvailable_mm && key !== cropKey) // Only crops that fit the water budget
            .map(key => {
                const c = CROP_DB[key];
                return {
                    name: key.charAt(0).toUpperCase() + key.slice(1),
                    waterSaved: (cropStats.need - c.need) * acres, // Total mm saved
                    profit: (c.revenue - c.cost) * acres,
                    profitPerDrop: calculateProfitPerDrop(key)
                };
            })
            .sort((a,b) => b.profit - a.profit) // Show most profitable first
            .slice(0, 2); // Top 2

        // F. Final Response Packet
        const isSolvent = waterAvailable_mm >= waterRequired_mm;
        
        res.json({
            // 1. Status & Score
            status: isSolvent ? 'SOLVENT' : 'INSOLVENT',
            riskScore: isSolvent ? 85 : 35, // Simple mock score logic
            
            // 2. The "Water Tank" Data
            waterMath: {
                available: waterAvailable_mm,
                required: waterRequired_mm,
                balance: waterAvailable_mm - waterRequired_mm,
                unit: 'mm'
            },
            
            // 3. Financials (Profit Per Drop)
            financials: {
                totalCost: cropStats.cost * acres,
                estimatedRevenue: cropStats.revenue * acres,
                netProfit: (cropStats.revenue - cropStats.cost) * acres,
                profitPerDrop: calculateProfitPerDrop(cropKey)
            },

            // 4. Actionable Advice
            sowingWindow: {
                startDate: sowStart.toISOString(),
                endDate: sowEnd.toISOString(),
                advisory: soilMoisture < 0.25 ? "Wait for rain" : "Soil moisture optimal"
            },
            
            // 5. Smart Swaps
            suggestions: alternatives
        });

    } catch (err) {
        console.error("Analysis Error:", err);
        res.status(500).json({ error: "Calculation Failed" });
    }
};