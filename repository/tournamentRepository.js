// In-memory storage for match results, mimicking a simple database
let tournamentsStorage = {};

const tournamentRepository = {
  saveTournament(tournamentId, tournament) {
    tournamentsStorage[tournamentId] = tournament;
  },

  getTournamentById(tournamentId) {
    const tournamentData = tournamentsStorage[tournamentId];
    if (!tournamentData) {
      return null;
    }
    return tournamentsStorage[tournamentId];
  },

};

module.exports = tournamentRepository;
