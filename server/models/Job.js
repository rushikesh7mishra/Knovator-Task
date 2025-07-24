const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobId: { type: String, unique: true },
  title: String,
  description: String,
  company: String,
  location: String,
  datePosted: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model('Job', jobSchema);
