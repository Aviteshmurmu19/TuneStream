<div align="center">

<img src="src/assets/logo.svg" alt="TuneStream logo" align="center" height="96" />

# TuneStream

**A modern music streaming UI built with React, Redux Toolkit and Tailwind CSS.**

[![Live demo](https://img.shields.io/badge/demo-aviteshmurmu19.github.io%2FTuneStream-blueviolet?style=flat-square&logo=github)](https://aviteshmurmu19.github.io/TuneStream/)
[![Build](https://img.shields.io/badge/build-vite-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-1.8-764abc?style=flat-square&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

Discover tracks by genre, browse top charts and artists, search for songs, and play previews — all wrapped in a Spotify-inspired dark UI.

[Live demo](https://aviteshmurmu19.github.io/TuneStream/) · [Features](#features) · [Getting started](#getting-started) · [Project structure](#project-structure) · [Tech stack](#tech-stack)

</div>

> [!NOTE]
> TuneStream is a front-end showcase. Music data is served from the [Shazam Core](https://rapidapi.com/apidojo/api/shazam-core/) RapidAPI endpoint when an API key is configured, with a bundled Apple Music JSON snapshot used as an offline fallback so the app keeps working without a key or when the upstream API rate-limits.

## Features

- **Discover by genre** — pick from a curated list of genres and explore a feed of tracks.
- **Top Charts & Top Artists** — see what's trending, with a horizontally scrollable artist carousel powered by [Swiper](https://swiperjs.com/).
- **Search** — find songs by title or artist via the search bar.
- **Song details** — open a track to see artwork, artist link, lyrics when available, and a list of related songs.
- **Sticky audio player** — play 30-second previews, pause/skip, and watch the active track surface in the bottom player.
- **Responsive layout** — sidebar navigation on desktop, slide-in menu on mobile.
- **Offline-friendly data layer** — when the live API is unavailable, queries resolve from a local JSON snapshot, so navigation never breaks.
- **Deployed to GitHub Pages** — the `vite` build is configured with `base: '/TuneStream/'` and `react-router` runs with the matching `basename`, so direct links to sub-routes work.

## Screenshots

| Discover | Top Charts | Song details |
| --- | --- | --- |
| Browse genres and trending tracks | See the top 5 right from the home sidebar | Open a track to play its preview and explore related songs |

> [!TIP]
> Want to see it in action? Head over to the [live demo](https://aviteshmurmu19.github.io/TuneStream/).

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) **18+** (Node 20 LTS recommended)
- npm 9+ (or your favourite package manager)

### Install

```bash
git clone https://github.com/Aviteshmurmu19/TuneStream.git
cd TuneStream
npm install
```

### Configure environment variables (optional)

The app ships with an offline data fallback, so you can run it without any API keys. To enable the live Shazam Core API, copy the example file and fill in your key:

```bash
cp .env.example .env
```

```env
VITE_SHAZAM_CORE_RAPID_API_KEY=your_rapidapi_key_here
VITE_GEO_API_KEY=your_geo_api_key_here
```

> [!IMPORTANT]
> Never commit your `.env` file. It's already covered by the project's `.gitignore`.

### Run the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview
```

The production bundle is emitted to `dist/`.

## Project structure

```
src/
├── App.jsx              # Top-level layout: sidebar, routes, music player
├── index.jsx            # React entry — wraps the app in <Provider> + <Router>
├── index.css            # Tailwind layers and custom keyframes
├── assets/              # Logo, favicon, loader, genre constants
├── components/          # Reusable UI (SongCard, Sidebar, MusicPlayer, ...)
│   └── MusicPlayer/     # Sticky bottom player + controls
├── pages/               # Route-level views
│   ├── Discover.jsx     # Genre picker + song grid (home)
│   ├── TopCharts.jsx    # Full top-charts list
│   ├── TopArtists.jsx   # Top artists grid
│   ├── AroundYou.jsx    # Country-aware charts
│   ├── Search.jsx       # Search results
│   ├── SongDetails.jsx  # Single track + related songs
│   └── ArtistDetails.jsx
└── redux/
    ├── features/
    │   └── playerSlice.js   # Active song, isPlaying, queue
    └── services/
        ├── shazamCore.js    # RTK Query API (live + fallback)
        ├── normalize.js     # Maps the Apple Music JSON shape to the Shazam-shaped UI fields
        ├── topChartsData.json
        └── getSongsByGenre.json
```

## Tech stack

- **[React 18](https://react.dev/)** — UI library
- **[Vite 6](https://vitejs.dev/)** — dev server and bundler
- **[Redux Toolkit](https://redux-toolkit.js.org/)** + [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) — state management and data fetching
- **[React Router 6](https://reactrouter.com/)** — client-side routing (with `basename` for GitHub Pages)
- **[Tailwind CSS 3](https://tailwindcss.com/)** — utility-first styling
- **[Swiper](https://swiperjs.com/)** — touch slider for the Top Artists carousel
- **[react-icons](https://react-icons.github.io/react-icons/)** — icon set
- **[Shazam Core](https://rapidapi.com/apidojo/api/shazam-core/) via RapidAPI** — music data source (with a bundled JSON fallback)

## Deployment

TuneStream is set up to deploy to **GitHub Pages** from the `gh-pages` branch.

```bash
npm run build
git add -f dist
git commit -m "Deploy"
git push origin main
# Force-push dist to the gh-pages branch
git push origin <main>:gh-pages --force
```

> [!TIP]
> The `vite.config.js` `base: '/TuneStream/'` setting and the matching `<Router basename={import.meta.env.BASE_URL}>` keep asset URLs and client-side routes in sync when the app is hosted under a project page (e.g. `https://<user>.github.io/TuneStream/`).

## FAQ

<details>
<summary><b>The site loads but the sidebar links send me to the wrong place.</b></summary>
Make sure your `Router` is configured with the same basename as `vite.config.js` `base`. Both are wired up here, so if you fork the project, keep them in sync with your repository name.
</details>

<details>
<summary><b>Song details show "Sorry, No lyrics found!"</b></summary>
The bundled offline snapshot doesn't include lyrics. If you wire up a real Shazam Core API key in `.env`, tracks that return lyrics from the upstream API will display them.
</details>

<details>
<summary><b>I'm hitting 429 / 403 on the Shazam endpoints.</b></summary>
The public Shazam Core tier is heavily rate-limited. The app automatically falls back to the bundled JSON dataset for song details and related tracks, so navigation stays smooth.
</details>

## Acknowledgements

- Inspired by the JavaScript Mastery [Lyriks](https://github.com/adrianhajdin/project_music_player) project.
- Track artwork and metadata courtesy of the Apple Music JSON snapshot used as a fallback dataset.
- Built with the amazing open-source web tooling listed in [Tech stack](#tech-stack).
