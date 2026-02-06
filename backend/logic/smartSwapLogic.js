const { profitPerDrop } = require("./profitLogic");

exports.smartSwap = (waterAvailable, crops) => {
  return Object.entries(crops)
    .filter(([_, c]) => c.water <= waterAvailable)
    .map(([name, c]) => ({
      crop: name,
      water: c.water,
      profit: c.profit,
      score: profitPerDrop(c)
    }))
    .sort((a,b)=>b.score-a.score)
    .slice(0,3);
};
