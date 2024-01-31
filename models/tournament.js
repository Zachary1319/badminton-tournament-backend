class Tournament {
  constructor(players) {
    this.players = players;
    this.rounds = [];
  }

  addRound(round) {
    this.rounds.push(round);
    round.processRound();
  }

  rankPlayers() {
    return this.players.sort((a, b) =>
      b.primaryPoints - a.primaryPoints ||
      b.secondaryPoints - a.secondaryPoints
    ).map(player => player.name);
  }

  generateNextRoundPairings() {
    const sortedPlayers = this.rankPlayers().map(playerName =>
      this.players.find(player => player.name === playerName)
    );

    const pairings = [];
    const paired = new Set();

    for (let i = 0; i < sortedPlayers.length; i++) {
      const player1 = sortedPlayers[i];

      for (let j = i + 1; j < sortedPlayers.length; j++) {
        const player2 = sortedPlayers[j];

        if (!paired.has(player1.name) && !paired.has(player2.name) &&
          !player1.hasFaced(player2.name) &&
          this.isScoreDifferenceAcceptable(player1, player2)) {

          pairings.push([player1.name, player2.name]);
          paired.add(player1.name);
          paired.add(player2.name);
          break;
        }
      }
    }

    return pairings;
  }

  isScoreDifferenceAcceptable(player1, player2) {
    const scoreDiff = Math.abs(player1.secondaryPoints - player2.secondaryPoints);
    return scoreDiff <= 10;
  }
}

module.exports = Tournament;

