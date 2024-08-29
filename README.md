# city-scrapper

## Overview

This project scrapes clinic data from various cities using the Google Places API and converts the data from JSON format to CSV.

## Setup

1. Clone the repository.
2. Install the dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file based on the `.env.example` and add your Google API key:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

## Usage

### Fetching Clinic Data

To fetch clinic data for the cities listed in `cities.js`, run:

```sh
npm run start
```

### jsonToCsv.js

- convertJsonToCsv(directoryPath, outputCsvFile): Converts JSON files in a directory to a single CSV file.

## License

This project is licensed under the MIT License.
