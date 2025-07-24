const Bull = require('bull');
const jobQueue = new Bull('jobQueue', process.env.REDIS_URL);
module.exports = jobQueue;
