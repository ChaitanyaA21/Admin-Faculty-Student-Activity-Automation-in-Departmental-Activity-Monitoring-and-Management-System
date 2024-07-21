const fs = require("fs");
const XLSX = require("xlsx");
// const jsontoxml = require('jsontoxml')
const { log } = require("console");

const workbook = XLSX.read(
  fs.readFileSync(
    "C:\\Users\\allur\\OneDrive\\Desktop\\SIT_projectDetails.xlsx"
  )
);

let worksheets = {};
for (const sheetName of workbook.SheetNames) {
  worksheets[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
}
function compare(a, b) {
  if (a.Names > b.Names) {
    return 1;
  } else if (a.Names < b.Names) {
    return -1;
  }
  return 0;
}

worksheets.Sheet1.sort(compare);

worksheets.Sheet1.forEach((element) => {
  console.log(element.Names);
});

log(worksheets.Sheet1.length);

// console.log(worksheets.length)
