const MatchService = require('../services/matchService');
const responseUtils = require('../utils/responseHandler');

const matchService = new MatchService();

exports.initializeTournament = async (req, res, next) => {
  try {
    const results = req.body;
    const tournamentId = Date.now().toString();
    matchService.storeMatchResults(tournamentId, results);
    responseUtils.successResponse(res, 'Match results submitted successfully', { tournamentId });
  } catch (error) {
    next(error);
  }
};


exports.generateRankings = async (req, res, next) => {
  try {
    const tournamentId = req.params.tournamentId;
    const scores = matchService.getScores(tournamentId);
    const rankings = matchService.getRankings(tournamentId);
    responseUtils.successResponse(res, 'Rankings generated successfully', { scores, rankings });
  } catch (error) {
    error.status = 404;
    error.message = 'Unable to generate rankings for the tournament.';
    responseUtils.errorResponse(error, req, res, next);
  }
};

exports.generatePairings = async (req, res, next) => {
  try {
    const tournamentId = req.params.tournamentId;
    const pairings = matchService.generateNextRoundPairings(tournamentId);
    responseUtils.successResponse(res, 'Pairings generated successfully', { pairings });
  } catch (error) {
    error.status = 404;
    responseUtils.errorResponse(error, req, res, next);
  }
};


exports.addRoundToTournament = async (req, res, next) => {
  try {
    const tournamentId = req.params.tournamentId;
    const newRoundResults = req.body;

    try {
      matchService.addNewRoundToTournament(tournamentId, newRoundResults);
    } catch (error) {
      error.status = 404;
      responseUtils.errorResponse(error, req, res, next);
    }

    responseUtils.successResponse(res, 'Round added successfully', { tournamentId });
  } catch (error) {
    error.status = 404;
    responseUtils.errorResponse(error, req, res, next);
  }
};







