const MatchService = require('../services/matchService');
const Player = require('../models/player');

describe('MatchService', () => {
  let matchService;
  beforeEach(() => {
    matchService = new MatchService();
  });

  describe('processMatchResults', () => {
    it('should correctly calculate and rank players', () => {
      const results = {
        round1: [
          { player1: 'Alice', player2: 'Bob', score1: '21', score2: '19' },
          { player1: 'Charlie', player2: 'Dave', score1: '18', score2: '21' }
        ],
        round2: [
          { player1: 'Alice', player2: 'Charlie', score1: '22', score2: '20' },
          { player1: 'Bob', player2: 'Dave', score1: '17', score2: '21' }
        ]
      };

      const rankings = matchService.processMatchResults(results);
      const expectedRankings = ['Dave', 'Alice', 'Charlie', 'Bob'];

      expect(rankings).toEqual(expectedRankings);
    });
  });

  describe('generateNextRoundPairings', () => {
    it('should correctly generate pairings', () => {
      const expectedPairings = [['Dave', 'Alice'], ['Charlie', 'Bob']];
      const results = {
        round1: [
          { player1: 'Alice', player2: 'Bob', score1: '21', score2: '19' },
          { player1: 'Charlie', player2: 'Dave', score1: '18', score2: '21' }
        ],
        round2: [
          { player1: 'Alice', player2: 'Charlie', score1: '22', score2: '20' },
          { player1: 'Bob', player2: 'Dave', score1: '17', score2: '21' }
        ]
      };
      matchService.processMatchResults(results);
      const pairings = matchService.generateNextRoundPairings();

      expect(pairings).toEqual(expectedPairings);
    });
  });
});

