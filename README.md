# Story Wheel

A linear story-structure sketchpad, laid out like Ableton Live's Arrangement View. Pick from 17
structures — Three-Act, Save the Cat!, The Hero's Journey, Freytag's Pyramid, Seven-Point Story
Structure, Kishōtenketsu, the Fichtean Curve, Dan Harmon's Story Circle, the Eight-Sequence
Structure, Weiland's Structure, Truby's 22 Steps, the Pixar Story Spine, The Virgin's Promise, The
Heroine's Journey, Todorov's Equilibrium Theory, Frame Narrative, and Propp's 31 Functions — and a
horizontal timeline lays out its beats as clips, sized by how much of the story each one typically
takes up. Click a beat (in the timeline or the list) to see its guidance and write the scene. A
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
  **Plot Type** (a 4-clip track, highlighted where a real example is attached) — a live progress
  count sits above the tracks
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
- **The grid** — below the timeline, one row per act: what the chosen plot type says happens there,
  what a real example (*Jaws*, *Alice in Wonderland*, *Macbeth*…) actually does there, and which
  of the *current* structure's beats fall in that act — so switching structures re-splits the same
  plot type and example across a different, finer set of beats without picking anything again. If
  you've also picked a beat-level "See it in" example, the grid shows it too: each beat, listed
  under its act, gets its own line of *that* story — e.g. pick the Hero's Journey and *Star Wars*
  and the Setup row spells out Luke's ordinary world, his call to adventure, his refusal, and
  meeting Obi-Wan, each under the beat it belongs to
- **See it in** — a second, independent picker (next to the structure timeline) shows a real example
  mapped beat-by-beat onto the whole structure itself — e.g. *Star Wars* onto the Hero's Journey's
  12 beats, *The Godfather* onto Truby's 22 Steps, *Cinderella* onto Propp's 31 Functions —
  surfaced inline in the beat editor and, per beat, in the grid below. **Every one of the 17
  structures and all 73 plot types has at least one worked example** (90 in total), each checked
  programmatically against the target's actual beat/act ids so nothing is mismatched or missing
- **Beat editor** — a distraction-free textarea per beat with a live word count; the timeline and beat
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
