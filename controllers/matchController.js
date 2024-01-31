const MatchService = require('../services/matchService');
const responseUtils = require('../utils/responseHandler');

const matchService = new MatchService();

exports.submitMatchResults = async (req, res, next) => {
  try {
    const results = req.body;
    const matchId = Date.now().toString();
    matchService.storeMatchResults(matchId, results);
    responseUtils.successResponse(res, 'Match results submitted successfully', { matchId });
  } catch (error) {
    next(error);
  }
};


exports.generateRankings = async (req, res, next) => {
  try {
    const matchId = req.params.matchId;

    try {
      matchService.initializeTournament(matchId);
    } catch (error) {
      return responseUtils.errorResponse(res, 'Match results not found', 404);
    }

    const scores = matchService.getScores();
    const rankings = matchService.getRankings();
    responseUtils.successResponse(res, 'Rankings generated successfully', { scores, rankings });
  } catch (error) {
    next(error);
  }
};

exports.generatePairings = async (req, res, next) => {
  try {
    const matchId = req.params.matchId;
    try {
      matchService.initializeTournament(matchId);
    } catch (error) {
      return responseUtils.errorResponse(res, 'Match results not found', 404);
    }
    const pairings = matchService.generateNextRoundPairings();

    responseUtils.successResponse(res, 'Pairings generated successfully', { pairings });
  } catch (error) {
    next(error);
  }
};

exports.addRoundToTournament = async (req, res, next) => {
  try {
    const matchId = req.params.matchId;
    const newRoundResults = req.body;

    matchService.addNewRoundToTournament(matchId, newRoundResults);

    responseUtils.successResponse(res, 'Round added successfully', { matchId });
  } catch (error) {
    responseUtils.errorResponse(res, 404, error.message);
  }
};







