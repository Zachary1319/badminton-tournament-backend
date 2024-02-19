// In-memory storage for match results, mimicking a simple database
let tournamentsStorage = {};

const matchResultsRepository = {
  saveTournament(tournamentId, tournament) {
    tournamentsStorage[tournamentId] = tournament;
  },

  getTournament(tournamentId) {
    const tournamentData = tournamentsStorage[tournamentId];
    if (!tournamentData) {
      return null;
    }
    return tournamentsStorage[tournamentId];
  },

};

module.exports = matchResultsRepository;
