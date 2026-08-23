# CYSCOM Cyber Arcade — Cipher Case Expo Experience

A single-page, cyber-ops-styled arcade with three fast, beginner-friendly games,
built to run at the CYSCOM booth and funnel students toward **Cipher Case**.

Everything runs client-side. No backend, no database, no server required.

---

## 1. Run it

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

For the expo laptop, build a static production bundle and open it in a
kiosk-mode browser tab:

```bash
npm run build
npm run preview
```

`npm run build` outputs a static `dist/` folder — you can also just point a
static file server (or double-click `dist/index.html`) at it.

---

## 2. What's inside

- **Landing page** — hero, agent name entry, three game cards, Cipher Case
  banner.
- **Phish or Fish?** — 5-round rapid phishing/legit message detector.
- **Password Panic** — 60-second password-building challenge with a real
  client-side strength engine (length, character diversity, word placement,
  common-pattern penalties). Passwords are **never stored or transmitted** —
  only the resulting score is saved locally.
- **Who's the Hacker?** — a short digital-forensics case with 4 suspects and
  4–5 clickable evidence cards. 3 different cases rotate randomly, each with
  exactly one logically correct suspect.
- **Local leaderboard** — nickname + score + game + timestamp only, stored in
  `localStorage`. No emails, phone numbers, or passwords are ever collected.
- **Expo Mode** — toggle in the header (the square icon). While on, the arcade
  auto-returns to the home screen after a period of inactivity.
- **Sound toggle** — synthesized click/success/fail/warning tones via the Web
  Audio API. No external audio files, nothing copyrighted. Defaults to OFF.

---

## 3. Customizing things

All of the knobs below live in **`src/config.js`** unless noted.

| What | Where |
|---|---|
| Cipher Case registration URL | `CIPHER_CASE_URL` in `src/config.js` |
| Expo inactivity timeout | `EXPO_TIMEOUT` (ms) in `src/config.js` |
| Event name / tagline / CTF length | `BRAND` object in `src/config.js` |
| Leaderboard size / storage keys | bottom of `src/config.js` |
| Phishing/safe messages | `src/data/phishingMessages.js` |
| Password word banks | `src/data/passwordChallenges.js` |
| Hacker case files, suspects, evidence | `src/data/hackerCases.js` |
| Colors | `tailwind.config.js` → `theme.extend.colors` |
| Fonts | `src/index.css` (Google Fonts import) + `tailwind.config.js` → `fontFamily` |
| Cyscom logo | Swap the `Terminal` icon in `src/components/Header.jsx` for an `<img>` tag pointing at your logo file in `public/` |

### Adding more phishing rounds
Add an object to the array in `src/data/phishingMessages.js` following the
existing shape (`channel`, `from`, `subject`, `body`, `isPhish`, `reasons`).
The game randomly samples 5 per playthrough, so the pool can grow freely.

### Adding more password word banks
Add another array of 3–4 words to `WORD_BANKS` in
`src/data/passwordChallenges.js`.

### Adding more hacker cases
Copy an existing case object in `src/data/hackerCases.js` and change the
`suspects`, `evidence`, `culprit`, and `explanation` fields. Make sure the
evidence you write actually eliminates every suspect but one — that's what
keeps the case fair and solvable.

---

## 4. Project structure

```
src/
├── components/       # Header, Background, GameCard, Leaderboard, NameEntry,
│                      # CipherCaseBanner, ScoreDisplay (shared results panel)
├── games/
│   ├── PhishOrFish/
│   ├── PasswordPanic/
│   └── WhosTheHacker/
├── data/              # phishingMessages.js, passwordChallenges.js, hackerCases.js
├── utils/             # scoring.js, passwordStrength.js, storage.js, sound.js
├── config.js          # all the "change this before the expo" values
├── App.jsx            # SPA view switching, expo mode, leaderboard state
└── index.css
```

---

## 5. Privacy & security notes

- No real passwords, emails, or phone numbers are ever requested or stored.
- Password Panic's input value never leaves the browser and is discarded the
  moment a score is computed.
- All "phishing" links shown in-game are inert text, not clickable, real URLs.
- The leaderboard only ever writes `{ nickname, score, game, timestamp }` to
  `localStorage`.

---

## 6. Tech stack

React + Vite, Tailwind CSS, Framer Motion, lucide-react. No backend, no
external APIs, no analytics.
