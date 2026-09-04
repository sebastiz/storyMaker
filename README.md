# Story Wheel

A circular story-structure sketchpad. Pick from 17 structures — Three-Act, Save the Cat!, The
Hero's Journey, Freytag's Pyramid, Seven-Point Story Structure, Kishōtenketsu, the Fichtean Curve,
Dan Harmon's Story Circle, the Eight-Sequence Structure, Weiland's Structure, Truby's 22 Steps, the
Pixar Story Spine, The Virgin's Promise, The Heroine's Journey, Todorov's Equilibrium Theory, Frame
Narrative, and Propp's 31 Functions — and the wheel lays out its beats, sized by how much of the
story each one typically takes up. Click a beat (on the wheel or in the list) to see its guidance
and write the scene. A **Compare** view draws any two structures as concentric wheels with ribbons
linking their matching acts, to see how they relate.

**Live app:** open `index.html` directly, or enable GitHub Pages (Settings → Pages → deploy from
`main`, root) to serve it at `https://sebastiz.github.io/storyMaker/`.

## Features

- **17 structure templates** — from the workhorse Three-Act to Propp's 31-function folk-tale
  morphology — each beat comes with a one-line prompt and a three-word example
- **The wheel** — beats drawn as a donut chart sized by their share of the story, colour-coded by
  act (setup / rising action / confrontation / resolution), with an outer ring showing where each
  beat falls on the classic three-act spine, and a live progress count in the hub
- **Compare view** — draw any two structures as concentric wheels; ribbons connect each one's four
  acts to its counterpart in the other, sized by that act's own share of its story
- **Plot type** — tag a story with a plot-type taxonomy: Booker's 7 Basic Plots, Tobias' 20 Master
  Plots, Polti's 36 Dramatic Situations, Vonnegut's 6 Story Shapes, or the MICE Quotient (73
  entries total, grouped by taxonomy in the picker). A panel below the wheel shows what that
  archetype typically does at each of the four acts, and the beat editor surfaces the matching
  line for whichever beat is selected — works with any of the 17 structures, since it maps onto
  the acts they all share rather than onto specific beats
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
