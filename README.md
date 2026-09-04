# Story Wheel

A linear story-structure sketchpad, laid out like Ableton Live's Arrangement View. Pick from 17
structures — Three-Act, Save the Cat!, The Hero's Journey, Freytag's Pyramid, Seven-Point Story
Structure, Kishōtenketsu, the Fichtean Curve, Dan Harmon's Story Circle, the Eight-Sequence
Structure, Weiland's Structure, Truby's 22 Steps, the Pixar Story Spine, The Virgin's Promise, The
Heroine's Journey, Todorov's Equilibrium Theory, Frame Narrative, and Propp's 31 Functions — and a
horizontal timeline lays out its beats as clips, sized by how much of the story each one typically
takes up. Click a beat to see its guidance and write the scene. A
**Compare** view stacks any two of them — structures, plot types, or one of each — as two
horizontal tracks with ribbons linking their matching acts, to see how they relate.

**Live app:** open `index.html` directly, or enable GitHub Pages (Settings → Pages → deploy from
`main`, root) to serve it at `https://sebastiz.github.io/storyMaker/`.

## Features

- **17 structure templates** — from the workhorse Three-Act to Propp's 31-function folk-tale
  morphology — each beat comes with a one-line prompt and a three-word example
- **The timeline** — a genuine Ableton Arrangement View, horizontal tracks stacked top to bottom
  over one shared timeline: **Beats** (the main track, clips sized by each beat's share of the
  story and colour-coded by act), **Written** (a thin per-beat lane of filled clips vs. empty
  slots), **Acts** (the three-act spine as a 3-clip summary track), and, once you've picked one,
  **Arc** (a character's change arc as a 4-clip track — see below) — a live progress count sits
  above the tracks
- **Character arcs** — track one character's arc right in the arrangement view: pick them from the
  Characters tab and a 4-clip **Arc** track appears alongside Beats/Written/Acts, one clip per
  shared act (Setup/Rising Action/Confrontation/Resolution), each prompted with a stock stage of a
  change arc — who they are before the story disrupts them, how they change while pursuing the
  goal, the test that forces a real choice, who they've become. Click a clip to write that stage in
  a dedicated Arc tab next to the beat editor; only one character is tracked at a time, keeping the
  timeline readable. A worked reference is shown automatically alongside your own notes — Scrooge's
  transformation in *A Christmas Carol*, act by act — both inline in the Arc tab and as its own
  column in the grid, the same "no picker needed" treatment every other example in the app gets
- **Compare view** — stack any two structures, plot types, or a structure against a plot type, as
  two horizontal tracks; ribbons connect each one's four acts to its counterpart in the other,
  sized by that act's own share of its story (a plot type's four acts are conceptual, so its
  segments are always even — it's the shape of its ribbons meeting a structure's real proportions
  that's worth reading)
- **Plot type** — a picker at the top of the page tags the story with a plot-type taxonomy:
  Booker's 7 Basic Plots, Tobias' 20 Master Plots, Polti's 36 Dramatic Situations, Vonnegut's 6
  Story Shapes, or the MICE Quotient (73 entries total, grouped by taxonomy). It works with any of
  the 17 structures at once, since it maps onto the four acts they all share rather than onto
  specific beats
- **The grid** — directly under the timeline, one row per act: what the chosen plot type says
  happens there, what a real example (*Jaws*, *Alice in Wonderland*, *Macbeth*…) actually does
  there, which of the *current* structure's beats fall in that act, and — its own column — the
  parts of a real literary/film example that correspond to those exact beats. Every structure
  ships with one worked example (*Star Wars* on the Hero's Journey, *The Godfather* on Truby's 22
  Steps, *Cinderella* on Propp's 31 Functions…), shown automatically — no picker needed — both
  inline in the beat editor and, spelled out beat by beat, right here in the grid; switching
  structures re-splits the same plot type, example, and literature column across a different,
  finer set of beats without picking anything again. **Every one of the 17 structures and all 73
  plot types has at least one worked example** (90 in total), each checked programmatically
  against the target's actual beat/act ids so nothing is mismatched or missing
- **Beat editor** — a distraction-free textarea per beat with a live word count; the timeline's
  Written track marks which beats have been written
- **Characters** — a simple roster (name, role, one-line notes) alongside the outline, with an
  optional per-act change arc for whichever one is tracked in the timeline
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
