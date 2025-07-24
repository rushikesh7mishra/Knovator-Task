const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  timestamp: Date,
  totalFetched: Number,
  newJobs: Number,
  updatedJobs: Number,
  failedJobs: [Object],
});

module.exports = mongoose.model('ImportLog', logSchema);
