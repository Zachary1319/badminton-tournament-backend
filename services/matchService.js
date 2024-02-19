const Player = require('../models/player');
const Match = require('../models/Match');
const Tournament = require('../models/Tournament');
const TournamentRound = require('../models/tournamentRound');
const matchResultsRepository = require('../repository/matchResultsRepository');

class MatchService {

  initializeTournament(tournamentId,results) {
    if (!results) {
      throw new Error('Match results not found');
    }
    const players = this.createPlayers(results);
    const tournament = new Tournament(players);
    Object.values(results).forEach(roundResults => {
      const round = this.createRound(roundResults, players);
      tournament.addRound(round);
    });
    return tournament;
  }

  createRound(results, players) {
    const matches = results.map(match => {
      const player1 = players.find(player => player.name === match.player1);
      const player2 = players.find(player => player.name === match.player2);
      return new Match(player1, player2, match.score1, match.score2);
    });
    return new TournamentRound(matches);
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

  getScores(tournamentId) {
    const tournament = matchResultsRepository.getTournament(tournamentId);
    if (!tournament) throw new Error('Tournament not found');
    const scores = {};
    tournament.players.forEach(player => {
      scores[player.name] = {
        primaryPoints: player.primaryPoints,
        secondaryPoints: player.secondaryPoints
      };
    });
    return scores;
  }

  getRankings(tournamentId) {
    const tournament = matchResultsRepository.getTournament(tournamentId);
    if (!tournament) throw new Error('Tournament not found');
    const sortedPlayers = tournament.players.sort((a, b) => b.primaryPoints - a.primaryPoints || b.secondaryPoints - a.secondaryPoints);
    return sortedPlayers.map(player => player.name);
  }

  generateNextRoundPairings(tournamentId) {
    const tournament = matchResultsRepository.getTournament(tournamentId);
    if (!tournament) throw new Error('Tournament not found');
    const pairings = [];
    const paired = new Set();

    const sortedPlayers = tournament.players.sort((a, b) => b.primaryPoints - a.primaryPoints || b.secondaryPoints - a.secondaryPoints);

    for (let i = 0; i < sortedPlayers.length; i++) {
      const player1 = sortedPlayers[i];
      for (let j = i + 1; j < sortedPlayers.length; j++) {
        const player2 = sortedPlayers[j];
        if (!paired.has(player1.name) && !paired.has(player2.name) && !player1.hasFaced(player2.name) && this.isScoreDifferenceAcceptable(player1, player2)) {
          pairings.push([player1.name, player2.name]);
          paired.add(player1.name);
          paired.add(player2.name);
        }
      }
    }
    return pairings;
  }

  storeMatchResults(tournamentId, results) {
    const tournament = this.initializeTournament(tournamentId, results);
    matchResultsRepository.saveTournament(tournamentId, tournament);
  }

  addNewRoundToTournament(tournamentId, newRoundResults) {
    const tournament = matchResultsRepository.getTournament(tournamentId);
    if (!tournament) {
      throw new Error('Tournament not found');
    }
    const round = this.createRound(newRoundResults, tournament.players);
    tournament.addRound(round);
    matchResultsRepository.saveTournament(tournamentId, tournament);
  }

  isScoreDifferenceAcceptable(player1, player2) {
    const scoreDiff = Math.abs(player1.secondaryPoints - player2.secondaryPoints);
    return scoreDiff <= 10;
  }
}

module.exports = MatchService;




