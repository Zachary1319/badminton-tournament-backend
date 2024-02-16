class Tournament {
  constructor(players) {
    this.players = players;
    this.rounds = [];
  }

  addRound(round) {
    this.rounds.push(round);
    round.processRound();
  }
}

module.exports = Tournament;

