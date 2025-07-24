const axios = require('axios');
const xml2js = require('xml2js');

const fetchJobs = async () => {
  try {
    const { data: xmlData } = await axios.get(process.env.API_URL, {
      headers: { 'Accept': 'application/xml' },
      timeout: 10000,
    });

    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xmlData);

    const jobs = result?.rss?.channel?.item;

    return Array.isArray(jobs) ? jobs : jobs ? [jobs] : [];
  } catch (err) {
    console.error('❌ Failed to fetch or parse job feed:', err.message);
    return [];
  }
};

module.exports = fetchJobs;
