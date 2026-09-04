// Plot-type taxonomies — what KIND of story this is, as opposed to structures.js's WHAT ORDER.
// None of these have beats of their own; instead each maps onto the four shared act-phases
// (setup/rise/climax/fall) that every structure's beats already carry, so picking a plot type
// works against whichever structure is currently selected, with no per-structure content needed.
// Every entry carries `taxonomy` (which classification system it's from) so the picker can group
// them, and several genuinely different systems are represented rather than just Booker's:
//   - Booker's 7 Basic Plots       — the broadest, most novel/film-friendly archetypes
//   - Tobias' 20 Master Plots      — a finer-grained set covering the same ground and more
//   - Polti's 36 Dramatic Situations — 19th-century, conflict-snapshot situations rather than
//     full arcs; the mapping onto four acts is a looser fit for these than for the others
//   - Vonnegut's Story Shapes      — not content at all, but the shape of a story's fortune over
//     time (his "good fortune / ill fortune" graphs); the acts below describe fortune, not plot
//   - The MICE Quotient            — Orson Scott Card's four story types, defined by what opens
//     and closes the story (a place, a question, an identity, or a disruption) rather than by
//     conflict content

export const PLOT_TYPES = [
  // ===== Booker's 7 Basic Plots =====
  {
    id: "overcoming-monster",
    name: "Overcoming the Monster",
    taxonomy: "Booker's 7 Basic Plots",
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
    taxonomy: "Booker's 7 Basic Plots",
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
    taxonomy: "Booker's 7 Basic Plots",
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
    taxonomy: "Booker's 7 Basic Plots",
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
    taxonomy: "Booker's 7 Basic Plots",
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
    taxonomy: "Booker's 7 Basic Plots",
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
    taxonomy: "Booker's 7 Basic Plots",
    blurb: "A protagonist trapped in a diminished life is redeemed.",
    acts: {
      setup: "The protagonist is trapped — by a curse, a habit, a belief, or another person's control — in a diminished life.",
      rise: "The trap tightens, or a chance at change appears and is refused, deepening the protagonist's isolation.",
      climax: "A moment — often involving someone else's love, courage or sacrifice — breaks the spell for good.",
      fall: "The protagonist is transformed, restored to a fuller life than the one the story began with.",
    },
  },

  // ===== Tobias' 20 Master Plots =====
  {
    id: "tobias-quest", name: "Quest", taxonomy: "Tobias' 20 Master Plots",
    blurb: "A goal or object worth any risk is pursued.",
    acts: {
      setup: "A goal or object worth any risk is named.",
      rise: "A journey through obstacles that test the hero's resolve.",
      climax: "The final barrier standing between the hero and the goal.",
      fall: "The goal is reached, and its true cost is understood.",
    },
  },
  {
    id: "tobias-adventure", name: "Adventure", taxonomy: "Tobias' 20 Master Plots",
    blurb: "A hero is drawn from safety into an unfamiliar place.",
    acts: {
      setup: "The hero is drawn away from safety toward an unfamiliar place.",
      rise: "Danger and discovery alternate as the hero pushes further in.",
      climax: "The most dangerous point of the journey, survived by skill or luck.",
      fall: "The hero returns, marked by what they saw and did.",
    },
  },
  {
    id: "tobias-pursuit", name: "Pursuit", taxonomy: "Tobias' 20 Master Plots",
    blurb: "A chase — hunter and hunted, roles sometimes unclear.",
    acts: {
      setup: "A chase begins — hunter and hunted, roles sometimes unclear.",
      rise: "Near-misses and close calls keep the gap from closing.",
      climax: "Hunter and hunted finally meet, face to face.",
      fall: "The chase ends, for better or worse, and doesn't resume.",
    },
  },
  {
    id: "tobias-rescue", name: "Rescue", taxonomy: "Tobias' 20 Master Plots",
    blurb: "Someone taken, trapped, or lost is fought for.",
    acts: {
      setup: "Someone is taken, trapped, or lost.",
      rise: "The rescuer plans and moves toward them against resistance.",
      climax: "The rescue attempt itself, at its most dangerous.",
      fall: "The rescued and the rescuer are both changed by what it cost.",
    },
  },
  {
    id: "tobias-escape", name: "Escape", taxonomy: "Tobias' 20 Master Plots",
    blurb: "A trap or confinement, physical or otherwise, is broken free of.",
    acts: {
      setup: "A trap, prison or confinement is established, physical or otherwise.",
      rise: "Attempts to break free fail, or nearly succeed, raising the stakes.",
      climax: "The escape attempt that finally works — or finally fails.",
      fall: "Freedom, and what it means now that it's real.",
    },
  },
  {
    id: "tobias-revenge", name: "Revenge", taxonomy: "Tobias' 20 Master Plots",
    blurb: "An unforgivable wrong is pursued and answered.",
    acts: {
      setup: "A wrong is done that can't be forgiven or forgotten.",
      rise: "The wronged party plans and pursues retribution.",
      climax: "The confrontation with the one who caused the harm.",
      fall: "The revenge is taken — and its cost to the avenger is revealed.",
    },
  },
  {
    id: "tobias-riddle", name: "The Riddle", taxonomy: "Tobias' 20 Master Plots",
    blurb: "A genuine puzzle, with real stakes for solving it.",
    acts: {
      setup: "A genuine puzzle is posed, with real stakes for solving it.",
      rise: "Clues mislead as often as they help.",
      climax: "The pieces come together — or the puzzle nearly defeats the solver.",
      fall: "The answer is revealed, and its implications land.",
    },
  },
  {
    id: "tobias-rivalry", name: "Rivalry", taxonomy: "Tobias' 20 Master Plots",
    blurb: "Two roughly equal parties are set against each other.",
    acts: {
      setup: "Two roughly equal parties are set against each other.",
      rise: "Each gains and loses ground in turn.",
      climax: "A decisive contest that will settle the rivalry for good.",
      fall: "One rival wins — or both are changed by refusing to stop.",
    },
  },
  {
    id: "tobias-underdog", name: "Underdog", taxonomy: "Tobias' 20 Master Plots",
    blurb: "A clearly outmatched party takes on a much stronger one.",
    acts: {
      setup: "A clearly outmatched party takes on a much stronger one.",
      rise: "Setbacks pile up, and victory looks less and less likely.",
      climax: "The decisive confrontation, against all odds.",
      fall: "The underdog's unlikely win — or a defeat that still means something.",
    },
  },
  {
    id: "tobias-temptation", name: "Temptation", taxonomy: "Tobias' 20 Master Plots",
    blurb: "Something forbidden, but deeply desired, is offered.",
    acts: {
      setup: "Something forbidden or dangerous, but deeply desired, is offered.",
      rise: "Small compromises are made, easier to justify each time.",
      climax: "The point of no return, where the temptation is fully given in to.",
      fall: "The consequences of giving in are lived with.",
    },
  },
  {
    id: "tobias-metamorphosis", name: "Metamorphosis", taxonomy: "Tobias' 20 Master Plots",
    blurb: "A character is transformed, often against their will.",
    acts: {
      setup: "A character is transformed — physically, often against their will.",
      rise: "Life under the new, unwanted form, and its isolation.",
      climax: "The transformed character reaches a breaking point.",
      fall: "Some resolution to the changed state — reversal, acceptance, or its opposite.",
    },
  },
  {
    id: "tobias-transformation", name: "Transformation", taxonomy: "Tobias' 20 Master Plots",
    blurb: "A character is pushed into becoming someone different.",
    acts: {
      setup: "A character is shown clearly as they are before the story changes them.",
      rise: "A series of events pushes them toward a different way of being.",
      climax: "The moment the old self can no longer hold.",
      fall: "The new self is shown, contrasted against who they were.",
    },
  },
  {
    id: "tobias-maturation", name: "Maturation", taxonomy: "Tobias' 20 Master Plots",
    blurb: "A young or naive protagonist faces the adult world.",
    acts: {
      setup: "A young or naive protagonist faces the adult world for the first time.",
      rise: "Lessons are learned the hard way, through real consequences.",
      climax: "A final test that requires acting as an adult, not a child.",
      fall: "The protagonist is shown, changed, no longer who they were at the start.",
    },
  },
  {
    id: "tobias-love", name: "Love", taxonomy: "Tobias' 20 Master Plots",
    blurb: "Two people are drawn to each other, against some obstacle.",
    acts: {
      setup: "Two people are drawn to each other, against some obstacle.",
      rise: "The obstacle complicates and nearly separates them.",
      climax: "The relationship's decisive moment — together or apart, for good.",
      fall: "The outcome of the love story, earned rather than assumed.",
    },
  },
  {
    id: "tobias-forbidden-love", name: "Forbidden Love", taxonomy: "Tobias' 20 Master Plots",
    blurb: "An attraction breaks a rule — social, moral, or otherwise.",
    acts: {
      setup: "An attraction that breaks a rule — social, moral, or otherwise.",
      rise: "The relationship is hidden, and the risk of discovery grows.",
      climax: "The forbidden love is exposed, or a choice must finally be made.",
      fall: "The cost of the love is paid, whatever the choice was.",
    },
  },
  {
    id: "tobias-sacrifice", name: "Sacrifice", taxonomy: "Tobias' 20 Master Plots",
    blurb: "A character has something precious to give up.",
    acts: {
      setup: "A character has something precious to lose.",
      rise: "Circumstances make giving it up look more and more necessary.",
      climax: "The sacrifice is made, consciously and irreversibly.",
      fall: "What the sacrifice bought is shown, weighed against what it cost.",
    },
  },
  {
    id: "tobias-discovery", name: "Discovery", taxonomy: "Tobias' 20 Master Plots",
    blurb: "A character's understanding of themselves or their world is incomplete.",
    acts: {
      setup: "A character's understanding of themselves or their world is incomplete.",
      rise: "Events chip away at old assumptions, one at a time.",
      climax: "A single revelation reframes everything that came before.",
      fall: "The character lives, differently, in light of what they now know.",
    },
  },
  {
    id: "tobias-wretched-excess", name: "Wretched Excess", taxonomy: "Tobias' 20 Master Plots",
    blurb: "A desire is pursued past any reasonable limit.",
    acts: {
      setup: "A character pursues a desire past any reasonable limit.",
      rise: "More is never enough — the pursuit escalates.",
      climax: "The excess reaches a breaking point, for the character or those around them.",
      fall: "The reckoning — self-destruction, ruin, or a narrow escape from it.",
    },
  },
  {
    id: "tobias-ascension", name: "Ascension", taxonomy: "Tobias' 20 Master Plots",
    blurb: "A character climbs from a low or ordinary position.",
    acts: {
      setup: "A character begins in a low or ordinary position.",
      rise: "A sustained climb, through ability, luck, or both.",
      climax: "The final test standing between the character and the top.",
      fall: "The character reaches the height they were climbing toward.",
    },
  },
  {
    id: "tobias-descension", name: "Descension", taxonomy: "Tobias' 20 Master Plots",
    blurb: "A character falls from a high or fortunate position.",
    acts: {
      setup: "A character begins in a high or fortunate position.",
      rise: "A slow, often self-inflicted decline begins.",
      climax: "The point at which the fall becomes irreversible.",
      fall: "The character lands at the bottom of what they built, or lost.",
    },
  },

  // ===== Polti's 36 Dramatic Situations =====
  {
    id: "polti-supplication", name: "Supplication", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A powerful figure holds someone's fate in their hands.",
    acts: {
      setup: "A powerful figure holds someone's fate.",
      rise: "The weaker party pleads for mercy or help.",
      climax: "The powerful figure's decision hangs in the balance.",
      fall: "Mercy is granted — or refused, and the cost is paid.",
    },
  },
  {
    id: "polti-deliverance", name: "Deliverance", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "Someone trapped or threatened is rescued.",
    acts: {
      setup: "Someone is trapped or threatened, seemingly beyond help.",
      rise: "A rescuer emerges and moves to intervene.",
      climax: "The deliverance is attempted at its most dangerous point.",
      fall: "The threatened party is freed — or the attempt fails.",
    },
  },
  {
    id: "polti-crime-vengeance", name: "Crime Pursued by Vengeance", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A crime against someone dear is answered with vengeance.",
    acts: {
      setup: "A crime is committed against someone dear to the avenger.",
      rise: "The avenger tracks the culprit, closing the distance.",
      climax: "Avenger and culprit finally meet.",
      fall: "Vengeance is taken, and its price is paid.",
    },
  },
  {
    id: "polti-vengeance-kindred", name: "Vengeance Taken for Kindred Upon Kindred", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A crime against family demands vengeance against family.",
    acts: {
      setup: "A crime against family demands vengeance against family.",
      rise: "The avenger closes in on someone who shares blood with the true offender.",
      climax: "The vengeance is about to fall on an innocent relative.",
      fall: "The vengeance lands — rightly or wrongly, on kin.",
    },
  },
  {
    id: "polti-pursuit", name: "Pursuit", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A wrongdoer flees a threat to their life or freedom.",
    acts: {
      setup: "A wrongdoer flees a threat to their life or freedom.",
      rise: "Pursuers close the distance, evasion after evasion.",
      climax: "Pursued and pursuer are finally cornered together.",
      fall: "Capture, escape, or something else — the chase ends.",
    },
  },
  {
    id: "polti-disaster", name: "Disaster", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A stable situation is threatened by an overwhelming force.",
    acts: {
      setup: "A stable situation is threatened by an overwhelming force.",
      rise: "The disaster unfolds, largely beyond anyone's control.",
      climax: "The worst of the disaster hits.",
      fall: "What's left is taken stock of, and rebuilding begins.",
    },
  },
  {
    id: "polti-cruelty-misfortune", name: "Falling Prey to Cruelty or Misfortune", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "An innocent party is targeted, arbitrarily or cruelly.",
    acts: {
      setup: "An innocent party is targeted, arbitrarily or cruelly.",
      rise: "Misfortune compounds, with no clear way to stop it.",
      climax: "The cruelty or misfortune reaches its worst point.",
      fall: "The victim endures, or doesn't — the toll is counted.",
    },
  },
  {
    id: "polti-revolt", name: "Revolt", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "An oppressive power holds control over the powerless.",
    acts: {
      setup: "An oppressive power holds control over the powerless.",
      rise: "Resentment organizes into open resistance.",
      climax: "The revolt reaches its decisive confrontation.",
      fall: "The old power is overthrown, or the revolt is crushed.",
    },
  },
  {
    id: "polti-daring-enterprise", name: "Daring Enterprise", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "An audacious goal is set, against the odds.",
    acts: {
      setup: "An audacious goal is set, against the odds.",
      rise: "Preparation and early attempts test the plan's limits.",
      climax: "The enterprise is attempted at its most exposed, all-or-nothing moment.",
      fall: "Success or failure, boldly earned either way.",
    },
  },
  {
    id: "polti-abduction", name: "Abduction", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "Someone is taken against their will.",
    acts: {
      setup: "Someone is taken against their will.",
      rise: "The abductor and the taken are thrown together, or a rescue is mounted.",
      climax: "A confrontation over the abducted party's fate.",
      fall: "The taken is freed, kept, or something in between.",
    },
  },
  {
    id: "polti-enigma", name: "The Enigma", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A genuine mystery, with real consequences riding on it.",
    acts: {
      setup: "A genuine mystery is posed, with real consequences riding on it.",
      rise: "Investigation turns up more questions than answers.",
      climax: "The truth is nearly grasped, or nearly lost for good.",
      fall: "The enigma is solved — or left to stand unsolved.",
    },
  },
  {
    id: "polti-obtaining", name: "Obtaining", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "Something greatly desired is just out of reach.",
    acts: {
      setup: "Something greatly desired is just out of reach.",
      rise: "Attempts to obtain it meet resistance or competition.",
      climax: "The decisive attempt to take hold of it.",
      fall: "It's won, or lost, and what that costs becomes clear.",
    },
  },
  {
    id: "polti-enmity-kinsmen", name: "Enmity of Kinsmen", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "Hatred grows between family members.",
    acts: {
      setup: "Hatred grows between family members.",
      rise: "Every interaction deepens the rift.",
      climax: "The enmity comes to a head, openly.",
      fall: "The family is broken, or an uneasy peace is found.",
    },
  },
  {
    id: "polti-rivalry-kinsmen", name: "Rivalry of Kinsmen", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "Family members compete for the same prize.",
    acts: {
      setup: "Family members compete for the same prize.",
      rise: "The rivalry sharpens as the stakes rise.",
      climax: "A decisive contest between them.",
      fall: "One wins, at the cost of the family bond.",
    },
  },
  {
    id: "polti-murderous-adultery", name: "Murderous Adultery", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "An affair conceals a plan to remove a spouse.",
    acts: {
      setup: "An affair conceals a plan to remove the betrayed spouse.",
      rise: "The plan against the spouse advances, hidden.",
      climax: "The murder is attempted.",
      fall: "The truth comes out, and judgment follows.",
    },
  },
  {
    id: "polti-madness", name: "Madness", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A character's grip on reality begins to slip.",
    acts: {
      setup: "A character's grip on reality begins to slip.",
      rise: "Their unraveling affects everyone around them.",
      climax: "The madness reaches its most dangerous or revealing point.",
      fall: "Some clarity returns — or doesn't.",
    },
  },
  {
    id: "polti-fatal-imprudence", name: "Fatal Imprudence", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A risk is taken without weighing its true cost.",
    acts: {
      setup: "A character takes a risk without weighing its true cost.",
      rise: "The consequences of that carelessness start to compound.",
      climax: "The imprudence catches up, all at once.",
      fall: "The price of the mistake is paid in full.",
    },
  },
  {
    id: "polti-involuntary-crimes-love", name: "Involuntary Crimes of Love", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "Love leads a character into an act they didn't intend.",
    acts: {
      setup: "Love leads a character into an act they didn't intend.",
      rise: "They try, and fail, to undo or contain the harm.",
      climax: "The crime is exposed, or its consequences become unavoidable.",
      fall: "The character lives with what love made them do.",
    },
  },
  {
    id: "polti-slaying-kinsman-unrecognized", name: "Slaying of a Kinsman Unrecognized", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A stranger is killed, their true identity unknown.",
    acts: {
      setup: "A stranger is encountered, their identity unknown.",
      rise: "Conflict builds between them, neither knowing the truth.",
      climax: "The stranger is killed.",
      fall: "Their true identity — a family member — is revealed, too late.",
    },
  },
  {
    id: "polti-self-sacrifice-ideal", name: "Self-Sacrifice for an Ideal", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A cause or principle demands everything.",
    acts: {
      setup: "A cause or principle demands more than the character wants to give.",
      rise: "The cost of standing by the ideal keeps rising.",
      climax: "The sacrifice must be made, fully and finally.",
      fall: "What the sacrifice bought for the ideal is shown.",
    },
  },
  {
    id: "polti-self-sacrifice-kindred", name: "Self-Sacrifice for Kindred", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A family member's survival depends on a sacrifice.",
    acts: {
      setup: "A family member's survival depends on someone else giving something up.",
      rise: "The cost of the coming sacrifice becomes clearer.",
      climax: "The sacrifice is made.",
      fall: "The family member lives on, changed by what was given for them.",
    },
  },
  {
    id: "polti-all-sacrificed-passion", name: "All Sacrificed for Passion", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A consuming passion outweighs everything else.",
    acts: {
      setup: "A consuming passion outweighs everything else in a character's life.",
      rise: "Responsibilities, relationships and safety are set aside for it.",
      climax: "Everything is finally staked on the passion, all at once.",
      fall: "What's left once the passion has taken everything it can.",
    },
  },
  {
    id: "polti-necessity-sacrificing-loved-ones", name: "Necessity of Sacrificing Loved Ones", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A character is forced to choose between loved ones.",
    acts: {
      setup: "A character is forced to choose between loved ones, or between duty and love.",
      rise: "Every option costs someone dear to them.",
      climax: "The choice can no longer be delayed.",
      fall: "The sacrifice is made, and its grief is lived with.",
    },
  },
  {
    id: "polti-rivalry-superior-inferior", name: "Rivalry of Superior and Inferior", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "Two unequal parties are set in competition.",
    acts: {
      setup: "Two unequal parties are set in competition.",
      rise: "The weaker party finds ways to close the gap.",
      climax: "A contest that could go either way, against expectation.",
      fall: "The outcome upends — or confirms — the assumed hierarchy.",
    },
  },
  {
    id: "polti-adultery", name: "Adultery", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A committed relationship is broken by an affair.",
    acts: {
      setup: "A marriage or committed relationship is broken by an affair.",
      rise: "The affair deepens, and discovery becomes more likely.",
      climax: "The affair is discovered, or a choice between partners must be made.",
      fall: "The relationships that survive are changed for good.",
    },
  },
  {
    id: "polti-crimes-of-love", name: "Crimes of Love", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "Love drives a character toward something transgressive.",
    acts: {
      setup: "Love drives a character toward something transgressive.",
      rise: "The transgression compounds, harder to undo with each step.",
      climax: "The crime committed for love comes to a head.",
      fall: "Judgment, forgiveness, or ruin follows.",
    },
  },
  {
    id: "polti-discovery-dishonor-loved-one", name: "Discovery of the Dishonor of a Loved One", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "Someone trusted turns out not to be who they seemed.",
    acts: {
      setup: "A character believes fully in someone they love.",
      rise: "Signs accumulate that this person isn't who they seem.",
      climax: "The dishonor is fully revealed.",
      fall: "The relationship, and the character's trust, must be rebuilt or ended.",
    },
  },
  {
    id: "polti-obstacles-love", name: "Obstacles to Love", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "Two people who belong together are kept apart.",
    acts: {
      setup: "Two people who belong together are kept apart by circumstance.",
      rise: "Each attempt to close the distance meets a new obstacle.",
      climax: "The final, hardest obstacle stands between them.",
      fall: "They're united — or the obstacle proves too much.",
    },
  },
  {
    id: "polti-enemy-loved", name: "An Enemy Loved", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A character falls for someone they should oppose.",
    acts: {
      setup: "A character falls for someone they should, by every rule, oppose.",
      rise: "Loyalty and feeling pull in opposite directions.",
      climax: "A choice must be made between the enemy and the character's own side.",
      fall: "The choice is lived with, whatever it cost.",
    },
  },
  {
    id: "polti-ambition", name: "Ambition", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A character wants power, status or achievement badly.",
    acts: {
      setup: "A character wants power, status or achievement badly.",
      rise: "They climb toward it, compromising more with each step.",
      climax: "The final push for what they've been chasing.",
      fall: "They get it — and find out what it actually costs to hold.",
    },
  },
  {
    id: "polti-conflict-with-god", name: "Conflict with a God", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A character defies a power far greater than themselves.",
    acts: {
      setup: "A character defies a power far greater than themselves.",
      rise: "The consequences of that defiance close in.",
      climax: "A direct confrontation with the greater power.",
      fall: "The character submits, is punished, or — rarely — prevails.",
    },
  },
  {
    id: "polti-mistaken-jealousy", name: "Mistaken Jealousy", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A character wrongly believes they've been betrayed.",
    acts: {
      setup: "A character comes to believe, wrongly, that they've been betrayed.",
      rise: "The false belief drives them to act against the person they love.",
      climax: "The jealousy-driven act reaches its worst point.",
      fall: "The mistake is revealed — often too late to undo the harm.",
    },
  },
  {
    id: "polti-erroneous-judgment", name: "Erroneous Judgment", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A character or authority is deceived into a false belief.",
    acts: {
      setup: "A character (or authority) is deceived into believing something false.",
      rise: "Decisions are made on the strength of that false belief.",
      climax: "The judgment is acted on, with real consequences.",
      fall: "The truth surfaces, and the wrongly judged party's fate is decided.",
    },
  },
  {
    id: "polti-remorse", name: "Remorse", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A character has done something they can't undo.",
    acts: {
      setup: "A character has done something they can't undo.",
      rise: "The weight of it grows harder to carry or hide.",
      climax: "The remorse demands to be faced, openly.",
      fall: "Some form of atonement, forgiveness, or ruin follows.",
    },
  },
  {
    id: "polti-recovery-lost-one", name: "Recovery of a Lost One", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "Someone precious, long lost, might be found after all.",
    acts: {
      setup: "Someone precious has been lost — to distance, presumed death, or estrangement.",
      rise: "A thread of hope that they might be found after all.",
      climax: "The moment of true recognition, if it comes.",
      fall: "Reunion — or confirmation that they're truly gone.",
    },
  },
  {
    id: "polti-loss-loved-ones", name: "Loss of Loved Ones", taxonomy: "Polti's 36 Dramatic Situations",
    blurb: "A character's world includes people they can't imagine losing.",
    acts: {
      setup: "A character's world includes people they can't imagine losing.",
      rise: "Circumstances threaten one or more of them.",
      climax: "The loss occurs.",
      fall: "The character goes on, changed by what's gone.",
    },
  },

  // ===== Vonnegut's Story Shapes ===== (these describe the shape of fortune over time, not plot content)
  {
    id: "vonnegut-man-in-hole", name: "Man in a Hole", taxonomy: "Vonnegut's Story Shapes",
    blurb: "Fortune falls into trouble, then climbs back out higher than it started.",
    acts: {
      setup: "Things start out fine — an ordinary, stable position.",
      rise: "Fortune drops sharply into trouble, worse and worse.",
      climax: "The low point — deepest in the hole, hardest to see a way out.",
      fall: "A climb back out, ending better off than the story began.",
    },
  },
  {
    id: "vonnegut-boy-meets-girl", name: "Boy Meets Girl", taxonomy: "Vonnegut's Story Shapes",
    blurb: "A wonderful thing is nearly lost, then won for good.",
    acts: {
      setup: "An ordinary person spots something wonderful, just out of reach.",
      rise: "Obstacles and complications keep the goal at arm's length.",
      climax: "The goal seems lost for good.",
      fall: "It's won after all — fortune ends high, higher than it started.",
    },
  },
  {
    id: "vonnegut-cinderella", name: "Cinderella", taxonomy: "Vonnegut's Story Shapes",
    blurb: "A lucky rise, a sudden collapse, then a rise higher still.",
    acts: {
      setup: "A low starting position, with a sudden lucky break.",
      rise: "Fortune climbs, then suddenly collapses back down.",
      climax: "The low point returns, seemingly permanent this time.",
      fall: "An even higher rise than before — fortune ends at its peak.",
    },
  },
  {
    id: "vonnegut-bad-to-worse", name: "From Bad to Worse", taxonomy: "Vonnegut's Story Shapes",
    blurb: "An unremarkable start declines steadily, with no recovery.",
    acts: {
      setup: "An unremarkable, even comfortable starting position.",
      rise: "An unexplained, irreversible turn for the worse.",
      climax: "Fortune keeps declining, with no rescue in sight.",
      fall: "The decline continues to its end — no recovery, no reprieve.",
    },
  },
  {
    id: "vonnegut-which-way-up", name: "Which Way Is Up?", taxonomy: "Vonnegut's Story Shapes",
    blurb: "Whether fortune is rising or falling stays genuinely unclear.",
    acts: {
      setup: "Fortune's direction is genuinely unclear from the start.",
      rise: "Good and bad news keep contradicting each other.",
      climax: "It's still not clear, right up to the climax, whether this is a good or bad turn.",
      fall: "The ending leaves it deliberately ambiguous whether fortune rose or fell.",
    },
  },
  {
    id: "vonnegut-creation-story", name: "Creation Story", taxonomy: "Vonnegut's Story Shapes",
    blurb: "A steady, uninterrupted climb from nothing to everything.",
    acts: {
      setup: "Fortune begins at its lowest possible point — nothing at all.",
      rise: "A steady, uninterrupted climb.",
      climax: "The climb continues, unbroken, toward its highest point.",
      fall: "Fortune ends at its peak, all in one long ascent.",
    },
  },

  // ===== The MICE Quotient ===== (defined by what opens and closes the story)
  {
    id: "mice-milieu", name: "Milieu", taxonomy: "The MICE Quotient",
    blurb: "The story opens by entering a place, and closes by leaving it.",
    acts: {
      setup: "The story opens by entering a distinct place or world.",
      rise: "The place is explored, its rules and dangers discovered.",
      climax: "The place itself reaches a turning point — changed, escaped, or fully understood.",
      fall: "The story closes by leaving the place, or the place settling into its new state.",
    },
  },
  {
    id: "mice-idea", name: "Idea", taxonomy: "The MICE Quotient",
    blurb: "The story opens on a question, and closes once it's answered.",
    acts: {
      setup: "The story opens with a question that demands an answer.",
      rise: "Investigation gathers information, false leads included.",
      climax: "The answer is within reach, at its most uncertain.",
      fall: "The question is answered, and the story ends there.",
    },
  },
  {
    id: "mice-character", name: "Character", taxonomy: "The MICE Quotient",
    blurb: "The story opens on a role outgrown, and closes once a new one is settled.",
    acts: {
      setup: "The story opens with a character dissatisfied with their role or identity.",
      rise: "They test other ways of being, against resistance.",
      climax: "A decisive choice about who they're going to be.",
      fall: "The story ends once that identity is settled, for better or worse.",
    },
  },
  {
    id: "mice-event", name: "Event", taxonomy: "The MICE Quotient",
    blurb: "The story opens on a disrupted order, and closes once a new one holds.",
    acts: {
      setup: "The story opens with an order disrupted.",
      rise: "The disruption spreads, and things get worse before they get better.",
      climax: "The turning point where the disruption starts to be brought under control.",
      fall: "The story ends once a new order is established.",
    },
  },
];

export const plotTypeById = id => PLOT_TYPES.find(p => p.id === id) || null;

// groups PLOT_TYPES by taxonomy, in first-seen order, for the picker's <optgroup>s
export const plotTypesByTaxonomy = () => {
  const groups = [];
  for (const p of PLOT_TYPES) {
    let g = groups.find(g => g.taxonomy === p.taxonomy);
    if (!g) { g = { taxonomy: p.taxonomy, items: [] }; groups.push(g); }
    g.items.push(p);
  }
  return groups;
};
