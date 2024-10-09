const axios = require("axios");
require("dotenv").config();
const cities = require("./cities.js");
const fs = require("fs");

const apiKey = process.env.GOOGLE_API_KEY;
const nearbySearchUrl =
  "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const placeDetailsUrl =
  "https://maps.googleapis.com/maps/api/place/details/json";

const MAX_CLINICS_PER_CITY = 50; // Maximum number of clinics to fetch per city

// Function to fetch dentist clinics from a city
async function fetchClinics(
  city,
  nextPageToken = null,
  clinics = [],
  clinicCount = 0
) {
  let url = `${nearbySearchUrl}?key=${apiKey}&type=dentist&location=${city.lat},${city.lng}&radius=5000`;
  if (nextPageToken) {
    url += `&pagetoken=${nextPageToken}`;
  }

  try {
    const response = await axios.get(url);
    console.log("Status:", response.data);
    
    const results = response.data.results;
    console.log("Results:", results.length);
    writeToFile(results, city.name+"-list");
    for (const place of results) {
      if (clinicCount >= MAX_CLINICS_PER_CITY) {
        // Stop fetching if we have reached the maximum limit
        writeToFile(clinics, city.name);
        return;
      }

      const clinicDetails = await fetchClinicDetails(place.place_id);
      if (clinicDetails) {
        clinics.push(clinicDetails);
        clinicCount++;
      }
    }

    // If there's more data and we haven't reached the limit, recursively fetch the next page
    if (response.data.next_page_token && clinicCount < MAX_CLINICS_PER_CITY) {
      setTimeout(
        () =>
          fetchClinics(
            city,
            response.data.next_page_token,
            clinics,
            clinicCount
          ),
        2000
      );
    } else {
      // Once all pages are fetched or limit is reached, write to the file
      writeToFile(clinics, city.name);
    }
  } catch (error) {
    console.error("Error fetching clinics:", error);
  }
}

// Function to fetch detailed information about a clinic
async function fetchClinicDetails(placeId) {
  const url = `${placeDetailsUrl}?key=${apiKey}&place_id=${placeId}&fields=name,rating,formatted_address,formatted_phone_number,user_ratings_total,photos`;
  
  // console.log(photos);
  
  try {
    const response = await axios.get(url);
    const clinic = response.data.result;
    // const photos = clinic.photos.slice(0, 10).map((photo) => photo.photo_reference);
    // console.log(clinic.name);

    return {
      ...clinic,
      // name: clinic.name,
      // address: clinic.formatted_address,
      // phone: clinic.formatted_phone_number || "N/A",
      // rating: clinic.rating || "No rating available",
      // number_of_reviews: clinic.user_ratings_total || "No reviews",

    };
  } catch (error) {
    console.error("Error fetching clinic details:", error);
    return null;
  }
}

// Function to write data to a file (append mode)
function writeToFile(data, cityName) {
  const fileName = `data/${cityName}.json`;

  fs.readFile(fileName, (err, existingData) => {
    if (err && err.code !== "ENOENT") {
      console.error(`Error reading file ${fileName}:`, err);
      return;
    }

    let existingClinics = [];
    if (existingData) {
      existingClinics = JSON.parse(existingData);
    }

    const updatedData = [...existingClinics, ...data];

    fs.writeFile(fileName, JSON.stringify(updatedData, null, 2), (err) => {
      if (err) {
        console.error(`Error writing to file ${fileName}:`, err);
      } else {
        console.log(`Data written to file ${fileName}`);
      }
    });
  });
}

// Fetch clinics for each city
cities.forEach((city) => {
  console.log(`Fetching clinics for ${city.name}`);
  fetchClinics(city);
});
