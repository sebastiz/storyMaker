# Story Wheel

A circular story-structure sketchpad. Pick a structure — Three-Act, Save the Cat!, The Hero's
Journey, Freytag's Pyramid, Seven-Point Story Structure, or Kishōtenketsu — and the wheel lays out
its beats, sized by how much of the story each one typically takes up. Click a beat (on the wheel
or in the list) to see its guidance and write the scene.

**Live app:** open `index.html` directly, or enable GitHub Pages (Settings → Pages → deploy from
`main`, root) to serve it at `https://sebastiz.github.io/storymaker/`.

## Features

- **Six structure templates** — Three-Act, Save the Cat! (15 beats), The Hero's Journey (12
  stages), Freytag's Pyramid, the Seven-Point Story Structure, and Kishōtenketsu — each beat comes
  with a one-line prompt explaining what it's for
- **The wheel** — beats drawn as a donut chart sized by their share of the story, colour-coded by
  act (setup / rising action / confrontation / resolution), with a live progress count in the hub
- **Beat editor** — a distraction-free textarea per beat with a live word count; the wheel and beat
  list mark which beats have been written
- **Characters** — a simple roster (name, role, one-line notes) alongside the outline
- **Logline & notes** — a genre field and a logline/premise textarea per story
- **My Stories** — keep multiple stories side by side, switch, rename, duplicate or delete them
- **Export** — write the whole outline out as a Markdown file
- Sketches persist via `localStorage`. The app is an installable PWA — on iPhone, open the site in
  Safari and Add to Home Screen for a full-screen, offline-capable app.

## Development

`src/story-wheel.jsx` is the source of truth — a single-file React component. `src/structures.js`
holds the structure-template data. `index.html` is the pre-compiled build (React from CDN +
minified app); that's what gets deployed.

```bash
npm install
npm run build   # rebuilds index.html from src/
```

## License

MIT
