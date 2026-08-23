export const WORD_BANKS = [
  ["BLUE", "CRYSTAL", "HEISENBERG", "99"],
  ["POLLOS", "BATTER", "GUSTAVO", "505"],
  ["RICIN", "STEVIA", "CHAMOMILE", "16"],
  ["VAMONOS", "PEST", "TENT", "308"],
  ["METHYLAMINE", "BARREL", "BEE", "737"],
  ["LAWYER", "SAUL", "BURNER", "50"],
];

export function getRandomWordBank() {
  return WORD_BANKS[Math.floor(Math.random() * WORD_BANKS.length)];
}