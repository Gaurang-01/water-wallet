const path = require("path");
const { exec } = require("child_process");

exports.getPredictedGroundwater = (village) => {
  return new Promise((resolve, reject) => {

    const csv = path.join(__dirname, "../../data/Atal_Jal_Disclosed_Ground_Water_Level-2015-2022.csv");
    const script = path.join(__dirname, "../../ai-engine/groundwater_predictor.py");

    exec(`python "${script}" "${csv}" "${village}"`, (err, stdout) => {
      if (err) reject(err);

      resolve(parseFloat(stdout));
    });

  });
};
