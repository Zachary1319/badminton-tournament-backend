const MatchService = require('../services/tournamentService');
const tournamentRepository = require('../repository/tournamentRepository');

jest.mock('../repository/tournamentRepository');

describe('MatchService', () => {
  let matchService;
  const fakeTournament = {
    players: [
      { name: 'Alice', primaryPoints: 5, secondaryPoints: 30 },
      { name: 'Bob', primaryPoints: 3, secondaryPoints: 20 },
      { name: 'Charlie', primaryPoints: 2, secondaryPoints: 10 },
      { name: 'David', primaryPoints: 4, secondaryPoints: 25 }
    ],
    addRound: jest.fn()
  };
  beforeEach(() => {
    matchService = new MatchService();
    tournamentRepository.getTournamentById.mockReturnValue(fakeTournament);
    jest.clearAllMocks();
  });

  describe('MatchService with two rounds', () => {
    it('initializes tournament and adds a new round correctly', async () => {
      const initialResults = {
        "round1": [
          {"player1": "Alice", "player2": "Bob", "score1": 25, "score2": 15},
          {"player1": "Charlie", "player2": "David", "score1": 20, "score2": 22}
        ]
      };
      const newRoundResults = {
        "round2": [
          {"player1": "Alice", "player2": "David", "score1": 22, "score2": 20},
          {"player1": "Bob", "player2": "Charlie", "score1": 18, "score2": 21}
        ]
      };

      matchService.storeMatchResults('testTournamentId', initialResults);

      expect(tournamentRepository.saveTournament).toHaveBeenCalledWith('testTournamentId', expect.any(Object));

      matchService.addNewRoundToTournament('testTournamentId', newRoundResults['round2']);

      expect(tournamentRepository.saveTournament).toHaveBeenCalledWith('testTournamentId', expect.any(Object));
    });

    it('getScores returns correct scores for all players', () => {
      const scores = matchService.getScores('fakeTournamentId');
      expect(scores).toEqual({
        Alice: { primaryPoints: 5, secondaryPoints: 30 },
        Bob: { primaryPoints: 3, secondaryPoints: 20 },
        Charlie: { primaryPoints: 2, secondaryPoints: 10 },
        David: { primaryPoints: 4, secondaryPoints: 25 }
      });
    });

    it('getRankings returns players sorted by their scores', () => {
      const rankings = matchService.getRankings('fakeTournamentId');
      expect(rankings).toEqual(['Alice', 'David', 'Bob', 'Charlie']);
    });
  });

});
