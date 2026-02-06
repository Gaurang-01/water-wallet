const axios = require('axios');

const cropDB = [
  { crop: 'lentil', water: 220, profit: 23000 },
  { crop: 'chickpea', water: 250, profit: 24000 },
  { crop: 'mustard', water: 300, profit: 26000 },
  { crop: 'paddy', water: 1200, profit: 30000 },
  { crop: 'sugarcane', water: 1800, profit: 45000 }
];

exports.analyzeFarm = async (req, res) => {
  try {
    const { locationName, crop, area } = req.body;

    const acres = area || 1;

    // DEMO values (replace with real later)
    const groundwater = 311.4;
    const rainfall = 0;

    const waterAvailable = groundwater + rainfall;

    const chosen = cropDB.find(c => c.crop === crop);

    const required = chosen.water * acres;

    const deficit = required > waterAvailable
      ? required - waterAvailable
      : null;

    const status = deficit ? 'FAIL' : 'PASS';

    const suggestions = cropDB
      .map(c => ({
        ...c,
        profit: c.profit * acres,
        score: c.profit / c.water
      }))
      .sort((a, b) => b.score - a.score);

    const sowingWindow = {
      start: new Date(Date.now() + 86400000),
      end: new Date(Date.now() + 3 * 86400000)
    };

    res.json({
      rainfall,
      groundwater,
      waterAvailable,
      cropResult: {
        status,
        deficit
      },
      suggestions,
      sowingWindow
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
