const router = require("express").Router();
const { analyzeFarm } = require("../controllers/waterController");

router.post("/analyze", analyzeFarm);

module.exports = router;
