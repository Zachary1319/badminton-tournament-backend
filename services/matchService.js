const Player = require('../models/player');
const Match = require('../models/Match');
const Tournament = require('../models/Tournament');
const TournamentRound = require('../models/tournamentRound');

class MatchService {
  constructor() {
    this.tournament = new Tournament([]);
  }

  processMatchResults(results) {
    const players = this.createPlayers(results);
    this.tournament = new Tournament(players);
    const rounds = this.createRounds(results, players);
    rounds.forEach(round => this.tournament.addRound(round));
    return this.tournament.rankPlayers();
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

  createRounds(results, players) {
    return Object.values(results).map(roundMatches => {
      const matches = roundMatches.map(match => {
        const player1 = players.find(player => player.name === match.player1);
        const player2 = players.find(player => player.name === match.player2);
        return new Match(player1, player2, match.score1, match.score2);
      });
      return new TournamentRound(matches);
    });
  }

  getScores() {
    const scores = {};
    this.tournament.players.forEach(player => {
      scores[player.name] = player.getScore();
    });
    return scores;
  }
}

module.exports = MatchService;




