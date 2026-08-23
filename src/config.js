// ─────────────────────────────────────────────────────────────
// CYSCOM CYBER ARCADE — GLOBAL CONFIG
// Edit the values below to reskin / retarget the arcade.
// ─────────────────────────────────────────────────────────────

// Where "SCAN TO REGISTER" / "LEARN MORE" buttons should point.
// Replace with the real Cipher Case registration link before the expo.
export const CIPHER_CASE_URL = "YOUR_URL_HERE";

// How long (ms) the arcade waits with no input before it resets
// to the home screen. Only active while EXPO MODE is on.
export const EXPO_TIMEOUT = 60000;

// Brand strings — change these if the event name/tagline changes.
export const BRAND = {
  org: "CYSCOM",
  event: "CIPHER CASE",
  tagline: "24 HOURS. ONE CASE. ZERO ESCAPE.",
  ctfLength: "24-HOUR CTF",
};

// Leaderboard settings
export const LEADERBOARD_SIZE = 10; // how many entries to show
export const LEADERBOARD_STORAGE_KEY = "cyscom_arcade_leaderboard_v1";
export const PLAYER_STORAGE_KEY = "cyscom_arcade_player_v1";
export const STATS_STORAGE_KEY = "cyscom_arcade_stats_v1";
