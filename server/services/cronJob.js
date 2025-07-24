const cron = require('node-cron');
const fetchJobs = require('./fetchJobsFromAPI');
const queue = require('../queue');

//Run every hour
cron.schedule('0 * * * *', async () => {
  console.log('🔁 Cron triggered');
  const jobs = await fetchJobs();
  console.log(`🟢 Fetched ${jobs.length} jobs`);
  await queue.add({ jobs });
});
