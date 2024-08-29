const fs = require("fs");
const path = require("path");
const { parse } = require("json2csv");

// Directory containing the JSON files
const directoryPath = "./data"; // Replace with your directory path
const outputCsvFile = "combined_clinics_data.csv";

// Function to convert JSON files to CSV
function convertJsonToCsv(directoryPath, outputCsvFile) {
  let allData = [];

  // Read all files in the directory
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    // Filter for JSON files
    const jsonFiles = files.filter((file) => path.extname(file) === ".json");

    jsonFiles.forEach((file) => {
      const filePath = path.join(directoryPath, file);

      // Read and parse each JSON file
      const fileContent = fs.readFileSync(filePath, "utf8");
      const jsonData = JSON.parse(fileContent);

      // Combine the JSON data into a single array
      allData = allData.concat(jsonData);
    });

    // Convert JSON data to CSV format
    const fields = ["name", "address", "phone", "rating", "number_of_reviews"]; // Specify the fields you want in the CSV
    const opts = { fields };

    try {
      const csv = parse(allData, opts);

      // Write CSV to a file
      fs.writeFileSync(outputCsvFile, csv);
      console.log(`CSV file successfully written to ${outputCsvFile}`);
    } catch (err) {
      console.error("Error converting JSON to CSV:", err);
    }
  });
}

// Call the function to start conversion
convertJsonToCsv(directoryPath, outputCsvFile);
