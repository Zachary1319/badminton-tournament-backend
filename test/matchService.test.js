const matchService = require('../services/matchService');

describe('matchService', () => {
  describe('processMatchResults', () => {
    it('should correctly calculate scores', () => {
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

      const expectedScores = {
        'Alice': { primary: 2, secondary: 4 },
        'Bob': { primary: 0, secondary: -6 },
        'Charlie': { primary: 0, secondary: -5 },
        'Dave': { primary: 2, secondary: 7 }
      };

      expect(matchService.processMatchResults(results)).toEqual(expectedScores);
    });
  });

  describe('rankPlayers', () => {
    it('should correctly rank players based on scores', () => {
      const scores = {
        'Alice': { primary: 1, secondary: 2 },
        'Bob': { primary: 0, secondary: -2 }
      };
      const expectedRankings = ['Alice', 'Bob'];
      expect(matchService.rankPlayers(scores)).toEqual(expectedRankings);
    });
  });

  describe('generateNextRoundPairings', () => {
    it('should correctly generate pairings', () => {
      const rankings = ['Alice', 'Bob', 'Charlie', 'Dave'];
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
      const scores = {
        'Alice': { primary: 2, secondary: 4 },
        'Bob': { primary: 0, secondary: -6 },
        'Charlie': { primary: 1, secondary: 0 },
        'Dave': { primary: 1, secondary: 2 }
      };
      const expectedPairings = [
        ['Alice', 'Dave'],
        ['Bob','Charlie']
      ];

      expect(() => matchService.generateNextRoundPairings(rankings, results, scores)).not.toThrow();
      expect(matchService.generateNextRoundPairings(rankings, results, scores)).toEqual(expectedPairings);
    });
  });

});
