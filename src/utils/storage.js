import { supabase } from './supabase';

const PLAYER_KEY = "cyscom_player";

// Keep player session local
export function getPlayerName() {
  return localStorage.getItem(PLAYER_KEY) || "";
}

export function setPlayerName(name) {
  if (!name) {
    localStorage.removeItem(PLAYER_KEY);
  } else {
    localStorage.setItem(PLAYER_KEY, name);
  }
}

// Fetch the leaderboard from Supabase
export async function getLeaderboard() {
  const { data, error } = await supabase
    .from('scores')
    .select('nickname, game, score');

  if (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }

  // Aggregate scores by agent
  const agentTotals = {};
  data.forEach(entry => {
    // If the player played the same game multiple times, keep the highest score
    const key = `${entry.nickname}_${entry.game}`;
    if (!agentTotals[key] || entry.score > agentTotals[key].score) {
      agentTotals[key] = { nickname: entry.nickname, score: entry.score };
    }
  });

  // Sum up all highest game scores for each player
  const finalScores = {};
  Object.values(agentTotals).forEach(entry => {
    if (!finalScores[entry.nickname]) finalScores[entry.nickname] = 0;
    finalScores[entry.nickname] += entry.score;
  });

  return Object.keys(finalScores)
    .map(nickname => ({ nickname, score: finalScores[nickname] }))
    .sort((a, b) => b.score - a.score);
}

// Push a new score to Supabase
export async function addLeaderboardEntry({ nickname, score, game }) {
  const { error } = await supabase
    .from('scores')
    .insert([{ nickname, score, game }]);

  if (error) console.error("Error saving score:", error);
  
  // Return the updated leaderboard
  return await getLeaderboard();
}

// Calculate combined score for a single player (for the landing page)
export async function getCombinedScore(nickname) {
  if (!nickname) return 0;
  const board = await getLeaderboard();
  const player = board.find(p => p.nickname === nickname);
  return player ? player.score : 0;
}