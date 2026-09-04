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
- **Character arc lines** — every character (not just the one tracked above) can get a lightweight
  fortune arc: a **-3 to 3** score per shared act, set from four small number fields on the
  Characters tab, plus an "interacts here" checkbox per act. Any character with a non-zero score
  draws a coloured line on a **Character arcs** track in the arrangement view, one polyline per
  character plotted across the same four acts everything else aligns to, coloured by a category
  you pick per character (Protagonist, Antagonist, Ally, Mentor, Love Interest, Foil, Threshold
  Guardian, or Other), with a small legend underneath. A thin dashed line marks any act where two
  or more characters are flagged as interacting there — a visual cue only, not a claim about what
  happens at that point. The track only appears once at least one character has scores set
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
- **The grid** — directly under the timeline, a fixed reference for any plot type: one column per
  act, the act name heading its own bulleted list of the Three-Act Structure's sections (colour-
  coded to match) right underneath — always this same breakdown, regardless of which of the 17
  structures the current story actually uses (that's shown live in the arrangement view above
  instead), so every plot type gets the same simple, concrete reference. Once you've picked a plot
  type and its own example (*Jaws*, *Alice in Wonderland*, *Macbeth*…), that appears as a second
  column split into the same eight Three-Act subsections — not just one paragraph per act, but a
  distinct sentence for Opening Image, Inciting Incident, Reaction to Incident and so on, for every
  one of the 73 plot types. Whenever the story's actual structure isn't the Three-Act Structure
  itself, its own beats appear too, in one more bulleted, act-grouped column of their own — so
  switching to, say, the Hero's Journey adds an "Ordinary World / Call to Adventure…" column
  without disturbing the fixed Three-Act reference the rest of the grid is built on. Every structure
  and plot type separately ships with its own worked
  example too — shown inline in the beat editor as you write, both at once when applicable (*Jaws*
  next to *Die Hard* on the Three-Act Structure, say) — *Star Wars* on the Hero's Journey, *The
  Godfather* on Truby's 22 Steps, *Cinderella* on Propp's 31 Functions… — no picker needed.
  **Every one of the 17 structures and all 73 plot types has at least one worked example** (90 in
  total), each checked programmatically against the target's actual beat/act ids so nothing is
  mismatched or missing. (The character Arc track stays out of this grid — its own reference
  example lives inline in the Arc tab instead.)
- **Beat editor** — a distraction-free textarea per beat with a live word count; the timeline's
  Written track marks which beats have been written
- **Characters** — a roster (name, role, category, one-line notes) alongside the outline, with an
  optional per-act change arc for whichever one is tracked in the timeline, plus lightweight per-act
  arc scores and interaction flags for every character (see Character arc lines, above)
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
