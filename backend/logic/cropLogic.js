const crops = require("../data/crops.json");

exports.checkCrop = (cropName, waterAvailable) => {

  const crop = crops[cropName];

  if (!crop) {
    return { error: "Invalid crop" };
  }

  const required = crop.water;

  if (waterAvailable >= required) {
    return {
      status: "PASS",
      surplus: +(waterAvailable - required).toFixed(2)
    };
  } else {
    return {
      status: "FAIL",
      deficit: +(required - waterAvailable).toFixed(2)
    };
  }
};
