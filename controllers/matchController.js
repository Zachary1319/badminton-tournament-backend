const matchService = require('../services/matchService');
const responseUtils = require('../utils/responseHandler');

let matchResultsStorage = {};

exports.submitMatchResults = async (req, res, next) => {
  try {
    const results = req.body;
    const matchId = Date.now().toString();
    matchResultsStorage[matchId] = results;

    responseUtils.successResponse(res, 'Match results submitted successfully', { matchId });
  } catch (error) {
    next(error);
  }
};


exports.generateRankings = async (req, res, next) => {
  try {
    const matchId = req.params.matchId;
    const results = matchResultsStorage[matchId];

    if (!results) {
      return responseUtils.errorResponse(res, 'Match results not found', 404);
    }

    const scores = matchService.processMatchResults(results);
    const rankings = matchService.rankPlayers(scores);

    responseUtils.successResponse(res, 'Rankings generated successfully', { scores, rankings });
  } catch (error) {
    next(error);
  }
};

exports.generatePairings = async (req, res, next) => {
  try {
    const matchId = req.params.matchId;
    const results = matchResultsStorage[matchId];

    if (!results) {
      return responseUtils.errorResponse(res, 'Match results not found', 404);
    }

    const scores = matchService.processMatchResults(results);
    const rankings = matchService.rankPlayers(scores);
    const pairings = matchService.generateNextRoundPairings(rankings, results, scores);

    responseUtils.successResponse(res, 'Pairings generated successfully', { pairings });
  } catch (error) {
    next(error);
  }
};





