// Story-structure templates. Each beat carries `pct` (its share of the wheel / the story's total
// length), `act` (a coarse phase used only for colour — Setup / Confrontation / Resolution, or a
// template's own equivalent) so differently-shaped structures still read as one system, `ex`
// (a three-word illustration of the beat, all templates tracing the same example story so they
// read as one throughline — except Kishotenketsu, whose non-conflict shape gets its own), and
// `threeAct` (1/2/3 — where the beat falls against the classic three-act spine, drawn as the
// wheel's outer ring; beats within a structure are listed in non-decreasing threeAct order).

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
      { id: "status-quo",   name: "Opening Image",     pct: 5,  act: "setup",  threeAct: 1, guide: "The world before the story disturbs it. What's the ordinary, in one image or scene?", ex: "Quiet village morning" },
      { id: "inciting",     name: "Inciting Incident",  pct: 7,  act: "setup",  threeAct: 1, guide: "The event that makes the story start. What breaks the ordinary world open?", ex: "Dragon attacks village" },
      { id: "plot-point-1", name: "Reaction to Incident", pct: 8,  act: "setup",  threeAct: 1, guide: "The point of no return — the protagonist commits to the journey.", ex: "Hero grabs sword" },
      { id: "rising",       name: "Getting Friends",    pct: 20, act: "rise",   threeAct: 2, guide: "Obstacles escalate, stakes climb, the protagonist learns the rules of the new world.", ex: "Gathers allies, trains" },
      { id: "midpoint",     name: "Extent of the Evil", pct: 8,  act: "rise",   threeAct: 2, guide: "A false victory or false defeat that shifts the story's direction and raises the stakes.", ex: "Discovers evil's scale" },
      { id: "plot-point-2", name: "Almost Failure",     pct: 12, act: "climax", threeAct: 2, guide: "Everything falls apart. The lowest point, right before the final push.", ex: "Ally betrays hero" },
      { id: "climax",       name: "Final Fight",        pct: 15, act: "climax", threeAct: 3, guide: "The final confrontation. The protagonist's central struggle is decided here.", ex: "Duels dragon alone" },
      { id: "resolution",   name: "Resolution",         pct: 25, act: "fall",   threeAct: 3, guide: "The new normal. Loose threads tie off and the story's change is shown, not told.", ex: "Village rebuilds, thrives" },
    ],
  },
  {
    id: "save-the-cat",
    name: "Save the Cat! (15 beats)",
    blurb: "Blake Snyder's screenwriting beat sheet — precise, percentage-mapped, plot-heavy.",
    beats: [
      { id: "opening-image",   name: "Opening Image",       pct: 1,  act: "setup",  threeAct: 1, guide: "A snapshot of the 'before' — tone, mood, the problem the protagonist doesn't see yet.", ex: "Quiet village morning" },
      { id: "theme-stated",    name: "Theme Stated",        pct: 4,  act: "setup",  threeAct: 1, guide: "Someone (usually not the hero) says the story's real argument out loud, in passing.", ex: "Courage over fear" },
      { id: "set-up",          name: "Set-Up",              pct: 5,  act: "setup",  threeAct: 1, guide: "Introduce the hero's flaws, world, and stakes — everything the story is about to upend.", ex: "Farmer fears dragons" },
      { id: "catalyst",        name: "Catalyst",            pct: 1,  act: "setup",  threeAct: 1, guide: "The telegram, the firing, the knock at the door — the moment life changes.", ex: "Dragon burns barn" },
      { id: "debate",          name: "Debate",              pct: 9,  act: "setup",  threeAct: 1, guide: "Should the hero go? The last chance to say no before the story truly begins.", ex: "Should I go?" },
      { id: "break-into-two",  name: "Break Into Two",      pct: 2,  act: "rise",   threeAct: 2, guide: "The hero chooses (or is forced) to leave the old world and enter the new one.", ex: "Leaves the farm" },
      { id: "b-story",         name: "B Story",             pct: 4,  act: "rise",   threeAct: 2, guide: "A new relationship enters, usually carrying the story's theme.", ex: "Meets fellow warrior" },
      { id: "fun-and-games",   name: "Fun and Games",       pct: 19, act: "rise",   threeAct: 2, guide: "The 'promise of the premise' — the trailer moments, playing in the new world.", ex: "Trains, tracks, jokes" },
      { id: "midpoint",        name: "Midpoint",            pct: 1,  act: "rise",   threeAct: 2, guide: "A false victory or false defeat. Stakes rise from personal to life-and-death.", ex: "Finds dragon's lair" },
      { id: "bad-guys-close",  name: "Bad Guys Close In",   pct: 11, act: "climax", threeAct: 2, guide: "Internal doubts and external pressure both close in on the hero.", ex: "Elders lose hope" },
      { id: "all-is-lost",     name: "All Is Lost",         pct: 1,  act: "climax", threeAct: 2, guide: "The opposite of the midpoint's win — often a 'whiff of death', literal or symbolic.", ex: "Warrior friend dies" },
      { id: "dark-night",      name: "Dark Night of the Soul", pct: 4, act: "climax", threeAct: 2, guide: "The hero sits in the wreckage before finding the way forward.", ex: "Grieves, nearly quits" },
      { id: "break-into-three",name: "Break Into Three",    pct: 2,  act: "fall",   threeAct: 3, guide: "The A and B stories combine to hand the hero the solution.", ex: "Remembers warrior's lesson" },
      { id: "finale",          name: "Finale",              pct: 15, act: "fall",   threeAct: 3, guide: "The hero applies what they learned to defeat the antagonist and fix the world.", ex: "Defeats the dragon" },
      { id: "final-image",     name: "Final Image",         pct: 1,  act: "fall",   threeAct: 3, guide: "A mirror of the opening image, showing exactly how much has changed.", ex: "Village rebuilds, thrives" },
    ],
  },
  {
    id: "hero-journey",
    name: "The Hero's Journey",
    blurb: "Campbell / Vogler's 12-stage monomyth — myth, fantasy and quest stories.",
    beats: [
      { id: "ordinary-world",  name: "Ordinary World",         pct: 8,  act: "setup",  threeAct: 1, guide: "The hero's normal life, and what's missing or unresolved in it.", ex: "Quiet village morning" },
      { id: "call",            name: "Call to Adventure",      pct: 6,  act: "setup",  threeAct: 1, guide: "A problem or challenge is presented — the story's invitation.", ex: "Dragon attacks village" },
      { id: "refusal",         name: "Refusal of the Call",    pct: 5,  act: "setup",  threeAct: 1, guide: "Fear or doubt makes the hero hesitate, reluctant to change.", ex: "Hero refuses, afraid" },
      { id: "mentor",          name: "Meeting the Mentor",     pct: 6,  act: "setup",  threeAct: 1, guide: "A guide offers wisdom, training, or an item that prepares the hero.", ex: "Old warrior teaches" },
      { id: "threshold",       name: "Crossing the Threshold", pct: 5,  act: "rise",   threeAct: 1, guide: "The hero commits and leaves the ordinary world behind for good.", ex: "Leaves the village" },
      { id: "tests-allies",    name: "Tests, Allies, Enemies", pct: 14, act: "rise",   threeAct: 2, guide: "The new world is explored — friends, rivals and the rules are learned the hard way.", ex: "Makes allies, enemies" },
      { id: "approach",        name: "Approach to the Inmost Cave", pct: 8, act: "rise", threeAct: 2, guide: "Preparation for the central ordeal; the plan is made and the stakes sharpen.", ex: "Plans the assault" },
      { id: "ordeal",          name: "Ordeal",                 pct: 10, act: "climax", threeAct: 2, guide: "The hero's greatest fear or crisis — a life-or-death, all-or-nothing moment.", ex: "Faces the dragon" },
      { id: "reward",          name: "Reward",                 pct: 8,  act: "climax", threeAct: 2, guide: "Having survived, the hero seizes what they came for — but it comes at a cost.", ex: "Claims dragon's treasure" },
      { id: "road-back",       name: "The Road Back",          pct: 8,  act: "climax", threeAct: 2, guide: "The hero commits to finishing the journey; the consequences of the ordeal chase them.", ex: "Danger follows home" },
      { id: "resurrection",    name: "Resurrection",           pct: 12, act: "fall",   threeAct: 3, guide: "A final, larger test where everything learned is proven — a true climax.", ex: "Final desperate stand" },
      { id: "elixir",          name: "Return with the Elixir", pct: 10, act: "fall",   threeAct: 3, guide: "The hero returns changed, bringing something of value back to the ordinary world.", ex: "Brings peace home" },
    ],
  },
  {
    id: "freytag",
    name: "Freytag's Pyramid",
    blurb: "The classic five-part dramatic arc — simple, stage-friendly, tragedy's native shape.",
    beats: [
      { id: "exposition",     name: "Exposition",     pct: 15, act: "setup",  threeAct: 1, guide: "Establish characters, setting and the world's status quo.", ex: "Quiet village morning" },
      { id: "rising-action",  name: "Rising Action",  pct: 30, act: "rise",   threeAct: 2, guide: "A series of complicating events builds tension toward the climax.", ex: "Dragon threat grows" },
      { id: "climax",         name: "Climax",         pct: 15, act: "climax", threeAct: 2, guide: "The turning point — the moment of highest tension, where fortune reverses.", ex: "Hero fights dragon" },
      { id: "falling-action", name: "Falling Action", pct: 25, act: "climax", threeAct: 3, guide: "Consequences of the climax play out; tension unwinds toward the ending.", ex: "Dragon's power fades" },
      { id: "denouement",     name: "Denouement",     pct: 15, act: "fall",   threeAct: 3, guide: "Loose ends resolve and the story's new equilibrium is shown.", ex: "Peace returns finally" },
    ],
  },
  {
    id: "seven-point",
    name: "Seven-Point Story Structure",
    blurb: "Dan Wells' structure, built backward from the ending — good for tight plotting.",
    beats: [
      { id: "hook",       name: "Hook",         pct: 8,  act: "setup",  threeAct: 1, guide: "The opposite of the resolution — establish where the character starts, in contrast to where they'll end.", ex: "Hero fears dragons" },
      { id: "plot-turn-1",name: "Plot Turn 1",  pct: 12, act: "setup",  threeAct: 1, guide: "An event introduces the main conflict and moves the character out of the hook state.", ex: "Dragon attacks village" },
      { id: "pinch-1",    name: "Pinch Point 1",pct: 15, act: "rise",   threeAct: 2, guide: "Pressure is applied — often the antagonist's power is shown, forcing the character to act.", ex: "Dragon burns fields" },
      { id: "midpoint",   name: "Midpoint",     pct: 12, act: "rise",   threeAct: 2, guide: "The character moves from reaction to action — passive to proactive.", ex: "Hero chooses action" },
      { id: "pinch-2",    name: "Pinch Point 2",pct: 15, act: "climax", threeAct: 2, guide: "More pressure, often a major loss, that removes the character's safety net entirely.", ex: "Mentor is killed" },
      { id: "plot-turn-2",name: "Plot Turn 2",  pct: 13, act: "climax", threeAct: 3, guide: "The final piece the character needs to resolve the conflict is found.", ex: "Finds dragon's weakness" },
      { id: "resolution", name: "Resolution",   pct: 25, act: "fall",   threeAct: 3, guide: "The character, now changed, resolves the conflict — the mirror of the hook.", ex: "Hero defeats dragon" },
    ],
  },
  {
    id: "kishotenketsu",
    name: "Kishōtenketsu",
    blurb: "A four-act East Asian narrative structure driven by contrast, not conflict.",
    beats: [
      { id: "ki",     name: "Ki (Introduction)", pct: 25, act: "setup",  threeAct: 1, guide: "Introduce the characters and situation, unhurried — no problem needs to appear yet.", ex: "Village bakes bread" },
      { id: "sho",    name: "Shō (Development)", pct: 30, act: "rise",   threeAct: 2, guide: "Develop what was introduced; deepen the reader's understanding of the situation.", ex: "Baker befriends traveler" },
      { id: "ten",    name: "Ten (Twist)",       pct: 25, act: "climax", threeAct: 3, guide: "An unexpected, often unrelated element recontextualises everything that came before.", ex: "Traveler is dragon" },
      { id: "ketsu",  name: "Ketsu (Conclusion)",pct: 20, act: "fall",   threeAct: 3, guide: "Reconcile the twist with the rest of the story into a single, resolved whole.", ex: "Village welcomes dragon" },
    ],
  },
];

export const structureById = id => STRUCTURES.find(s => s.id === id) || STRUCTURES[0];
