const matchService = require('../services/matchService');
const responseUtils = require('../utils/responseUtils');

exports.submitMatchResults = async (req, res, next) => {
  try {
    const results = req.body;

    const scores = matchService.processMatchResults(results);
    const rankings = matchService.rankPlayers(scores);
    const pairings = matchService.generateNextRoundPairings(rankings, results, scores);

    responseUtils.successResponse(res, 'success', { scores, rankings, pairings });
  } catch (error) {
    next(error);
  }
};


