class TournamentRound {
  constructor(matches) {
    this.matches = matches;
  }

  processRound() {
    this.matches.forEach(match => match.processResult());
  }
}

module.exports = TournamentRound;
