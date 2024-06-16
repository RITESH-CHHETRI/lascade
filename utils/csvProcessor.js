const fs = require('fs');
const csvParser = require('csv-parser');
const mongoose = require('mongoose');
const UserData = require('../models/UserData'); // Import the UserData model

exports.processCSV = async (filePath, userId) => {
  return new Promise((resolve, reject) => {
    const results = [];

    // Read the CSV file
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          // Process the data as needed
          // Add the userId to each data row
          const processedData = results.map(row => ({
            ...row,
            userId: new mongoose.Types.ObjectId(userId)
          }));

          // Save the processed data to the database
          await UserData.insertMany(processedData);

          process.stdout.write(`${processedData.length} records inserted to the database\n`);

          fs.unlinkSync(filePath);

          // Resolve the promise to indicate successful processing
          resolve();
        } catch (error) {
          console.error('Error processing CSV:', error);

          fs.unlinkSync(filePath);

          // Reject the promise to indicate failure
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);

        fs.unlinkSync(filePath);

        // Reject the promise to indicate failure
        reject(error);
      });
  });
};
