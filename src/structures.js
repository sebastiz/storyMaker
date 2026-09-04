// Story-structure templates. Each beat carries `pct` (its share of the wheel / the story's total
// length) and `act` (a coarse phase used only for colour — Setup / Confrontation / Resolution,
// or a template's own equivalent) so differently-shaped structures still read as one system.

export const ACTS = {
  setup:  { label: "Setup",         color: "#5FA8A0" },
  rise:   { label: "Rising Action", color: "#E9C88A" },
  climax: { label: "Confrontation", color: "#D2785A" },
  fall:   { label: "Resolution",    color: "#8E7CC3" },
};

export const STRUCTURES = [
  {
    id: "three-act",
    name: "Three-Act Structure",
    blurb: "The workhorse: setup, confrontation, resolution. Good default for almost any story.",
    beats: [
      { id: "status-quo",   name: "Opening Image",     pct: 5,  act: "setup",  guide: "The world before the story disturbs it. What's the ordinary, in one image or scene?" },
      { id: "inciting",     name: "Inciting Incident",  pct: 7,  act: "setup",  guide: "The event that makes the story start. What breaks the ordinary world open?" },
      { id: "plot-point-1", name: "First Plot Point",   pct: 8,  act: "setup",  guide: "The point of no return — the protagonist commits to the journey." },
      { id: "rising",       name: "Rising Action",      pct: 20, act: "rise",   guide: "Obstacles escalate, stakes climb, the protagonist learns the rules of the new world." },
      { id: "midpoint",     name: "Midpoint",           pct: 8,  act: "rise",   guide: "A false victory or false defeat that shifts the story's direction and raises the stakes." },
      { id: "plot-point-2", name: "Second Plot Point",  pct: 12, act: "climax", guide: "Everything falls apart. The lowest point, right before the final push." },
      { id: "climax",       name: "Climax",             pct: 15, act: "climax", guide: "The final confrontation. The protagonist's central struggle is decided here." },
      { id: "resolution",   name: "Resolution",         pct: 25, act: "fall",   guide: "The new normal. Loose threads tie off and the story's change is shown, not told." },
    ],
  },
  {
    id: "save-the-cat",
    name: "Save the Cat! (15 beats)",
    blurb: "Blake Snyder's screenwriting beat sheet — precise, percentage-mapped, plot-heavy.",
    beats: [
      { id: "opening-image",   name: "Opening Image",       pct: 1,  act: "setup",  guide: "A snapshot of the 'before' — tone, mood, the problem the protagonist doesn't see yet." },
      { id: "theme-stated",    name: "Theme Stated",        pct: 4,  act: "setup",  guide: "Someone (usually not the hero) says the story's real argument out loud, in passing." },
      { id: "set-up",          name: "Set-Up",              pct: 5,  act: "setup",  guide: "Introduce the hero's flaws, world, and stakes — everything the story is about to upend." },
      { id: "catalyst",        name: "Catalyst",            pct: 1,  act: "setup",  guide: "The telegram, the firing, the knock at the door — the moment life changes." },
      { id: "debate",          name: "Debate",              pct: 9,  act: "setup",  guide: "Should the hero go? The last chance to say no before the story truly begins." },
      { id: "break-into-two",  name: "Break Into Two",      pct: 2,  act: "rise",   guide: "The hero chooses (or is forced) to leave the old world and enter the new one." },
      { id: "b-story",         name: "B Story",             pct: 4,  act: "rise",   guide: "A new relationship enters, usually carrying the story's theme." },
      { id: "fun-and-games",   name: "Fun and Games",       pct: 19, act: "rise",   guide: "The 'promise of the premise' — the trailer moments, playing in the new world." },
      { id: "midpoint",        name: "Midpoint",            pct: 1,  act: "rise",   guide: "A false victory or false defeat. Stakes rise from personal to life-and-death." },
      { id: "bad-guys-close",  name: "Bad Guys Close In",   pct: 11, act: "climax", guide: "Internal doubts and external pressure both close in on the hero." },
      { id: "all-is-lost",     name: "All Is Lost",         pct: 1,  act: "climax", guide: "The opposite of the midpoint's win — often a 'whiff of death', literal or symbolic." },
      { id: "dark-night",      name: "Dark Night of the Soul", pct: 4, act: "climax", guide: "The hero sits in the wreckage before finding the way forward." },
      { id: "break-into-three",name: "Break Into Three",    pct: 2,  act: "fall",   guide: "The A and B stories combine to hand the hero the solution." },
      { id: "finale",          name: "Finale",              pct: 15, act: "fall",   guide: "The hero applies what they learned to defeat the antagonist and fix the world." },
      { id: "final-image",     name: "Final Image",         pct: 1,  act: "fall",   guide: "A mirror of the opening image, showing exactly how much has changed." },
    ],
  },
  {
    id: "hero-journey",
    name: "The Hero's Journey",
    blurb: "Campbell / Vogler's 12-stage monomyth — myth, fantasy and quest stories.",
    beats: [
      { id: "ordinary-world",  name: "Ordinary World",         pct: 8,  act: "setup",  guide: "The hero's normal life, and what's missing or unresolved in it." },
      { id: "call",            name: "Call to Adventure",      pct: 6,  act: "setup",  guide: "A problem or challenge is presented — the story's invitation." },
      { id: "refusal",         name: "Refusal of the Call",    pct: 5,  act: "setup",  guide: "Fear or doubt makes the hero hesitate, reluctant to change." },
      { id: "mentor",          name: "Meeting the Mentor",     pct: 6,  act: "setup",  guide: "A guide offers wisdom, training, or an item that prepares the hero." },
      { id: "threshold",       name: "Crossing the Threshold", pct: 5,  act: "rise",   guide: "The hero commits and leaves the ordinary world behind for good." },
      { id: "tests-allies",    name: "Tests, Allies, Enemies", pct: 14, act: "rise",   guide: "The new world is explored — friends, rivals and the rules are learned the hard way." },
      { id: "approach",        name: "Approach to the Inmost Cave", pct: 8, act: "rise", guide: "Preparation for the central ordeal; the plan is made and the stakes sharpen." },
      { id: "ordeal",          name: "Ordeal",                 pct: 10, act: "climax", guide: "The hero's greatest fear or crisis — a life-or-death, all-or-nothing moment." },
      { id: "reward",          name: "Reward",                 pct: 8,  act: "climax", guide: "Having survived, the hero seizes what they came for — but it comes at a cost." },
      { id: "road-back",       name: "The Road Back",          pct: 8,  act: "climax", guide: "The hero commits to finishing the journey; the consequences of the ordeal chase them." },
      { id: "resurrection",    name: "Resurrection",           pct: 12, act: "fall",   guide: "A final, larger test where everything learned is proven — a true climax." },
      { id: "elixir",          name: "Return with the Elixir", pct: 10, act: "fall",   guide: "The hero returns changed, bringing something of value back to the ordinary world." },
    ],
  },
  {
    id: "freytag",
    name: "Freytag's Pyramid",
    blurb: "The classic five-part dramatic arc — simple, stage-friendly, tragedy's native shape.",
    beats: [
      { id: "exposition",     name: "Exposition",     pct: 15, act: "setup",  guide: "Establish characters, setting and the world's status quo." },
      { id: "rising-action",  name: "Rising Action",  pct: 30, act: "rise",   guide: "A series of complicating events builds tension toward the climax." },
      { id: "climax",         name: "Climax",         pct: 15, act: "climax", guide: "The turning point — the moment of highest tension, where fortune reverses." },
      { id: "falling-action", name: "Falling Action", pct: 25, act: "climax", guide: "Consequences of the climax play out; tension unwinds toward the ending." },
      { id: "denouement",     name: "Denouement",     pct: 15, act: "fall",   guide: "Loose ends resolve and the story's new equilibrium is shown." },
    ],
  },
  {
    id: "seven-point",
    name: "Seven-Point Story Structure",
    blurb: "Dan Wells' structure, built backward from the ending — good for tight plotting.",
    beats: [
      { id: "hook",       name: "Hook",         pct: 8,  act: "setup",  guide: "The opposite of the resolution — establish where the character starts, in contrast to where they'll end." },
      { id: "plot-turn-1",name: "Plot Turn 1",  pct: 12, act: "setup",  guide: "An event introduces the main conflict and moves the character out of the hook state." },
      { id: "pinch-1",    name: "Pinch Point 1",pct: 15, act: "rise",   guide: "Pressure is applied — often the antagonist's power is shown, forcing the character to act." },
      { id: "midpoint",   name: "Midpoint",     pct: 12, act: "rise",   guide: "The character moves from reaction to action — passive to proactive." },
      { id: "pinch-2",    name: "Pinch Point 2",pct: 15, act: "climax", guide: "More pressure, often a major loss, that removes the character's safety net entirely." },
      { id: "plot-turn-2",name: "Plot Turn 2",  pct: 13, act: "climax", guide: "The final piece the character needs to resolve the conflict is found." },
      { id: "resolution", name: "Resolution",   pct: 25, act: "fall",   guide: "The character, now changed, resolves the conflict — the mirror of the hook." },
    ],
  },
  {
    id: "kishotenketsu",
    name: "Kishōtenketsu",
    blurb: "A four-act East Asian narrative structure driven by contrast, not conflict.",
    beats: [
      { id: "ki",     name: "Ki (Introduction)", pct: 25, act: "setup",  guide: "Introduce the characters and situation, unhurried — no problem needs to appear yet." },
      { id: "sho",    name: "Shō (Development)", pct: 30, act: "rise",   guide: "Develop what was introduced; deepen the reader's understanding of the situation." },
      { id: "ten",    name: "Ten (Twist)",       pct: 25, act: "climax", guide: "An unexpected, often unrelated element recontextualises everything that came before." },
      { id: "ketsu",  name: "Ketsu (Conclusion)",pct: 20, act: "fall",   guide: "Reconcile the twist with the rest of the story into a single, resolved whole." },
    ],
  },
];

export const structureById = id => STRUCTURES.find(s => s.id === id) || STRUCTURES[0];
