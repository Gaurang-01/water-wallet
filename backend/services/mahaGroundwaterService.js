const XLSX = require("xlsx");
const path = require("path");

const filePath = path.join(
  __dirname,
  "../data/District Ground Water Level Information.xlsx"
);

// load once at startup (fast)
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];

const rows = XLSX.utils.sheet_to_json(sheet);

// rows now looks like:
// [
//   { District: 'Ahmadnagar', 'Observed Range of Water Level': '-14.45 - -7.41' }
// ]

exports.getMahaGroundwater = (district) => {

  if (!district) return null;

  const row = rows.find(r =>
    r.District.toLowerCase() === district.toLowerCase()
  );

  if (!row) return null;

  const range = row["Observed Range of Water Level"];

  if (!range) return null;

  const [low, high] = range.split(" - ").map(Number);

  const avgDepth = (low + high) / 2;

  // convert depth → availability score
  return Math.max(0, 800 - Math.abs(avgDepth) * 20);
};
