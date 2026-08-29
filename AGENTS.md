# AGENTS.md

Quick-start notes for future Kilo sessions in this repo. Keep this file tight — every line should answer "would an agent miss this without help?".

## Project shape

- Single-page React 18 + Vite 6 app, no monorepo, no tests.
- Live site: `https://aviteshmurmu19.github.io/TuneStream/` (GitHub Pages, branch `gh-pages`).
- The `name` in `package.json` is still `elagant-music-app` (legacy) — do not "fix" it; the Vite `base` and the GitHub repo are the sources of truth for the public name.

## Commands

| Task | Command |
| --- | --- |
| Dev server | `npm run dev` |
| Production build | `npm run build` (output in `dist/`) |
| Preview build locally | `npm run preview` |
| Deploy to GitHub Pages | `npm run deploy` (runs `predeploy` → `npm run build` → `scripts/deploy-gh-pages.mjs`) |
| Lint | `npx eslint src` (no `lint` script is wired up) |
| Type check | not configured (no TS) |

There is no test runner, no formatter script, no typecheck. Do not invent one.

## Hard constraints

- **`base: '/TuneStream/'` in `vite.config.js` and `<Router basename={import.meta.env.BASE_URL}>` in `src/index.jsx` must stay in sync.** They are the reason direct links like `/TuneStream/top-charts` resolve correctly. If you fork the repo, change both to match the new repo name.
- **`dist/` is in `.gitignore` but is also tracked on `main` via `git add -f dist`.** That is intentional — `main` carries a snapshot of the latest build alongside the source, and the `gh-pages` branch carries the same `dist/` contents at the root (no `dist/` subfolder). Never `git rm` it without a replacement.
- **`src/assets/TuneStream Logo.png` is the brand logo.** It is referenced from `src/assets/index.js` (`import logo from './TuneStream Logo.png'`) and from `README.md`. The legacy `logo.svg` is unused but still in the tree — leave it.
- **File paths with spaces** (`"TuneStream Logo.png"`) must be quoted when used with `git add` from PowerShell. The same applies when piping the path into other tools.

## Data layer quirks

- `src/redux/services/shazamCore.js` exposes an RTK Query API. Most endpoints (`getTopCharts`, `getSongsByGenre`, `getSongDetails`, `getSongRelated`) use `queryFn` to serve from a **bundled Apple Music JSON snapshot** (`topChartsData.json`, `getSongsByGenreData.json`) — not the live Shazam API. The live RapidAPI endpoints (`getSongsByCountry`, `getSongsBySearch`, `getArtistDetails`) are still wired through `fetchBaseQuery` and will 429/403 without a key.
- `src/redux/services/normalize.js` maps the Apple Music shape (`attributes.name`, `attributes.artistName`, `attributes.artwork.url`, `attributes.previews[0].url`, `id`, `relationships.artists.data[].id`) into the legacy Shazam UI fields (`title`, `subtitle`, `images.coverart`, `key`, `artists[0].adamid`, `hub.actions[1].uri`). The audio element in `src/components/MusicPlayer/Player.jsx` reads `activeSong?.hub?.actions?.[1]?.uri` and depends on this mapping — if you change the normalizer, also update the player (or vice versa).
- No `sections[1].text` (lyrics) in the Apple data. `SongDetails.jsx` gracefully falls back to "Sorry, No lyrics found!" — do not treat that as a bug.
- Audio previews come from `audio-ssl.itunes.apple.com` 30s m4a clips. Browsers require a user gesture before `<audio>.play()` will start; the `useEffect`-based play/pause in `Player.jsx` already swallows the resulting `NotAllowedError`.

## Deploy script gotchas (`scripts/deploy-gh-pages.mjs`)

- Requires the `gh-pages` branch to already exist on `origin` — first-time setup is `git push origin main:gh-pages --force` after enabling Pages on that branch in repo settings.
- Builds in a **throwaway worktree** under `%TEMP%` so the main checkout's working tree is never disturbed. Don't replace this with a plain `git checkout gh-pages` in the main checkout — that is how the previous session accidentally staged `node_modules`.
- Force-pushes `gh-pages`; commits land with the local `git config user.name` / `user.email` (set globally to the repo owner, no need for `-c` overrides).
- If `dist/` is unchanged it prints "No changes to deploy." and exits 0 without making a commit — safe to wire into CI.

## Conventions

- ESM throughout (`"type": "module"` in `package.json`, `vite.config.js` uses `import`, scripts are `.mjs`).
- Styling is Tailwind only; no CSS modules. Custom keyframes live in `tailwind.config.cjs` (`slideup`, `slidedown`, `slideleft`, `slideright`, `wave`, `slowfade`).
- Icons come from `react-icons` (Heroicons + Remix set). Don't add a new icon library.
- ESLint config is Airbnb (`eslint-config-airbnb`) plus `react` / `react-hooks` / `jsx-a11y` / `import` plugins. No Prettier.
- No tests, no snapshots, no fixtures, no CI workflow file. If you add any, wire them through `package.json` scripts so the new agent doesn't have to guess.

## Things an agent might wrongly "fix"

- Renaming `package.json#name` to `tunestream` — leave it, the live name comes from the GitHub repo and `vite.config.js#base`.
- Deleting `dist/` from `main` — it's tracked on purpose.
- Switching the data layer back to a real Shazam API call for `getSongDetails` / `getSongRelated` — they intentionally use the local snapshot to avoid 429s and broken `v1/v1/...` URLs.
- Removing `dist/assets/TuneStream Logo-*.png` because it "looks like a build artifact" — the brand logo in the deployed bundle is intentional.
