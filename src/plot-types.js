// Plot-type taxonomies — what KIND of story this is, as opposed to structures.js's WHAT ORDER
// (Booker's 7 Basic Plots to start). These don't have beats of their own; instead each maps onto
// the four shared act-phases (setup/rise/climax/fall) that every structure's beats already carry,
// so picking a plot type works against whichever structure is currently selected, with no
// per-structure content needed.
export const PLOT_TYPES = [
  {
    id: "overcoming-monster",
    name: "Overcoming the Monster",
    blurb: "A hero must destroy an evil, threatening force.",
    acts: {
      setup: "The monster's threat is established from a distance — its power, its victims, why it can't be ignored.",
      rise: "The hero prepares, gathers allies or weapons, and takes the fight to the monster's territory — early skirmishes go badly.",
      climax: "The direct, often near-fatal confrontation with the monster, where the hero's preparation is tested to its limit.",
      fall: "The monster is destroyed and its threat lifted — the world, and often the hero, is transformed by its defeat.",
    },
  },
  {
    id: "rags-to-riches",
    name: "Rags to Riches",
    blurb: "An overlooked or undervalued protagonist rises to true worth.",
    acts: {
      setup: "The hero starts poor, overlooked or undervalued — the story establishes exactly what they lack.",
      rise: "A rise in fortune begins, often followed by a false setback or a taste of the wrong kind of success.",
      climax: "A true test — often losing everything gained so far — that separates real worth from mere luck.",
      fall: "The hero earns a lasting, deserved success, now understanding what actually made them ready for it.",
    },
  },
  {
    id: "the-quest",
    name: "The Quest",
    blurb: "A hero and companions travel to reach a distant, vital goal.",
    acts: {
      setup: "A goal is named — an object, a place, a person — worth risking everything to reach.",
      rise: "A journey through a series of obstacles, each testing a different quality the hero needs to succeed.",
      climax: "The final, hardest obstacle guarding the goal, where all the previous trials pay off.",
      fall: "The goal is reached — though the story often reveals it changed the hero more than it changed their situation.",
    },
  },
  {
    id: "voyage-and-return",
    name: "Voyage and Return",
    blurb: "A hero is pulled into a strange world, and must escape it changed.",
    acts: {
      setup: "The hero is pulled or thrown into a strange world, unlike anything in their ordinary life.",
      rise: "They explore the strange world, initially delighted or curious, gradually sensing something is wrong.",
      climax: "The strange world turns dangerous, and the hero must escape it before it's too late.",
      fall: "The hero returns home, wiser for the journey, to a world that looks different now that they've changed.",
    },
  },
  {
    id: "comedy",
    name: "Comedy",
    blurb: "Confusion and misunderstanding are resolved into harmony.",
    acts: {
      setup: "Confusion, misunderstanding or a hidden truth separates people who belong together.",
      rise: "The confusion deepens — often through disguise, mistaken identity, or well-meant lies — before it can clear.",
      climax: "The truth threatens to come out at the worst possible moment, forcing a crisis.",
      fall: "The confusion is resolved, truths are revealed, and the story ends in reunion, marriage or restored order.",
    },
  },
  {
    id: "tragedy",
    name: "Tragedy",
    blurb: "A protagonist's own flaw drives them to their downfall.",
    acts: {
      setup: "The protagonist's central flaw or desire is introduced, often disguised as a strength.",
      rise: "That flaw drives a series of choices that seem reasonable at the time, each pulling them further from safety.",
      climax: "The flaw reaches its full, irreversible consequence — the point past which there's no return.",
      fall: "The protagonist's downfall plays out to its end, often taking down what and who they cared about with it.",
    },
  },
  {
    id: "rebirth",
    name: "Rebirth",
    blurb: "A protagonist trapped in a diminished life is redeemed.",
    acts: {
      setup: "The protagonist is trapped — by a curse, a habit, a belief, or another person's control — in a diminished life.",
      rise: "The trap tightens, or a chance at change appears and is refused, deepening the protagonist's isolation.",
      climax: "A moment — often involving someone else's love, courage or sacrifice — breaks the spell for good.",
      fall: "The protagonist is transformed, restored to a fuller life than the one the story began with.",
    },
  },
];

export const plotTypeById = id => PLOT_TYPES.find(p => p.id === id) || null;
