// Educational, fully client-side password strength engine.
// This does NOT simulate a real crack attempt -- it is a teaching tool that
// rewards good habits (mixing case, spacing symbols out, avoiding straight
// concatenation) and penalizes predictable patterns.

const COMMON_PATTERNS = [
  "password", "123456", "qwerty", "letmein", "admin", "welcome",
  "iloveyou", "abc123", "monkey", "dragon", "football",
];

const KEYBOARD_RUNS = ["qwerty", "asdf", "zxcv", "1234", "4321", "9876"];

function hasSequential(str) {
  const lower = str.toLowerCase();
  for (let i = 0; i < lower.length - 2; i++) {
    const a = lower.charCodeAt(i);
    const b = lower.charCodeAt(i + 1);
    const c = lower.charCodeAt(i + 2);
    if (b - a === 1 && c - b === 1) return true;
    if (a - b === 1 && b - c === 1) return true;
  }
  return false;
}

function hasRepeats(str) {
  return /(.)\1\1/.test(str); // same char 3+ times in a row
}

function longestRepeatRun(str) {
  let max = 1;
  let cur = 1;
  for (let i = 1; i < str.length; i++) {
    if (str[i] === str[i - 1]) {
      cur += 1;
      max = Math.max(max, cur);
    } else {
      cur = 1;
    }
  }
  return max;
}

function countClasses(str) {
  return {
    upper: (str.match(/[A-Z]/g) || []).length,
    lower: (str.match(/[a-z]/g) || []).length,
    digit: (str.match(/[0-9]/g) || []).length,
    symbol: (str.match(/[^A-Za-z0-9]/g) || []).length,
  };
}

// Checks which required words appear (case-insensitive, substring match)
export function checkRequiredWords(password, requiredWords) {
  const lower = password.toLowerCase();
  return requiredWords.map((word) => ({
    word,
    found: lower.includes(String(word).toLowerCase()),
  }));
}

export function meetsBaseRules(password, requiredWords) {
  const classes = countClasses(password);
  const allWordsUsed = checkRequiredWords(password, requiredWords).every((w) => w.found);
  return {
    length: password.length >= 12 && password.length <= 32,
    upper: classes.upper >= 1,
    lower: classes.lower >= 1,
    digit: classes.digit >= 1,
    symbol: classes.symbol >= 1,
    words: allWordsUsed,
  };
}

// Returns { score: 0-1000, label, meterPct, breakdown }
export function evaluatePassword(password, requiredWords, timeRemainingRatio = 1) {
  if (!password) {
    return { score: 0, label: "VERY WEAK", meterPct: 0, breakdown: [] };
  }

  const rules = meetsBaseRules(password, requiredWords);
  const classes = countClasses(password);
  const breakdown = [];
  let score = 0;

  // --- Base requirement points (up to 400) ---
  const ruleValues = [rules.length, rules.upper, rules.lower, rules.digit, rules.symbol, rules.words];
  const rulesMet = ruleValues.filter(Boolean).length;
  const rulePoints = Math.round((rulesMet / ruleValues.length) * 400);
  score += rulePoints;
  breakdown.push({ label: "Rules satisfied", points: rulePoints });

  // --- Length beyond minimum (up to 120) ---
  const extraLen = Math.max(0, Math.min(password.length - 12, 20));
  const lenPoints = Math.round((extraLen / 20) * 120);
  score += lenPoints;
  if (lenPoints > 0) breakdown.push({ label: "Length beyond minimum", points: lenPoints });

  // --- Character diversity (up to 120) ---
  const classCount = [classes.upper, classes.lower, classes.digit, classes.symbol].filter((c) => c > 0).length;
  const diversityPoints = Math.round((classCount / 4) * 120);
  score += diversityPoints;
  breakdown.push({ label: "Character diversity", points: diversityPoints });

  // --- Symbol interleaving bonus (up to 80): reward symbols that sit
  // *between* required words rather than only at the very end ---
  let interleaveBonus = 0;
  const wordPositions = requiredWords
    .map((w) => password.toLowerCase().indexOf(String(w).toLowerCase()))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b);
  for (let i = 0; i < wordPositions.length - 1; i++) {
    const gapStart = wordPositions[i] + String(requiredWords[i]).length;
    const gap = password.slice(gapStart, wordPositions[i + 1]);
    if (/[^A-Za-z0-9]/.test(gap) || /[0-9]/.test(gap)) interleaveBonus += 20;
  }
  interleaveBonus = Math.min(interleaveBonus, 80);
  score += interleaveBonus;
  if (interleaveBonus > 0) breakdown.push({ label: "Words broken up, not chained", points: interleaveBonus });

  // --- Mixed capitalization mid-word bonus (up to 40) ---
  const midWordCaps = requiredWords.some((w) => {
    const idx = password.toLowerCase().indexOf(String(w).toLowerCase());
    if (idx < 0) return false;
    const segment = password.slice(idx, idx + String(w).length);
    return /[A-Z]/.test(segment) && /[a-z]/.test(segment);
  });
  if (midWordCaps) {
    score += 40;
    breakdown.push({ label: "Non-obvious capitalization", points: 40 });
  }

  // --- Time bonus: reward finishing with time on the clock (up to 40) ---
  const timeBonus = Math.round(Math.max(0, timeRemainingRatio) * 40);
  score += timeBonus;
  if (timeBonus > 0) breakdown.push({ label: "Time remaining", points: timeBonus });

  // --- Penalties ---
  const straightConcat = requiredWords.length > 1 &&
    requiredWords.map((w) => String(w)).join("").toLowerCase() === password.toLowerCase();
  if (straightConcat) {
    score -= 200;
    breakdown.push({ label: "Straight concatenation", points: -200 });
  }

  if (hasRepeats(password) || longestRepeatRun(password) >= 3) {
    score -= 60;
    breakdown.push({ label: "Repeated characters", points: -60 });
  }

  if (hasSequential(password)) {
    score -= 60;
    breakdown.push({ label: "Sequential characters", points: -60 });
  }

  const lowerPw = password.toLowerCase();
  if (COMMON_PATTERNS.some((p) => lowerPw.includes(p)) || KEYBOARD_RUNS.some((p) => lowerPw.includes(p))) {
    score -= 120;
    breakdown.push({ label: "Common / predictable pattern", points: -120 });
  }

  // Predictable leetspeak-only substitution (e.g. only a->@, no real change elsewhere)
  const leetOnly = /[@4]/.test(password) && !/[!#$%^&*_\-+=]/.test(password) && classes.symbol <= 1;
  if (leetOnly && classes.symbol > 0) {
    score -= 30;
    breakdown.push({ label: "Predictable substitution only", points: -30 });
  }

  score = Math.max(0, Math.min(1000, Math.round(score)));

  let label = "VERY WEAK";
  if (score >= 850) label = "FORTRESS";
  else if (score >= 650) label = "STRONG";
  else if (score >= 400) label = "FAIR";
  else if (score >= 200) label = "WEAK";

  return { score, label, meterPct: score / 10, breakdown, rules };
}
