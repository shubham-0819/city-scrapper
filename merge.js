const cities = require("./cities.js");
const fs = require('fs');

function mergeAllCities() {
  const allClinics = [];
  cities.forEach((city) => {
    const fileName = `data/${city.name}.json`;
    try {
      const data = fs.readFileSync(fileName);
      allClinics.push(...JSON.parse(data));
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.warn(`File not found: ${fileName}`);
      } else {
        console.error(`Error reading file ${fileName}:`, err);
      }
    }
  });

  fs.writeFile("data/all-cities.json", JSON.stringify(allClinics, null, 2), (err) => {
    if (err) {
      console.error(`Error writing to file all-cities.json:`, err);
    } else {
      console.log(`Data written to file all-cities.json`);
    }
  });
}

mergeAllCities();