const fs = require('fs');
const path = require('path');

function convertToTargetFormat(source) {
  // Function to create random photo data
  function createRandomPhoto(imageUrl) {
    return {
      directAccessUrl: imageUrl,
    };
  }

  // Initialize an array to hold the converted objects
  const convertedObjects = [];

  // Loop through each item in the source array
  source.forEach((item, index) => {
    try {
      // Ensure item contains image URLs and use the first one if available, else set default
      const photos = item.imageUrls?.map(createRandomPhoto) || [
        {
          directAccessUrl: 'https://via.placeholder.com/150'
        }
      ];

      // Create target format object
      const target = {
        formatted_address: item.address || null,
        formatted_phone_number: item.phone || null,
        name: item.title || null,
        photos: photos,
        rating: item.totalScore || null,
        user_ratings_total: item.reviewsCount || null
      };

      // Add the converted object to the array
      convertedObjects.push(target);
    } catch (error) {
      console.error(`Error processing item at index ${index}:`, error);
    }
  });

  return convertedObjects;
}

// Directory paths
const sourceDir = path.join(__dirname, './source-data');
const processedDir = path.join(__dirname, './processed-data');

console.log("Starting format conversion...");


// Ensure processed-data directory exists
if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir);
  console.log('Created processed-data directory');
} else {
  console.log('processed-data directory already exists');
}

// Read all JSON files from source-data directory
fs.readdir(sourceDir, (err, files) => {
  if (err) {
    console.error('Error reading source directory:', err);
    return;
  }

  console.log(`Found ${files.length} files in source-data directory`);

  files.forEach(file => {
    const filePath = path.join(sourceDir, file);
    console.log(`Processing file: ${file}`);

    // Read and parse JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', filePath, err);
        return;
      }

      try {
        const sourceData = JSON.parse(data);
        const convertedData = convertToTargetFormat(sourceData);

        // Write converted data to processed-data directory with same file name
        const outputFilePath = path.join(processedDir, file);
        fs.writeFile(outputFilePath, JSON.stringify(convertedData, null, 2), 'utf8', err => {
          if (err) {
            console.error('Error writing file:', outputFilePath, err);
          } else {
            console.log('Successfully processed:', file);
          }
        });
      } catch (parseErr) {
        console.error('Error parsing JSON file:', filePath, parseErr);
      }
    });
  });
});