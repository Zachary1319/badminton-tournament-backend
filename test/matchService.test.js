const MatchService = require('../services/matchService');
const matchResultsRepository = require('../repository/matchResultsRepository');

jest.mock('../repository/matchResultsRepository', () => ({
  getResults: jest.fn(),
  saveResults: jest.fn(),
  updateResults: jest.fn()
}));

describe('MatchService', () => {
  let matchService;
  const matchId = 'testMatchId';

  beforeEach(() => {
    matchService = new MatchService();
    matchResultsRepository.getResults.mockClear();
    matchResultsRepository.saveResults.mockClear();
    matchResultsRepository.updateResults.mockClear();
  });

  describe('initializeTournament', () => {
    it('should initialize the tournament with match results', () => {
      const results = {
        round1: [
          { player1: 'Alice', player2: 'Bob', score1: '21', score2: '19' },
          { player1: 'Charlie', player2: 'Dave', score1: '18', score2: '21' }
        ]
      };

      matchResultsRepository.getResults.mockReturnValue(results);

      matchService.initializeTournament(matchId);

      expect(matchService.getRankings()).toEqual(['Dave', 'Alice', 'Bob', 'Charlie']);
    });
  });

  describe('addNewRoundToTournament', () => {
    it('should add a new round to the tournament and update rankings', () => {
      const initialResults = {
        round1: [
          { player1: 'Alice', player2: 'Bob', score1: '21', score2: '19' },
          { player1: 'Charlie', player2: 'Dave', score1: '18', score2: '21' }
        ]
      };

      const newRoundResults = {
        round2: [
          { player1: 'Alice', player2: 'Charlie', score1: '22', score2: '20' },
          { player1: 'Bob', player2: 'Dave', score1: '17', score2: '21' }
        ]
      };

      matchResultsRepository.getResults.mockReturnValue(initialResults);
      matchService.initializeTournament(matchId);

      matchResultsRepository.getResults.mockReturnValue({...initialResults, ...newRoundResults});
      matchService.addNewRoundToTournament(matchId, newRoundResults.round2);

      expect(matchService.getRankings()).toEqual(expect.arrayContaining(['Alice', 'Dave', 'Bob', 'Charlie']));
      expect(matchService.generateNextRoundPairings()).toEqual(expect.any(Array)); // Update this based on your logic
    });
  });

});
