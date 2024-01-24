const express = require('express');
const matchController = require('../controllers/matchController');

const router = express.Router();

router.post('/submit-results', matchController.submitMatchResults);

module.exports = router;
