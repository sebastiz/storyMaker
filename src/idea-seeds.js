// Data + sentence-builder for the Seed tab's idea generator. Each list is picked to be broad
// rather than clever — the generator's whole value is coverage, so a writer bored of one
// combination can just reroll into a very different one.

// phrased to read naturally after "who" — e.g. "a blacksmith … who wants to be famous"
export const CHARACTER_NEEDS = [
  "wants to be famous", "wants to be loved", "wants to be feared", "wants to be forgiven",
  "needs forgiveness", "needs to forgive themselves", "wants revenge", "wants vengeance against a betrayer",
  "needs redemption", "needs to atone for a past mistake", "wants power", "wants control",
  "needs freedom", "wants freedom from duty", "needs to escape a life chosen for them",
  "wants to belong somewhere", "needs a sense of belonging", "wants acceptance", "needs approval from a parent",
  "needs to be needed", "wants to matter", "needs safety", "wants adventure", "needs purpose",
  "wants recognition", "needs to prove themselves", "wants wealth", "needs justice",
  "wants justice for a wrong done to them", "wants immortality", "needs closure", "wants a legacy",
  "needs connection", "wants true love", "needs to let go of the past", "wants status",
  "needs stability", "wants transformation", "needs healing", "wants perfection", "needs meaning",
  "wants to escape their past", "needs to protect someone they love", "needs faith restored",
  "wants independence", "needs guidance", "wants respect", "needs mercy", "needs to be understood",
  "wants glory", "needs peace", "wants knowledge", "needs courage", "wants a home", "needs family",
  "wants to outrun a reputation", "needs to keep a promise", "wants one last chance",
  "needs to be the hero of their own story", "wants to be seen", "needs to matter to someone",
  "wants to right an old wrong", "needs to break a family curse", "wants control over their own fate",
];

// spans eras deliberately, since "job" and "time period" are picked independently
export const CHARACTER_JOBS = [
  "farmer", "shepherd", "hunter", "fisherman", "blacksmith", "carpenter", "mason", "weaver",
  "potter", "innkeeper", "cook", "baker", "servant", "maid", "midwife", "healer", "apothecary",
  "alchemist", "scribe", "merchant", "trader", "moneylender", "sailor", "shipwright", "pirate",
  "smuggler", "soldier", "mercenary", "knight", "squire", "archer", "general", "spy", "assassin",
  "gladiator", "priest", "monk", "nun", "bishop", "missionary", "cult leader", "witch",
  "fortune teller", "town crier", "jester", "minstrel", "traveling performer", "thief", "beggar",
  "outlaw", "bounty hunter", "gravedigger", "executioner", "undertaker", "gambler", "con artist",
  "king", "queen", "prince", "princess", "noble", "courtier", "diplomat", "governor", "tax collector",
  "explorer", "cartographer", "colonist", "plantation owner", "slave", "abolitionist",
  "factory worker", "coal miner", "railway engineer", "telegraph operator", "chimney sweep",
  "seamstress", "governess", "tutor", "lawyer", "judge", "journalist", "photographer",
  "police detective", "private investigator", "doctor", "surgeon", "nurse", "scientist",
  "engineer", "inventor", "professor", "student", "librarian", "clerk", "accountant", "banker",
  "politician", "activist", "revolutionary", "resistance fighter", "war correspondent", "pilot",
  "radio operator", "code breaker", "prisoner of war", "refugee", "immigrant", "factory foreman",
  "union organizer", "civil rights activist", "artist", "painter", "sculptor", "writer", "poet",
  "musician", "composer", "actor", "director", "chef", "waiter", "bartender", "taxi driver",
  "truck driver", "mechanic", "electrician", "plumber", "firefighter", "paramedic",
  "police officer", "prosecutor", "social worker", "therapist", "teacher", "coach", "athlete",
  "programmer", "hacker", "startup founder", "CEO", "influencer", "streamer", "gig driver",
  "park ranger", "veterinarian", "zookeeper", "archaeologist", "anthropologist", "diplomat's aide",
  "security guard", "bodyguard", "ex-convict", "smuggler's apprentice", "astronaut", "cosmonaut",
  "colonist on a new world", "starship engineer", "AI researcher", "terraformer", "space miner",
  "android technician",
];

// each entry's `phrase` is written to slot into "during {phrase}"
export const TIME_PERIODS = [
  { label: "Prehistory", phrase: "prehistory, before writing existed" },
  { label: "The Bronze Age", phrase: "the Bronze Age" },
  { label: "Ancient times (~500 BC)", phrase: "ancient times" },
  { label: "Classical Antiquity", phrase: "classical antiquity" },
  { label: "The Early Middle Ages", phrase: "the early Middle Ages" },
  { label: "The High Middle Ages", phrase: "the High Middle Ages" },
  { label: "The Late Middle Ages", phrase: "the late Middle Ages" },
  { label: "The Renaissance", phrase: "the Renaissance" },
  { label: "The Age of Exploration", phrase: "the Age of Exploration" },
  { label: "The 1600s", phrase: "the 1600s" },
  { label: "The 1700s", phrase: "the 1700s" },
  { label: "The Regency era (early 1800s)", phrase: "the Regency era" },
  { label: "The Victorian era", phrase: "the Victorian era" },
  { label: "The Industrial Revolution", phrase: "the Industrial Revolution" },
  { label: "The American Civil War era", phrase: "the American Civil War era" },
  { label: "The Belle Époque", phrase: "the Belle Époque" },
  { label: "World War I", phrase: "World War I" },
  { label: "The Roaring Twenties", phrase: "the Roaring Twenties" },
  { label: "The Great Depression", phrase: "the Great Depression" },
  { label: "The Second World War", phrase: "the Second World War" },
  { label: "The post-war 1950s", phrase: "the post-war 1950s" },
  { label: "The 1960s", phrase: "the 1960s" },
  { label: "The Cold War", phrase: "the Cold War" },
  { label: "The 1970s", phrase: "the 1970s" },
  { label: "The 1980s", phrase: "the 1980s" },
  { label: "The 1990s", phrase: "the 1990s" },
  { label: "The turn of the millennium", phrase: "the turn of the millennium" },
  { label: "Last century", phrase: "the last century" },
  { label: "Present day", phrase: "the present day" },
  { label: "The near future", phrase: "the near future" },
  { label: "The distant future", phrase: "the distant future" },
  { label: "A post-apocalyptic future", phrase: "a post-apocalyptic future" },
];

// UN member and observer states, written without a leading "the" — COUNTRIES_NEEDING_THE below
// supplies it in the sentence for the handful of names that read wrong without it
export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh",
  "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile",
  "China", "Colombia", "Comoros", "Democratic Republic of the Congo",
  "Republic of the Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark",
  "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
  "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala",
  "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India",
  "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan",
  "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia",
  "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
  "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa",
  "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
  "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
  "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
  "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
  "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];

const COUNTRIES_NEEDING_THE = new Set([
  "Bahamas", "Central African Republic", "Comoros", "Czechia", "Democratic Republic of the Congo",
  "Dominican Republic", "Gambia", "Ivory Coast", "Maldives", "Marshall Islands", "Netherlands",
  "Philippines", "Republic of the Congo", "Seychelles", "Solomon Islands",
  "United Arab Emirates", "United Kingdom", "United States",
]);

const VOWEL_SOUND = /^[aeiou]/i;
const article = word => (VOWEL_SOUND.test(word) ? "an" : "a");
const countryPhrase = country => (COUNTRIES_NEEDING_THE.has(country) ? `the ${country}` : country);

// one clause per character, e.g. "A blacksmith (Antagonist) who wants power." — or, once named,
// "Elena, a blacksmith (Antagonist), who wants power."
export function buildCharacterClause({ name, need, job, categoryLabel }) {
  if (!need || !job) return "";
  const a = article(job);
  const roleLabel = categoryLabel ? ` (${categoryLabel})` : "";
  if (name && name.trim()) return `${name.trim()}, ${a} ${job}${roleLabel}, who ${need}.`;
  const cap = `${a[0].toUpperCase()}${a.slice(1)}`;
  return `${cap} ${job}${roleLabel} who ${need}.`;
}

// "In France during the Second World War" — no trailing punctuation, since it's a lead-in
export function buildSettingClause({ country, timePhrase }) {
  if (!country || !timePhrase) return "";
  return `In ${countryPhrase(country)} during ${timePhrase}`;
}

// stitches a setting and any number of character clauses into one seed paragraph, skipping
// whichever half is left blank rather than demanding every field be filled in
export function buildSeedParagraph({ country, timePhrase, characters }) {
  const setting = buildSettingClause({ country, timePhrase });
  const clauses = (characters || []).map(buildCharacterClause).filter(Boolean);
  if (!setting) return clauses.join(" ");
  if (clauses.length === 0) return `${setting}.`;
  return `${setting}: ${clauses.join(" ")}`;
}

export const randomOf = list => list[Math.floor(Math.random() * list.length)];
