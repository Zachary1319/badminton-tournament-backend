class Player {
  constructor(name) {
    this.name = name;
    this.primaryPoints = 0;
    this.secondaryPoints = 0;
    this.previousOpponents = new Set();
  }

  updatePoints(primary, secondary) {
    this.primaryPoints += primary;
    this.secondaryPoints += secondary;
  }

  hasFaced(playerName) {
    return this.previousOpponents.has(playerName);
  }

  addOpponent(playerName) {
    this.previousOpponents.add(playerName);
  }

  getScore() {
    return { primary: this.primaryPoints, secondary: this.secondaryPoints };
  }
}

module.exports = Player;
