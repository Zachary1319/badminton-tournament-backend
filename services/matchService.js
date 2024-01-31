const Player = require('../models/player');
const Match = require('../models/Match');
const Tournament = require('../models/Tournament');
const TournamentRound = require('../models/tournamentRound');
const matchResultsRepository = require('../repository/matchResultsRepository');

class MatchService {
  constructor() {
    this.tournament = new Tournament([]);
  }

  initializeTournament(matchId) {
    const results = matchResultsRepository.getResults(matchId);
    if (!results) {
      throw new Error('Match results not found');
    }

    const players = this.createPlayers(results);
    this.tournament = new Tournament(players);
    Object.values(results).forEach(roundResults => {
      const round = this.createRound(roundResults, players);
      this.tournament.addRound(round);
    });
  }

  addMatchRound(results) {
    const round = this.createRound(results, this.tournament.players);
    this.tournament.addRound(round);
  }

  createRound(results, players) {
    const matches = results.map(match => {
      const player1 = players.find(player => player.name === match.player1);
      const player2 = players.find(player => player.name === match.player2);
      return new Match(player1, player2, match.score1, match.score2);
    });
    return new TournamentRound(matches);
  }

  generateNextRoundPairings() {
    return this.tournament.generateNextRoundPairings();
  }

  createPlayers(results) {
    const playerNames = new Set();
    Object.values(results).forEach(round => {
      round.forEach(match => {
        playerNames.add(match.player1);
        playerNames.add(match.player2);
      });
    });

    return Array.from(playerNames).map(name => new Player(name));
  }

  getScores() {
    const scores = {};
    this.tournament.players.forEach(player => {
      scores[player.name] = player.getScore();
    });
    return scores;
  }

  getRankings() {
    return this.tournament.rankPlayers();
  }

  storeMatchResults(matchId, results) {
    matchResultsRepository.saveResults(matchId, results);
  }

  addNewRoundToTournament(matchId, newRoundResults) {
    const existingResults = matchResultsRepository.getResults(matchId);
    if (!existingResults) {
      throw new Error('Tournament not found');
    }
    matchResultsRepository.updateResults(matchId, newRoundResults);
    this.addMatchRound(newRoundResults);
  }
}

module.exports = MatchService;




