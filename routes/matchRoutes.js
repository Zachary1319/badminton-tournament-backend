const express = require('express');
const matchController = require('../controllers/matchController');

const router = express.Router();

router.post('/matches/results', matchController.submitMatchResults);

router.post('/matches/:matchId/round', matchController.addRoundToTournament);

router.get('/matches/rankings/:matchId', matchController.generateRankings);

router.get('/matches/pairings/:matchId', matchController.generatePairings);

module.exports = router;

