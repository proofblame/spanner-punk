const XLSX = require("xlsx");

const parse = (filename) => {
  console.log(filename)
  const excelData = XLSX.readFile(filename);

  return Object.keys(excelData.Sheets).map((name) => ({
    name,
    data: XLSX.utils.sheet_to_json(excelData.Sheets[name]),
  })).forEach((element) => {
    console.log(element.data)
  })
  ;
};

module.exports = {
  parse
}
