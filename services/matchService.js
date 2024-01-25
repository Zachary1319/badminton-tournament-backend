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

  rankings.forEach(player => {
    if (paired.has(player)) return;

    const potentialPair = rankings.find(potentialPair =>
      isEligibleForPairing(player, potentialPair, paired, previousRounds, scores));

    if (potentialPair) {
      pairings.push([player, potentialPair]);
      paired.add(player);
      paired.add(potentialPair);
    }
  });

  if (pairings.length !== rankings.length / 2) {
    throw new Error('Unable to generate valid pairings for all players');
  }

  return pairings;
};

function isEligibleForPairing(player, potentialPair, paired, previousRounds, scores) {
  return !paired.has(potentialPair) &&
    !haveFacedEachOther(player, potentialPair, previousRounds) &&
    isSecondaryScoreDifferenceAcceptable(player, potentialPair, scores);
}

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



