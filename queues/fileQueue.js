const async = require('async');
const csvProcessor = require('../utils/csvProcessor');

// Create a queue with a concurrency of 1
const fileQueue = async.queue(async (task, callback) => {
  try {
    await csvProcessor.processCSV(task.filePath, task.userId);
    console.log(`File processed for user ${task.userId}`);
    process.stdout.write('Processed file\n');
  } catch (error) {
    console.error(`File processing failed for user ${task.userId}: ${error.message}`);
    process.stdout.write('Process fail\n');
  }
}, 1);

fileQueue.drain(() => {
  console.log('All files have been processed');
  process.stdout.write('All files processed\n');
});

module.exports = fileQueue;
