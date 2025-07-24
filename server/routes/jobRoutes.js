const express = require('express');
const { getImportLogs } = require('../controllers/jobController');

const router = express.Router();
router.get('/import-logs', getImportLogs);
module.exports = router;
