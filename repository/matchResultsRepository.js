// In-memory storage for match results, mimicking a simple database
let matchResultsStorage = {};

const matchResultsRepository = {
  saveResults(matchId, results) {
    matchResultsStorage[matchId] = results;
  },

  getResults(matchId) {
    return matchResultsStorage[matchId];
  },

  updateResults(matchId, newRoundResults) {
    if (matchResultsStorage[matchId]) {
      const existingRounds = matchResultsStorage[matchId];
      const roundNumbers = Object.keys(existingRounds);
      const lastRoundNumber = roundNumbers.length === 0 ? 0 : Math.max(...roundNumbers.map(round => parseInt(round.replace('round', ''))));
      const nextRoundNumber = 'round' + (lastRoundNumber + 1);

      matchResultsStorage[matchId][nextRoundNumber] = newRoundResults;
    }
  }


};

module.exports = matchResultsRepository;
