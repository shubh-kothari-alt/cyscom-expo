export const PHISH_TITLES = [
  "SCAM SPOTTER",
  "BAIT BREAKER",
  "THREAT HUNTER",
  "SOCIAL ENGINEER",
  "PHISH FOOD",
];

export function pickPhishTitle(accuracyRatio) {
  if (accuracyRatio >= 0.8) return "THREAT HUNTER";
  if (accuracyRatio >= 0.6) return "SCAM SPOTTER";
  if (accuracyRatio >= 0.4) return "BAIT BREAKER";
  if (accuracyRatio >= 0.2) return "SOCIAL ENGINEER";
  return "PHISH FOOD";
}

export function cyberInstinctLabel(accuracyRatio) {
  if (accuracyRatio >= 0.8) return "SHARP";
  if (accuracyRatio >= 0.5) return "STEADY";
  return "RUSTY";
}

// Round scoring for Phish or Fish.
// correct: boolean, msElapsed: time taken to answer, streak: current streak count
export function scoreRound({ correct, msElapsed, streak }) {
  if (!correct) return { points: -20, breakdown: [{ label: "Incorrect", points: -20 }] };
  const breakdown = [{ label: "Correct", points: 100 }];
  let points = 100;
  if (msElapsed <= 4000) {
    points += 50;
    breakdown.push({ label: "Fast answer", points: 50 });
  }
  if (streak >= 2) {
    const streakBonus = Math.min(streak * 15, 60);
    points += streakBonus;
    breakdown.push({ label: `Streak x${streak}`, points: streakBonus });
  }
  return { points, breakdown };
}
