const express = require('express');
const matchController = require('../controllers/matchController');

const router = express.Router();

router.post('/tournaments', matchController.initializeTournament);

router.post('/tournaments/:tournamentId/rounds', matchController.addRoundToTournament);

router.get('/tournaments/:tournamentId/rankings', matchController.generateRankings);

router.get('/tournaments/:tournamentId/pairings', matchController.generatePairings);

module.exports = router;

