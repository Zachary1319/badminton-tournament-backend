const matchService = require('../services/matchService');
const responseUtils = require('../utils/responseUtils');

exports.submitMatchResults = async (req, res, next) => {
  try {
    const results = req.body;
    console.log(results);

    const scores = matchService.processMatchResults(results);
    console.log(scores);

    const rankings = matchService.rankPlayers(scores);

    const previousRounds = matchService.createPreviousRounds(results);

    const pairings = matchService.generateNextRoundPairings(rankings, previousRounds, scores);

    responseUtils.successResponse(res, 'success', { scores, rankings, pairings });
  } catch (error) {
    next(error);
  }
};


