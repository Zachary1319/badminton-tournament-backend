// In-memory storage for match results, mimicking a simple database
let matchResultsStorage = {};

const matchResultsRepository = {
  saveResults(tournamentId, results) {
    matchResultsStorage[tournamentId] = results;
  },

  getResults(tournamentId) {
    return matchResultsStorage[tournamentId];
  },

  updateResults(tournamentId, newRoundResults) {
    if (matchResultsStorage[tournamentId]) {
      const existingRounds = matchResultsStorage[tournamentId];
      const roundNumbers = Object.keys(existingRounds);
      const lastRoundNumber = roundNumbers.length === 0 ? 0 : Math.max(...roundNumbers.map(round => parseInt(round.replace('round', ''))));
      const nextRoundNumber = 'round' + (lastRoundNumber + 1);

      matchResultsStorage[tournamentId][nextRoundNumber] = newRoundResults;
    }
  }


};

module.exports = matchResultsRepository;
