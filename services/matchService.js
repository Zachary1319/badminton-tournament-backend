exports.processMatchResults = function(results) {
  let scores = {};

  for (const round in results) {
    results[round].forEach(match => {
      const { player1, player2, score1, score2 } = match;
      const scoreDiff = parseInt(score1) - parseInt(score2);

      if (!scores[player1]) scores[player1] = { primary: 0, secondary: 0 };
      if (!scores[player2]) scores[player2] = { primary: 0, secondary: 0 };

      scores[player1].primary += score1 > score2 ? 1 : 0;
      scores[player1].secondary += scoreDiff;
      scores[player2].primary += score2 > score1 ? 1 : 0;
      scores[player2].secondary -= scoreDiff;
    });
  }

  return scores;
};

exports.rankPlayers = function(scores) {
  return Object.entries(scores)
    .sort((a, b) => b[1].primary - a[1].primary || b[1].secondary - a[1].secondary)
    .map(entry => entry[0]);
};

exports.generateNextRoundPairings = function(rankings, results, scores) {
  const previousRounds = this.createPreviousRounds(results);
  let pairings = [];
  let paired = new Set();

  for (let i = 0; i < rankings.length; i++) {
    if (paired.has(rankings[i])) continue;

    for (let j = i + 1; j < rankings.length; j++) {
      if (paired.has(rankings[j])) continue;

      if (haveFacedEachOther(rankings[i], rankings[j], previousRounds)) continue;

      if (isSecondaryScoreDifferenceAcceptable(rankings[i], rankings[j], scores)) {
        pairings.push([rankings[i], rankings[j]]);
        paired.add(rankings[i]);
        paired.add(rankings[j]);
        break;
      }
    }
  }

  if (pairings.length !== rankings.length / 2) {
    const error = new Error('Pairing Error');
    error.type = 'pairing_failure';
    throw error;
  }

  return pairings;
};

exports.createPreviousRounds = function(results) {
  let previousRounds = {};

  for (const round in results) {
    results[round].forEach(match => {
      const { player1, player2 } = match;

      if (!previousRounds[player1]) previousRounds[player1] = new Set();
      if (!previousRounds[player2]) previousRounds[player2] = new Set();

      previousRounds[player1].add(player2);
      previousRounds[player2].add(player1);
    });
  }

  return previousRounds;
};

function haveFacedEachOther(player1, player2, previousRounds) {
  return previousRounds[player1] && previousRounds[player1].has(player2);
}

function isSecondaryScoreDifferenceAcceptable(player1, player2, scores) {
  const scoreDiff = Math.abs(scores[player1].secondary - scores[player2].secondary);
  return scoreDiff <= 10;
}



