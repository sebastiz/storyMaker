# Story Wheel

A circular story-structure sketchpad. Pick from 14 structures — Three-Act, Save the Cat!, The
Hero's Journey, Freytag's Pyramid, Seven-Point Story Structure, Kishōtenketsu, the Fichtean Curve,
Dan Harmon's Story Circle, the Eight-Sequence Structure, Weiland's Structure, Truby's 22 Steps, the
Pixar Story Spine, The Virgin's Promise, and The Heroine's Journey — and the wheel lays out its
beats, sized by how much of the story each one typically takes up. Click a beat (on the wheel or in
the list) to see its guidance and write the scene. A **Compare** view draws any two structures as
concentric wheels with ribbons linking their matching acts, to see how they relate.

**Live app:** open `index.html` directly, or enable GitHub Pages (Settings → Pages → deploy from
`main`, root) to serve it at `https://sebastiz.github.io/storyMaker/`.

## Features

- **14 structure templates** — from the workhorse Three-Act to Truby's granular 22-step structure —
  each beat comes with a one-line prompt and a three-word example
- **The wheel** — beats drawn as a donut chart sized by their share of the story, colour-coded by
  act (setup / rising action / confrontation / resolution), with an outer ring showing where each
  beat falls on the classic three-act spine, and a live progress count in the hub
- **Compare view** — draw any two structures as concentric wheels; ribbons connect each one's four
  acts to its counterpart in the other, sized by that act's own share of its story
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
