class Match {
  constructor(player1, player2, score1, score2) {
    this.player1 = player1;
    this.player2 = player2;
    this.score1 = score1;
    this.score2 = score2;
  }

  processResult() {
    const scoreDiff = parseInt(this.score1) - parseInt(this.score2);
    this.player1.updatePoints(this.score1 > this.score2 ? 1 : 0, scoreDiff);
    this.player2.updatePoints(this.score2 > this.score1 ? 1 : 0, -scoreDiff);
    this.player1.addOpponent(this.player2.name);
    this.player2.addOpponent(this.player1.name);
  }
}

module.exports = Match;
