const ImportLog = require('../models/ImportLog');

const getImportLogs = async (req, res) => {
  const logs = await ImportLog.find().sort({ timestamp: -1 });
  res.json(logs);
};

module.exports = { getImportLogs };
