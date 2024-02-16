const MatchService = require('../services/matchService');
const matchResultsRepository = require('../repository/matchResultsRepository');

jest.mock('../repository/matchResultsRepository');

describe('MatchService', () => {
  let matchService;
  const tournamentId = 'testTournamentId';

  const initialResults = {
    round1: [
      { player1: 'Alice', player2: 'Bob', score1: 21, score2: 19 },
      { player1: 'Charlie', player2: 'Dave', score1: 18, score2: 21 }
    ]
  };

  beforeEach(() => {
    matchService = new MatchService();
    jest.clearAllMocks();
  });

  it('should correctly initialize the tournament with initial match results', async () => {
    matchResultsRepository.getResults.mockReturnValue(initialResults);
    const tournament = matchService.initializeTournament(tournamentId);

    expect(tournament.players.length).toBeGreaterThan(0);
  });

  describe('addNewRoundToTournament', () => {
    it('should add a new round to the tournament', async () => {
      const newRoundResults = {
        round2: [
          { player1: 'Alice', player2: 'Charlie', score1: 22, score2: 20 },
          { player1: 'Bob', player2: 'Dave', score1: 17, score2: 21 }
        ]
      };

      matchResultsRepository.getResults.mockResolvedValue(initialResults);
      await matchService.initializeTournament(tournamentId, initialResults);

      matchResultsRepository.updateResults.mockResolvedValue(null);
      await matchService.addNewRoundToTournament(tournamentId, newRoundResults);

      expect(matchResultsRepository.updateResults).toHaveBeenCalledWith(tournamentId, expect.objectContaining(newRoundResults));
    });
  });

  describe('getScores', () => {
    it('should return scores for all players in the tournament', async () => {
      matchResultsRepository.getResults.mockReturnValue(initialResults);
      const tournament = await matchService.initializeTournament(tournamentId, initialResults);

      const scores = matchService.getScores(tournamentId);

      expect(scores).toHaveProperty('Alice');
      expect(scores['Alice']).toHaveProperty('primaryPoints');
      expect(scores['Alice']).toHaveProperty('secondaryPoints');
    });
  });

  describe('getRankings', () => {
    it('should return rankings of all players in the tournament', async () => {
      matchResultsRepository.getResults.mockReturnValue(initialResults);
      const rankings = matchService.getRankings(tournamentId);

      expect(rankings.length).toBeGreaterThan(0);
      expect(rankings[0]).toBe('Dave');
      expect(rankings[1]).toBe('Alice');
    });
  });

  describe('generateNextRoundPairings', () => {
    it('should generate pairings for the next round based on the current results', async () => {
      matchResultsRepository.getResults.mockReturnValue(initialResults);
      const pairings = matchService.generateNextRoundPairings(tournamentId);

      expect(pairings.length).toBeGreaterThan(0);
      expect(pairings[0]).toEqual(expect.arrayContaining(['Dave', 'Alice']));
    });
  });


});
