import { useEffect, useMemo, useRef, useState } from "react";
import { ACTS, STRUCTURES, structureById } from "./structures.js";
import { plotTypeById, plotTypesByTaxonomy } from "./plot-types.js";
import { examplesFor, exampleById } from "./examples.js";
import { CHARACTER_NEEDS, CHARACTER_JOBS, TIME_PERIODS, COUNTRIES, buildSeedParagraph, randomOf } from "./idea-seeds.js";
// Story Wheel — a linear, Arrangement-View-style story-structure sketchpad
const APP_VERSION = "dev";   // replaced with package.json version at build time (scripts/build.mjs)

/* ===== storage ===== */
const LS_PROJECTS = "storywheel.v1.projects";
const LS_ACTIVE = "storywheel.v1.active";
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `id${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`);

function loadProjects() {
  try {
    const raw = localStorage.getItem(LS_PROJECTS);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(withDefaults) : [];
  } catch { return []; }
}
function saveProjects(projects) {
  try { localStorage.setItem(LS_PROJECTS, JSON.stringify(projects)); } catch {}
}
function loadActiveId() {
  try { return localStorage.getItem(LS_ACTIVE) || null; } catch { return null; }
}
function saveActiveId(id) {
  try { localStorage.setItem(LS_ACTIVE, id || ""); } catch {}
}

function newProject(structureId = "three-act") {
  const now = Date.now();
  return {
    id: uid(), title: "Untitled Story", structureId, seed: "", need: "", genre: "", logline: "", plotType: "",
    plotTypeExample: "",
    beats: {}, characters: [], interactions: [], createdAt: now, updatedAt: now,
  };
}
// fills in any field a newer app version added (e.g. `seed`) that an older saved/imported
// project won't have, without disturbing anything the project already has
const withDefaults = project => ({ ...newProject(project.structureId), ...project });

/* ===== geometry =====
   Everything downstream works in plain 0-100 percentages of the timeline's width — no angles, no
   polar math. A beat's a0/a1 is just "starts at this % across, ends at that %". */
// each segment is drawn at least MIN_SHARE wide so a single-beat "moment" (a 1%-of-story catalyst)
// stays clickable and legible — the timeline reads proportionally without any clip vanishing
const MIN_SHARE = 4;
function segments(beats) {
  const shares = beats.map(b => Math.max(b.pct, MIN_SHARE));
  const total = shares.reduce((s, n) => s + n, 0);
  let pos = 0;
  return beats.map((b, i) => {
    const span = (shares[i] / total) * 100;
    const a0 = pos, a1 = pos + span;
    pos = a1;
    return { beat: b, a0, a1, mid: (a0 + a1) / 2 };
  });
}
const wordCount = s => (s && s.trim() ? s.trim().split(/\s+/).length : 0);
const ACT3_LABEL = { 1: "Act 1", 2: "Act 2", 3: "Act 3" };
// groups a timeline's segments into contiguous runs sharing the same key (beats are authored in
// non-decreasing threeAct AND act order, so this always yields clean runs, not scattered ones) —
// used both for the Acts track and for lining up two structures' acts in Compare view
function groupSlices(slices, keyFn) {
  const groups = [];
  for (const s of slices) {
    const key = keyFn(s.beat);
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.a1 = s.a1;
    else groups.push({ key, a0: s.a0, a1: s.a1 });
  }
  return groups;
}

/* ===== timeline =====
   A linear Arrangement-View layout: horizontal tracks stacked top to bottom over one shared
   timeline (the story, left = start, right = end). Track order: Beats (the primary track) ->
   Written (a per-beat clip/empty-slot overlay of the same track) -> Acts (a 3-clip summary
   track) -> two character-lane groups, always on: the chosen example's characters, then — kept
   visually separate — the story's own, each character getting its own row/lane rather than every
   character's line sharing one axis. */
function Timeline({ structure, project, selected, onSelect, plotTypeExample }) {
  // which lines are hidden, keyed "ref:<category>" for the chosen example's characters and
  // "char:<id>" for the story's own — plain UI state, not worth persisting to the project
  const [hiddenLines, setHiddenLines] = useState(() => new Set());
  const toggleLine = key => setHiddenLines(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });
  const referenceCharacters = plotTypeExample?.characters || [];
  const slices = useMemo(() => segments(structure.beats), [structure]);
  const acts3 = useMemo(() => groupSlices(slices, b => b.threeAct), [slices]);
  const actGroups = useMemo(() => groupSlices(slices, b => b.act), [slices]);
  const done = structure.beats.filter(b => wordCount(project.beats[b.id]) > 0).length;
  // a v1 visual marker only — an act where 2+ characters flagged "interacts here", not an attempt
  // to actually reconcile or force their lines together at that point. Keeps who, not just how
  // many, so the marker can name names on hover instead of just flagging that something happened.
  // Reference characters are keyed by name, since they have no id of their own.
  const groupInteractions = (chars, idOf) => {
    const groups = {};
    for (const key of Object.keys(ACTS)) {
      const here = (chars || []).filter(c => c.interacts?.[key]);
      if (here.length >= 2) groups[key] = here.map(c => ({ id: idOf(c), name: c.name || "Unnamed", color: CATEGORY_COLORS[c.category || "other"] }));
    }
    return groups;
  };
  const referenceInteractionGroups = useMemo(() => groupInteractions(referenceCharacters, c => c.name), [referenceCharacters]);
  const arcX = key => {
    const g = actGroups.find(a => a.key === key);
    return g ? ((g.a0 + g.a1) / 2) * 10 : 0;
  };
  // the same four act-group spans the Beats track colors by, converted to the 0-1000 scale the
  // lanes below plot on — drawn as a faint background band per row so a character's line reads
  // against the story's actual structure instead of floating on a blank axis of its own
  const actBands = actGroups.map(g => ({ key: g.key, x0: g.a0 * 10, x1: g.a1 * 10 }));
  return (
    <div className="timeline" role="img" aria-label={`${structure.name} timeline`}>
      <div className="tl-summary">
        <span className="tl-summary-title">{project.title || "Untitled Story"}</span>
        <span className="tl-summary-sub">{done} / {structure.beats.length} beats</span>
      </div>

      <div className="tl-track">
        <div className="tl-label">Beats</div>
        <div className="tl-lane tl-lane-beats">
          {slices.map(({ beat, a0, a1 }, i) => {
            const isSel = selected === beat.id;
            const hasText = wordCount(project.beats[beat.id]) > 0;
            return (
              <div key={beat.id} className={`tl-clip${isSel ? " is-sel" : ""}`}
                style={{ left: a0 + "%", width: (a1 - a0) + "%", background: ACTS[beat.act].color, opacity: isSel ? 1 : hasText ? 0.88 : 0.45 }}
                onClick={() => onSelect(beat.id)} title={beat.name}>
                {a1 - a0 > 4 && <span className="tl-clip-label">{i + 1}</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="tl-track tl-track-thin">
        <div className="tl-label">Written</div>
        <div className="tl-lane tl-lane-written">
          {slices.map(({ beat, a0, a1 }) => {
            const hasText = wordCount(project.beats[beat.id]) > 0;
            return hasText ? (
              <div key={beat.id} className="tl-clip tl-clip-filled"
                style={{ left: a0 + "%", width: (a1 - a0) + "%", background: ACTS[beat.act].color }} />
            ) : (
              <div key={beat.id} className="tl-clip tl-clip-empty" style={{ left: a0 + "%", width: (a1 - a0) + "%" }} />
            );
          })}
        </div>
      </div>

      <div className="tl-track">
        <div className="tl-label">Acts</div>
        <div className="tl-lane tl-lane-acts">
          {acts3.map(({ key, a0, a1 }) => (
            <div key={key} className="tl-clip tl-clip-act" style={{ left: a0 + "%", width: (a1 - a0) + "%" }}>
              <span className="tl-clip-label">{ACT3_LABEL[key]}</span>
            </div>
          ))}
        </div>
      </div>

      <CharacterLanes trackLabel="Character arcs"
        emptyMessage="Pick a plot type and an example above to see its characters' arcs here."
        items={referenceCharacters.map(c => ({
          key: c.name, category: c.category, name: c.name,
          points: Object.keys(ACTS).map(k => [arcX(k), arcY(c.values?.[k] ?? 0)]),
        }))}
        keyPrefix="ref" dashed hiddenLines={hiddenLines} toggleLine={toggleLine} arcX={arcX} actBands={actBands}
        interactionGroups={referenceInteractionGroups} />
    </div>
  );
}

// one row per character — its own small fortune sparkline, stacked rather than overlaid — plus,
// when interactionGroups is given, an SVG overlay drawn on top spanning every row: a vertical
// connector between whichever rows meet in a given act, so "who's on top" per act and "who meets
// whom" are both readable without one line's
// shape ever being mistaken for another's on a shared axis
function CharacterLanes({ trackLabel, emptyMessage, items, keyPrefix, dashed, hiddenLines, toggleLine, arcX, actBands, interactionGroups }) {
  const rowOf = Object.fromEntries(items.map((c, i) => [c.key, i]));
  const connectors = interactionGroups ? Object.entries(interactionGroups)
    .map(([act, who]) => ({ act, rows: who.map(c => rowOf[c.id]).filter(i => i !== undefined).sort((a, b) => a - b) }))
    .filter(c => c.rows.length >= 2) : [];
  const catLabel = c => CATEGORY_LABELS[c.category || "other"];
  return (
    <div className="tl-track char-lanes-track">
      <div className="tl-label">{trackLabel}</div>
      {items.length === 0 ? (
        <p className="arcline-empty">{emptyMessage}</p>
      ) : (
        <div className="char-lanes-col">
        <div className="char-lanes">
          {items.map(c => {
            const lineKey = `${keyPrefix}:${c.key}`;
            const isOff = hiddenLines.has(lineKey);
            const color = CATEGORY_COLORS[c.category || "other"];
            const points = c.points;
            const pointsAttr = points.map(p => p.join(",")).join(" ");
            return (
              <div key={lineKey} className={`char-lane${isOff ? " is-off" : ""}`}>
                <button type="button" className="char-lane-label" onClick={() => toggleLine(lineKey)}
                  title={isOff ? "Click to show this line" : "Click to hide this line"}>
                  <i className={dashed ? "legend-swatch-dashed" : undefined} style={{ background: color }} />
                  {c.name} <span className="char-lane-label-cat">{catLabel(c)}</span>
                </button>
                {/* same width as the Beats/Acts lanes above (no side-by-side label eating into it) so
                    a character's line always sits under the same x position as its actual beat */}
                <div className="char-lane-chart">
                  <svg viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
                    {actBands?.map(b => (
                      <rect key={b.key} x={b.x0} y="0" width={b.x1 - b.x0} height="100" fill={ACTS[b.key].color} className="char-lane-band" />
                    ))}
                    <line x1="0" y1="50" x2="1000" y2="50" className="char-lane-midline" />
                    <polyline points={pointsAttr} className={`char-lane-path${dashed ? " char-lane-path-dashed" : ""}`} stroke={color} />
                    {!dashed && points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" className="char-lane-point" fill={color} />)}
                  </svg>
                </div>
              </div>
            );
          })}
          {connectors.length > 0 && (
            <svg className="char-lanes-connectors" viewBox={`0 0 1000 ${items.length}`} preserveAspectRatio="none" aria-hidden="true">
              {connectors.map(({ act, rows }) => {
                const x = arcX(act);
                const top = Math.min(...rows), bottom = Math.max(...rows);
                return (
                  <g key={act}>
                    <line x1={x} y1={top + 0.5} x2={x} y2={bottom + 0.5} className="char-lane-connector">
                      <title>{rows.map(i => items[i].name).join(" & ")} interact here</title>
                    </line>
                    {rows.map(i => (
                      <line key={i} x1={x - 14} y1={i + 0.5} x2={x + 14} y2={i + 0.5}
                        className="char-lane-connector-tick" stroke={CATEGORY_COLORS[items[i].category || "other"]} />
                    ))}
                  </g>
                );
              })}
            </svg>
          )}
        </div>
        {connectors.length > 0 && (
          // the dashed connector on the chart shows *that* something links two rows and roughly
          // where, but two same-category ticks look identical and hover-only tooltips aren't
          // discoverable (or usable on touch) — so who's actually meeting is spelled out here too
          <p className="char-lane-interactions">
            {connectors.map(({ act, rows }) => (
              <span key={act} className="char-lane-interaction-note">
                <b>{ACTS[act].label}:</b> {rows.map(i => items[i].name).join(" & ")}
              </span>
            ))}
          </p>
        )}
        </div>
      )}
    </div>
  );
}

// the grid always breaks the Three-Act Structure's own sections into their four acts — one fixed,
// simple reference for any plot type, independent of whichever of the 17 structures the current
// story actually uses (that's shown live in the arrangement view instead, above). A plot type's
// own example, when picked, appears alongside it, split into the same eight subsections — every
// plotType example carries a `sections` field (beat-id keyed, alongside its original act-keyed
// `beats` field used elsewhere, e.g. the Compare view) purely for this finer breakdown.
const GRID_STRUCTURE = structureById("three-act");
function ActTable({ structure, project, plotTypeExample }) {
  // if the current story is itself using the Three-Act Structure, its beats are exactly what
  // column 1 already shows — an extra column would just repeat it, so it only appears for the
  // other 16 structures
  const showStructureCol = structure.id !== GRID_STRUCTURE.id;
  return (
    <div className="act-table-wrap">
      <table className="act-table">
        <thead>
          <tr>
            <th>Act</th>
            {showStructureCol && <th>{structure.name} sections</th>}
            {plotTypeExample && <th>In {plotTypeExample.title}</th>}
            <th>Your writing</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="act-table-act">
              <div className="act-table-act-heading">Foundations</div>
              <ul className="act-table-list">
                <li>The Seed</li>
                <li>What the Protagonist Needs</li>
              </ul>
            </td>
            {showStructureCol && <td>—</td>}
            {plotTypeExample && <td>—</td>}
            <td>
              <ul className="act-table-list">
                <li>
                  <span className="act-table-beat-name">The Seed</span>
                  <span className={project.seed ? "" : "act-table-unwritten"}>{project.seed || "not written yet"}</span>
                </li>
                <li>
                  <span className="act-table-beat-name">What the Protagonist Needs</span>
                  <span className={project.need ? "" : "act-table-unwritten"}>{project.need || "not written yet"}</span>
                </li>
              </ul>
            </td>
          </tr>
          {Object.keys(ACTS).map(key => {
            const beats = GRID_STRUCTURE.beats.filter(b => b.act === key);
            const structureBeats = structure.beats.filter(b => b.act === key);
            return (
              <tr key={key}>
                <td className="act-table-act">
                  <div className="act-table-act-heading">
                    <span className="act-breakdown-swatch" style={{ background: ACTS[key].color }} />
                    {ACTS[key].label}
                  </div>
                  {beats.length > 0 && (
                    <ul className="act-table-list">
                      {beats.map(b => (
                        <li key={b.id}>
                          <span className="act-breakdown-swatch" style={{ background: ACTS[key].color }} />
                          {b.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                {showStructureCol && (
                  <td>
                    {structureBeats.length === 0 ? "—" : (
                      <ul className="act-table-list">
                        {structureBeats.map(b => (
                          <li key={b.id}>
                            <span className="act-breakdown-swatch" style={{ background: ACTS[key].color }} />
                            {b.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                )}
                {plotTypeExample && (
                  <td>
                    {beats.length === 0 ? "—" : (
                      <ul className="act-table-list">
                        {beats.map(b => (
                          <li key={b.id}>
                            <span className="act-breakdown-swatch" style={{ background: ACTS[key].color }} />
                            <span>
                              <span className="act-table-beat-name">{b.name}</span>
                              <span>{plotTypeExample.sections[b.id]}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                )}
                <td>
                  {structureBeats.length === 0 ? "—" : (
                    <ul className="act-table-list">
                      {structureBeats.map(b => {
                        const text = project.beats[b.id];
                        const interactionLines = beatInteractionLines(b.id, project.characters, project.interactions);
                        return (
                          <li key={b.id}>
                            <span className="act-breakdown-swatch" style={{ background: ACTS[key].color }} />
                            <span>
                              <span className="act-table-beat-name">{b.name}</span>
                              <span className={text ? "" : "act-table-unwritten"}>{text || "not written yet"}</span>
                              {interactionLines.map(l => (
                                <span key={l.id} className="act-table-interaction-line" style={{ color: INTERACTION_COLORS[l.type] }}>
                                  {l.text}
                                </span>
                              ))}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
/* ===== beat editor ===== */

// two pre-beat sub-tabs shown ahead of the structure's own beats — story foundations that exist
// before any structure is picked, so they stay constant across structures rather than living
// inside one. Ids are namespaced so they can never collide with a real beat id.
const SEED_TAB = "__seed__";
const NEED_TAB = "__need__";
const FOUNDATION_TABS = [
  { id: SEED_TAB, name: "The Seed", guide: "The spark this story started from — a line, an image, a 'what if…'." },
  { id: NEED_TAB, name: "What the Protagonist Needs", guide: "What the protagonist actually needs by the end — not what they think they want." },
];

// exhaustive-ish dropdowns (setting: era / country, plus one full card per character — name, type,
// need, job, notes) that compile into one seed paragraph — an on-ramp for the blank-page problem,
// not a replacement for writing the seed out by hand. This is also where the story's cast gets
// defined; the Character Flow tab just draws each of these characters' fortune over the story.
function IdeaGenerator({ characters, onChangeCharacters, onUseSeed }) {
  const [timeIdx, setTimeIdx] = useState("");
  const [country, setCountry] = useState("");
  const timePhrase = timeIdx !== "" ? TIME_PERIODS[timeIdx].phrase : "";

  const setChar = (id, patch) => onChangeCharacters(characters.map(c => (c.id === id ? { ...c, ...patch } : c)));
  const removeChar = id => onChangeCharacters(characters.filter(c => c.id !== id));
  const addChar = () => {
    const used = new Set(characters.map(c => c.category));
    const category = CATEGORY_LIST.find(c => !used.has(c)) || CATEGORY_LIST[characters.length % CATEGORY_LIST.length];
    onChangeCharacters([...characters, { id: uid(), name: "", category, need: "", job: "", notes: "", arcPoints: {} }]);
  };

  const paragraph = buildSeedParagraph({
    country, timePhrase,
    characters: characters.map(c => ({ name: c.name, need: c.need, job: c.job, categoryLabel: CATEGORY_LABELS[c.category || "other"] })),
  });

  const randomize = () => {
    onChangeCharacters(characters.map(c => ({ ...c, need: randomOf(CHARACTER_NEEDS), job: randomOf(CHARACTER_JOBS) })));
    setTimeIdx(String(Math.floor(Math.random() * TIME_PERIODS.length)));
    setCountry(randomOf(COUNTRIES));
  };

  return (
    <div className="idea-gen">
      <div className="idea-gen-grid">
        <label>Time period
          <select value={timeIdx} onChange={e => setTimeIdx(e.target.value)}>
            <option value="">Choose…</option>
            {TIME_PERIODS.map((t, i) => <option key={t.label} value={i}>{t.label}</option>)}
          </select>
        </label>
        <label>Country
          <select value={country} onChange={e => setCountry(e.target.value)}>
            <option value="">Choose…</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </div>

      <div className="idea-gen-chars">
        {characters.length === 0 && <p className="empty">No characters yet — add your first below.</p>}
        {characters.map(c => (
          <div className="idea-gen-char-card" key={c.id}>
            <div className="idea-gen-char-row1">
              <input placeholder="Name" value={c.name} onChange={e => setChar(c.id, { name: e.target.value })} />
              <select value={c.category || "other"} onChange={e => setChar(c.id, { category: e.target.value })}
                style={{ color: CATEGORY_COLORS[c.category || "other"] }}>
                {CATEGORY_LIST.map(cat => <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>)}
              </select>
              <button type="button" className="icon-btn" onClick={() => removeChar(c.id)} title="Remove character">✕</button>
            </div>
            <div className="idea-gen-char-row2">
              <select value={c.need} onChange={e => setChar(c.id, { need: e.target.value })}>
                <option value="">Need…</option>
                {CHARACTER_NEEDS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <select value={c.job} onChange={e => setChar(c.id, { job: e.target.value })}>
                <option value="">Job…</option>
                {CHARACTER_JOBS.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            <textarea className="idea-gen-char-notes" rows={2} placeholder="Notes — background, personality, anything else"
              value={c.notes || ""} onChange={e => setChar(c.id, { notes: e.target.value })} />
          </div>
        ))}
      </div>
      <button type="button" className="ghost-btn idea-gen-add" onClick={addChar}>+ Add character</button>

      <p className="idea-gen-preview">
        {paragraph || "Add a setting and at least one character's need and job to build a seed…"}
      </p>
      <div className="idea-gen-actions">
        <button type="button" className="ghost-btn" disabled={characters.length === 0} onClick={randomize}>🎲 Surprise me</button>
        <button type="button" className="primary-btn" disabled={!paragraph} onClick={() => onUseSeed(paragraph)}>
          Use as seed
        </button>
      </div>
    </div>
  );
}

function FoundationEditor({ title, guide, text, onChange }) {
  return (
    <div className="beat-editor">
      <h3>{title}</h3>
      <p className="guide">{guide}</p>
      <textarea value={text} placeholder="Write it out, or just jot what has to happen…"
        onChange={e => onChange(e.target.value)} rows={12} />
      <div className="wc">{wordCount(text)} words</div>
    </div>
  );
}

// exactly one worked example ever shows per beat: the plot-type example the user actually picked
// from a dropdown, using its exact beat-by-beat text (falling back to its coarser per-act text on
// the rare beat that misses it); or, when nothing's picked, the current structure's own dedicated
// example — every structure has exactly one, always available, mapped onto that structure's real
// beats. Never both at once; two unrelated "In ..." boxes on the same beat is clutter, not help.
function BeatEditor({ beat, text, onChange, plotType, plotTypeExample, structureExample, characters, interactions }) {
  const interactionLines = beatInteractionLines(beat.id, characters, interactions);
  const activeExample = plotTypeExample
    ? { title: plotTypeExample.title, text: plotTypeExample.sections?.[beat.id] ?? plotTypeExample.beats?.[beat.act] }
    : structureExample
      ? { title: structureExample.title, text: structureExample.beats?.[beat.id] }
      : null;
  return (
    <div className="beat-editor">
      <h3>{beat.name}</h3>
      <p className="guide">{beat.guide}</p>
      <p className="beat-ex-line">e.g. <em>{beat.ex}</em></p>
      {plotType && (
        <p className="plot-type-note">
          <span className="plot-type-note-tax">{plotType.taxonomy}</span>
          <span style={{ color: ACTS[beat.act].color }}>{plotType.name}:</span> {plotType.acts[beat.act]}
        </p>
      )}
      {activeExample?.text && (
        <p className="example-note">
          <span className="example-note-tag">In {activeExample.title}</span> — {activeExample.text}
        </p>
      )}
      <textarea value={text} placeholder="Write the scene, or just jot what has to happen…"
        onChange={e => onChange(e.target.value)} rows={12} />
      <div className="wc">{wordCount(text)} words</div>
      {interactionLines.length > 0 && (
        // mirrors an interaction's dotted connector on the Character Flow grid — surfaced here too,
        // after the notes above rather than inside them, so it never touches the writer's own prose
        <div className="beat-interaction-lines">
          {interactionLines.map(l => (
            <p key={l.id} className="beat-interaction-line" style={{ color: INTERACTION_COLORS[l.type] }}>{l.text}</p>
          ))}
        </div>
      )}
    </div>
  );
}
// seven named character functions get their own hue; "other" gets the app's neutral dim gray
// instead of an eighth hue, so the palette stays as seven distinct, memorable colours plus a
// deliberate "uncategorized" default
const CATEGORY_LIST = ["protagonist", "antagonist", "ally", "mentor", "love-interest", "foil", "threshold-guardian", "other"];
const CATEGORY_LABELS = {
  protagonist: "Protagonist", antagonist: "Antagonist", ally: "Ally", mentor: "Mentor",
  "love-interest": "Love Interest", foil: "Foil", "threshold-guardian": "Threshold Guardian", other: "Other",
};
const CATEGORY_COLORS = {
  protagonist: "#E9C88A", antagonist: "#D2785A", ally: "#5FA8A0", mentor: "#8E7CC3",
  "love-interest": "#D98CA8", foil: "#C97B3D", "threshold-guardian": "#6FA3D8", other: "#8B8398",
};
// deliberately separate from the category palette above — an interaction's color says how it went
// (good/bad/neither), not who was in it, so it stays legible however the two characters are colored
const INTERACTION_TYPES = ["positive", "negative", "neutral"];
const INTERACTION_LABELS = { positive: "Positive", negative: "Negative", neutral: "Neutral" };
const INTERACTION_ADVERBS = { positive: "positively", negative: "negatively", neutral: "neutrally" };
const INTERACTION_COLORS = { positive: "#6FBF73", negative: "#D2555A", neutral: "#9A93A8" };
// one plain sentence per interaction landing on this beat, e.g. "Elena interacts with Baron Voss
// negatively." — shared by the Act Table (after that beat's own notes) and the Beat editor (after
// the textarea), so both read the same underlying data the same way
function beatInteractionLines(beatId, characters, interactions) {
  const nameOf = id => characters?.find(c => c.id === id)?.name || "Unnamed";
  return (interactions || [])
    .filter(it => it.beatId === beatId)
    .map(it => ({ id: it.id, type: it.type, text: `${nameOf(it.aId)} interacts with ${nameOf(it.bId)} ${INTERACTION_ADVERBS[it.type]}.` }));
}
const clampArc = v => Math.max(-3, Math.min(3, Math.round(Number(v)) || 0));
// -3..3 fortune <-> the 0-100 y coordinate the arc charts (both the small timeline preview and the
// big draggable graph) share, so a drawn point and a plotted point always land in the same place
const arcY = v => 50 - (clampArc(v) / 3) * 40;
const arcValueFromY = yPct => clampArc(Math.round(((50 - yPct) / 40) * 3));
// a character's fortune, one entry per beat id. Old saves only ever scored fortune per *act* (four
// numbers); read through this so that data still draws as a (blocky) line instead of vanishing —
// any beat the new per-beat graph has actually been drawn over overrides its act's old value
function effectiveArcPoints(character, structure) {
  const legacy = {};
  if (character.arcValue) for (const b of structure.beats) legacy[b.id] = character.arcValue[b.act];
  return { ...legacy, ...(character.arcPoints || {}) };
}

/* ===== character flow ===== */
// every character's fortune line lives on one shared grid so they read against each other, not
// just against the acts — a click on a chip below picks which one a drag actually edits (drawing
// on a shared grid is otherwise ambiguous about which of several overlapping lines you mean to
// move); the rest keep showing, dimmed, for comparison. Dragging (mouse or finger) snaps x to the
// nearest beat/sub-act and y to the nearest integer -3..3; a fast swipe still fills in every column
// it crosses via linear interpolation, so the line stays continuous rather than only marking the
// columns a slow, precise drag happened to land on.
function CharacterFlowGraph({ characters, activeId, structure, interactions, onChangeActive }) {
  const segs = useMemo(() => segments(structure.beats), [structure]);
  const bands = useMemo(() => groupSlices(segs, b => b.act).map(g => ({ key: g.key, x0: g.a0 * 10, x1: g.a1 * 10 })), [segs]);
  const svgRef = useRef(null);
  const dragRef = useRef(null);

  const active = characters.find(c => c.id === activeId);

  const cellFromEvent = e => {
    const rect = svgRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    let index = segs.findIndex(s => xPct >= s.a0 && xPct < s.a1);
    if (index === -1) index = xPct < (segs[0]?.a0 ?? 0) ? 0 : segs.length - 1;
    return { index, value: arcValueFromY(yPct) };
  };
  const paint = (fromIndex, fromValue, toIndex, toValue) => {
    if (!active) return;
    const lo = Math.min(fromIndex, toIndex), hi = Math.max(fromIndex, toIndex);
    const span = toIndex - fromIndex;
    const patch = {};
    for (let i = lo; i <= hi; i++) {
      const t = span === 0 ? 1 : (i - fromIndex) / span;
      patch[segs[i].beat.id] = clampArc(Math.round(fromValue + (toValue - fromValue) * t));
    }
    onChangeActive({ ...active.arcPoints, ...patch });
  };
  const handleDown = e => {
    if (!active) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const { index, value } = cellFromEvent(e);
    paint(index, value, index, value);
    dragRef.current = { index, value };
  };
  const handleMove = e => {
    if (!dragRef.current) return;
    const { index, value } = cellFromEvent(e);
    paint(dragRef.current.index, dragRef.current.value, index, value);
    dragRef.current = { index, value };
  };
  const endDrag = () => { dragRef.current = null; };

  const lines = characters.map(c => {
    const effective = effectiveArcPoints(c, structure);
    const points = segs.map(s => [s.mid * 10, arcY(clampArc(effective[s.beat.id] ?? 0))]);
    return { id: c.id, color: CATEGORY_COLORS[c.category || "other"], points, isActive: c.id === activeId };
  });
  const lineOf = Object.fromEntries(lines.map(l => [l.id, l]));
  const nameOf = id => characters.find(c => c.id === id)?.name || "Unnamed";

  // a dotted connector between the two characters' current fortune at the beat they interact in —
  // several interactions landing on the same beat are nudged apart so they don't draw on top of
  // each other; each connector is colored by interaction type (positive/negative/neutral), not by
  // either character, since the line is about how the meeting went, not who was in it
  const byBeat = {};
  for (const it of interactions || []) {
    if (!lineOf[it.aId] || !lineOf[it.bId]) continue;
    const segIndex = segs.findIndex(s => s.beat.id === it.beatId);
    if (segIndex === -1) continue;
    (byBeat[it.beatId] ??= []).push({ ...it, segIndex });
  }
  const connectors = Object.values(byBeat).flatMap(group => {
    const baseX = segs[group[0].segIndex].mid * 10;
    return group.map((it, i) => ({
      ...it,
      x: baseX + (i - (group.length - 1) / 2) * 10,
      yA: lineOf[it.aId].points[it.segIndex][1],
      yB: lineOf[it.bId].points[it.segIndex][1],
      colorA: lineOf[it.aId].color, colorB: lineOf[it.bId].color,
    }));
  });

  return (
    <div className="arc-graph">
      <div className="arc-graph-yaxis"><span>+3</span><span>0</span><span>-3</span></div>
      <div className="arc-graph-main">
        <svg ref={svgRef} viewBox="0 0 1000 100" preserveAspectRatio="none" className="arc-graph-svg"
          onPointerDown={handleDown} onPointerMove={handleMove}
          onPointerUp={endDrag} onPointerLeave={endDrag} onPointerCancel={endDrag}>
          {bands.map(b => <rect key={b.key} x={b.x0} y="0" width={b.x1 - b.x0} height="100" fill={ACTS[b.key].color} className="char-lane-band" />)}
          {[-3, -2, -1, 0, 1, 2, 3].map(v => (
            <line key={v} x1="0" y1={arcY(v)} x2="1000" y2={arcY(v)} className={v === 0 ? "char-lane-midline" : "arc-grid-line"} />
          ))}
          {segs.slice(1).map((s, i) => <line key={i} x1={s.a0 * 10} y1="0" x2={s.a0 * 10} y2="100" className="arc-grid-line" />)}
          {lines.filter(l => !l.isActive).map(l => (
            <polyline key={l.id} points={l.points.map(p => p.join(",")).join(" ")}
              className="char-lane-path arc-graph-path-dim" stroke={l.color} />
          ))}
          {lines.filter(l => l.isActive).map(l => (
            <g key={l.id}>
              <polyline points={l.points.map(p => p.join(",")).join(" ")} className="char-lane-path" stroke={l.color} />
              {l.points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" className="arc-graph-point" fill={l.color} />)}
            </g>
          ))}
          {connectors.map(it => (
            <g key={it.id}>
              <line x1={it.x} y1={it.yA} x2={it.x} y2={it.yB} className="interaction-line" stroke={INTERACTION_COLORS[it.type]}>
                <title>{`${nameOf(it.aId)} & ${nameOf(it.bId)} — ${INTERACTION_LABELS[it.type]}`}</title>
              </line>
              <circle cx={it.x} cy={it.yA} r="3" fill={it.colorA} className="interaction-line-dot" />
              <circle cx={it.x} cy={it.yB} r="3" fill={it.colorB} className="interaction-line-dot" />
            </g>
          ))}
        </svg>
        <div className="arc-act-labels">
          {bands.map(b => (
            <span key={b.key} className="arc-act-label" style={{ left: (b.x0 / 10) + "%", width: ((b.x1 - b.x0) / 10) + "%" }}>
              {ACTS[b.key].label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// character identity (name, type, need, job, notes) is edited from the Seed tab's idea generator —
// this tab is purely for drawing fortune. All characters share one grid; the chip row below picks
// which character a drag on the grid actually edits.
function CharacterFlow({ characters, structure, interactions, onChange, onChangeInteractions }) {
  const [activeId, setActiveId] = useState(characters[0]?.id ?? null);
  useEffect(() => {
    if (!characters.some(c => c.id === activeId)) setActiveId(characters[0]?.id ?? null);
  }, [characters]);

  if (characters.length === 0) {
    return <p className="empty">No characters yet — add one from the Seed tab (name, type, need, job, notes), then come back here to draw their fortune.</p>;
  }
  const active = characters.find(c => c.id === activeId);
  const setArcPoints = (id, arcPoints) => onChange(characters.map(c => (c.id === id ? { ...c, arcPoints } : c)));

  return (
    <div className="character-flow">
      <div className="char-flow-legend">
        {characters.map(c => (
          <button key={c.id} type="button"
            className={`char-flow-chip${c.id === activeId ? " is-active" : ""}`}
            onClick={() => setActiveId(c.id)}>
            <i className="char-flow-swatch" style={{ background: CATEGORY_COLORS[c.category || "other"] }} />
            {c.name || "Unnamed"} <span className="char-flow-cat">{CATEGORY_LABELS[c.category || "other"]}</span>
          </button>
        ))}
      </div>
      <CharacterFlowGraph characters={characters} activeId={activeId} structure={structure} interactions={interactions}
        onChangeActive={arcPoints => setArcPoints(activeId, arcPoints)} />
      {active && (
        <div className="char-flow-active-info">
          <span>
            Drawing <b>{active.name || "Unnamed"}</b>
            {active.job && <> — {active.job}</>}
            {(active.need || active.summary) && <> — <i>{active.need || active.summary}</i></>}
          </span>
          <button type="button" className="icon-btn" title="Clear this character's fortune line"
            onClick={() => setArcPoints(activeId, {})}>↺</button>
        </div>
      )}
      <p className="char-sheet-hint">
        Click a character above, then drag across the grid — with a mouse or a finger — to draw their
        <b> fortune</b> over the story, from <b>-3</b> (rock bottom) to <b>3</b> (on top). Columns
        follow the acts and their beats (sub-acts); every character's line shows at once so you can
        compare them.
      </p>
      <h4 className="interactions-heading">Interactions</h4>
      <InteractionsTable characters={characters} structure={structure} interactions={interactions}
        onChange={onChangeInteractions} />
    </div>
  );
}

// who meets whom, where, and how it went — a plain table, since a dropdown-per-cell is easier to
// fill in accurately than trying to click two exact points on the shared grid above. Each row draws
// as a dotted connector on that grid, between the two characters' fortune at that beat.
function InteractionsTable({ characters, structure, interactions, onChange }) {
  const otherOf = id => characters.find(c => c.id !== id)?.id ?? id;
  const addRow = () => {
    const aId = characters[0].id;
    onChange([...interactions, { id: uid(), aId, bId: otherOf(aId), beatId: structure.beats[0].id, type: "neutral" }]);
  };
  const setRow = (id, patch) => onChange(interactions.map(it => (it.id === id ? { ...it, ...patch } : it)));
  const setA = (it, aId) => setRow(it.id, { aId, bId: it.bId === aId ? otherOf(aId) : it.bId });
  const setB = (it, bId) => setRow(it.id, { bId, aId: it.aId === bId ? otherOf(bId) : it.aId });
  const removeRow = id => onChange(interactions.filter(it => it.id !== id));

  if (characters.length < 2) {
    return <p className="char-sheet-hint">Add at least two characters (in the Seed tab) to specify interactions between them.</p>;
  }
  return (
    <div className="interactions-table-wrap">
      {interactions.length > 0 && (
        <table className="interactions-table">
          <thead>
            <tr><th>Character</th><th></th><th>Character</th><th>Where</th><th>Type</th><th></th></tr>
          </thead>
          <tbody>
            {interactions.map(it => (
              <tr key={it.id}>
                <td>
                  <select value={it.aId} onChange={e => setA(it, e.target.value)}>
                    {characters.map(c => <option key={c.id} value={c.id}>{c.name || "Unnamed"}</option>)}
                  </select>
                </td>
                <td className="interactions-table-and">&amp;</td>
                <td>
                  <select value={it.bId} onChange={e => setB(it, e.target.value)}>
                    {characters.filter(c => c.id !== it.aId).map(c => <option key={c.id} value={c.id}>{c.name || "Unnamed"}</option>)}
                  </select>
                </td>
                <td>
                  <select value={it.beatId} onChange={e => setRow(it.id, { beatId: e.target.value })}>
                    {structure.beats.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </td>
                <td>
                  <select value={it.type} onChange={e => setRow(it.id, { type: e.target.value })}
                    style={{ color: INTERACTION_COLORS[it.type] }}>
                    {INTERACTION_TYPES.map(t => <option key={t} value={t}>{INTERACTION_LABELS[t]}</option>)}
                  </select>
                </td>
                <td><button type="button" className="icon-btn" onClick={() => removeRow(it.id)} title="Remove">✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {interactions.length === 0 && <p className="empty">No interactions yet.</p>}
      <button type="button" className="ghost-btn" onClick={addRow}>+ Add interaction</button>
    </div>
  );
}

/* ===== story switcher ===== */
function StoryPanel({ projects, activeId, onOpen, onNew, onRename, onDuplicate, onDelete, onClose, onExportAll, onImport }) {
  const [picking, setPicking] = useState(false);
  const fileInput = useRef(null);
  const handleImportFile = e => {
    const file = e.target.files[0];
    e.target.value = "";
    if (file) onImport(file);
  };
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>My Stories</h3>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <ul className="story-list">
          {projects.slice().sort((a, b) => b.updatedAt - a.updatedAt).map(p => (
            <li key={p.id} className={p.id === activeId ? "is-sel" : ""}>
              <div className="story-list-row">
                <input value={p.title} onChange={e => onRename(p.id, e.target.value)} onClick={e => e.stopPropagation()} />
                <span className="story-struct">{structureById(p.structureId).name}</span>
                <button className="ghost-btn" onClick={() => onOpen(p.id)}>Open</button>
                <button className="icon-btn" onClick={() => onDuplicate(p.id)} title="Duplicate">⎘</button>
                <button className="icon-btn" onClick={() => onDelete(p.id)} title="Delete">🗑</button>
              </div>
              {p.seed && <p className="story-seed-preview">{p.seed}</p>}
            </li>
          ))}
        </ul>
        {!picking ? (
          <button className="primary-btn" onClick={() => setPicking(true)}>+ New Story</button>
        ) : (
          <div className="struct-pick">
            <p>Choose a structure:</p>
            {STRUCTURES.map(s => (
              <button key={s.id} className="ghost-btn struct-opt" onClick={() => { onNew(s.id); setPicking(false); }}>
                <b>{s.name}</b><span>{s.blurb}</span>
              </button>
            ))}
          </div>
        )}
        <div className="backup-row">
          <button className="ghost-btn" onClick={onExportAll}>⭳ Back up all stories</button>
          <button className="ghost-btn" onClick={() => fileInput.current?.click()}>⭱ Restore from backup</button>
          <input ref={fileInput} type="file" accept="application/json" hidden onChange={handleImportFile} />
        </div>
      </div>
    </div>
  );
}

/* ===== example browser =====
   A searchable index over all 73 plot-type examples (one worked example per plot type), grouped
   by taxonomy — lets you jump straight to a plot type + example pair instead of hunting through
   the two chained dropdowns above the timeline. Picking a row sets both at once. */
function ExampleBrowser({ onPick, onClose }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const groups = plotTypesByTaxonomy()
    .map(g => ({
      taxonomy: g.taxonomy,
      items: g.items
        .map(plotType => ({ plotType, example: examplesFor("plotType", plotType.id)[0] }))
        .filter(it => it.example),
    }))
    .map(g => ({
      ...g,
      items: !q ? g.items : g.items.filter(({ plotType, example }) =>
        [plotType.name, plotType.taxonomy, plotType.blurb, example.title, example.creator]
          .some(s => s.toLowerCase().includes(q))),
    }))
    .filter(g => g.items.length > 0);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Browse Examples</h3>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <input className="example-search" autoFocus value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search by title, author, or plot type…" />
        <div className="example-groups">
          {groups.length === 0 && <p className="empty">No matches.</p>}
          {groups.map(g => (
            <div key={g.taxonomy} className="example-group">
              <h4>{g.taxonomy}</h4>
              {g.items.map(({ plotType, example }) => (
                <button key={plotType.id} type="button" className="example-row" onClick={() => onPick(plotType.id, example.id)}>
                  <span className="example-row-title">{example.title}</span>
                  <span className="example-row-creator">{example.creator}</span>
                  <span className="example-row-plottype">{plotType.name}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===== markdown export ===== */
function toMarkdown(project, structure) {
  const lines = [`# ${project.title || "Untitled Story"}`, ""];
  if (project.seed) lines.push(`_Seed: ${project.seed}_`, "");
  if (project.need) lines.push(`_What the protagonist needs: ${project.need}_`, "");
  if (project.genre) lines.push(`*Genre: ${project.genre}*`, "");
  if (project.logline) lines.push(`> ${project.logline}`, "");
  lines.push(`_Structure: ${structure.name}_`, "");
  const plotType = plotTypeById(project.plotType);
  if (plotType) lines.push(`_Plot type: ${plotType.name} (${plotType.taxonomy})_`, "");
  const structureExample = examplesFor("structure", structure.id)[0];
  if (structureExample) lines.push(`_Studying: ${structureExample.title} (${structureExample.creator})_`, "");
  if (project.characters.length) {
    lines.push("## Characters", "");
    for (const c of project.characters) {
      const need = c.need || c.summary;
      lines.push(`- **${c.name || "Unnamed"}** (${CATEGORY_LABELS[c.category || "other"]})${need ? ` — ${need}` : ""}`);
      if (c.job) lines.push(`  - *Job:* ${c.job}`);
      if (c.notes) lines.push(`  - *Notes:* ${c.notes}`);
      const arcPoints = effectiveArcPoints(c, structure);
      for (const b of structure.beats) {
        const v = clampArc(arcPoints[b.id] ?? 0);
        if (v !== 0) lines.push(`  - *${b.name} fortune:* ${v > 0 ? "+" : ""}${v}`);
      }
    }
    lines.push("");
  }
  if (project.interactions?.length) {
    lines.push("## Interactions", "");
    const nameOf = id => project.characters.find(c => c.id === id)?.name || "Unnamed";
    for (const it of project.interactions) {
      const beat = structure.beats.find(b => b.id === it.beatId);
      lines.push(`- **${nameOf(it.aId)}** & **${nameOf(it.bId)}** — ${INTERACTION_LABELS[it.type]}${beat ? ` (${beat.name})` : ""}`);
    }
    lines.push("");
  }
  lines.push("## Beats", "");
  for (const b of structure.beats) {
    lines.push(`### ${b.name}`, "", `*${b.guide}*`, "");
    lines.push(project.beats[b.id] || "_(not written yet)_", "");
  }
  return lines.join("\n");
}
function download(filename, text, type = "text/markdown") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

/* ===== app ===== */
export default function StoryWheel() {
  const [projects, setProjects] = useState(loadProjects);
  const [activeId, setActiveId] = useState(() => loadActiveId());
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("beat"); // beat | characters | notes
  const [showStories, setShowStories] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const booted = useRef(false);

  useEffect(() => {
    if (projects.length === 0) {
      const p = newProject();
      setProjects([p]);
      setActiveId(p.id);
      return;
    }
    if (!activeId || !projects.some(p => p.id === activeId)) setActiveId(projects[0].id);
  }, []); // eslint-disable-line

  useEffect(() => { if (booted.current) saveProjects(projects); booted.current = true; }, [projects]);
  useEffect(() => { saveActiveId(activeId); }, [activeId]);

  const project = projects.find(p => p.id === activeId);
  const structure = project ? structureById(project.structureId) : null;

  useEffect(() => {
    if (!structure || selected === SEED_TAB || selected === NEED_TAB) return;
    if (!selected || !structure.beats.some(b => b.id === selected))
      setSelected(structure.beats[0]?.id || null);
  }, [structure?.id]); // eslint-disable-line

  const update = patch => setProjects(ps => ps.map(p => (p.id === activeId ? { ...p, ...patch, updatedAt: Date.now() } : p)));

  if (!project || !structure) return <div className="boot">Sharpening the pencil…</div>;

  const beat = structure.beats.find(b => b.id === selected) || null;
  const plotType = plotTypeById(project.plotType);
  const plotTypeExamples = plotType ? examplesFor("plotType", plotType.id) : [];
  const plotTypeExample = plotTypeExamples.some(e => e.id === project.plotTypeExample) ? exampleById(project.plotTypeExample) : null;
  // every structure has exactly one dedicated example mapped beat-by-beat onto it (Star Wars for
  // the Hero's Journey, Cinderella for Propp's 31 Functions, etc.) — always available, no picking
  // needed, so it's the fallback illustration once no plot-type example is guiding the beat notes
  const structureExample = examplesFor("structure", structure.id)[0] || null;
  // a plot-type example's fine-grained, beat-by-beat breakdown only exists for the Three-Act
  // Structure (that's what its `sections` field is keyed to) — so picking one is also picking that
  // structure, the same way choosing "See it in" already used to just silently mismatch otherwise
  const pickPlotTypeExample = exampleId => update(exampleId ? { plotTypeExample: exampleId, structureId: "three-act" } : { plotTypeExample: exampleId });

  const openStory = id => { setActiveId(id); setShowStories(false); };
  const newStory = structureId => {
    const p = newProject(structureId);
    setProjects(ps => [...ps, p]);
    setActiveId(p.id);
    setShowStories(false);
  };
  const renameStory = (id, title) => setProjects(ps => ps.map(p => (p.id === id ? { ...p, title, updatedAt: Date.now() } : p)));
  const duplicateStory = id => {
    const src = projects.find(p => p.id === id);
    if (!src) return;
    const copy = { ...src, id: uid(), title: `${src.title} (copy)`, createdAt: Date.now(), updatedAt: Date.now() };
    setProjects(ps => [...ps, copy]);
  };
  const deleteStory = id => {
    if (projects.length <= 1) return;
    if (!confirm("Delete this story? This can't be undone.")) return;
    setProjects(ps => {
      const next = ps.filter(p => p.id !== id);
      if (id === activeId) setActiveId(next[0]?.id || null);
      return next;
    });
  };
  const exportAllStories = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    download(`story-wheel-backup-${stamp}.json`, JSON.stringify(projects, null, 2), "application/json");
  };
  const importStories = async file => {
    let parsed;
    try {
      parsed = JSON.parse(await readFileAsText(file));
    } catch {
      alert("That file isn't valid Story Wheel backup JSON.");
      return;
    }
    const incoming = Array.isArray(parsed) ? parsed : [parsed];
    if (incoming.length === 0 || !incoming.every(p => p && typeof p === "object" && "beats" in p)) {
      alert("That file isn't valid Story Wheel backup JSON.");
      return;
    }
    // always minted fresh ids — restoring a backup should add stories alongside whatever's
    // already here, never silently overwrite an existing one that happens to share an id
    const now = Date.now();
    const restored = incoming.map(p => ({ ...withDefaults(p), id: uid(), updatedAt: now }));
    setProjects(ps => [...ps, ...restored]);
    setActiveId(restored[0].id);
    setShowStories(false);
    alert(`Restored ${restored.length} ${restored.length === 1 ? "story" : "stories"}.`);
  };

  return (
    <div className="app">
      <style>{CSS}</style>
      <header className="topbar">
        <div className="brand">✦ Story Wheel</div>
        <input className="title-input" value={project.title}
          onChange={e => update({ title: e.target.value })} placeholder="Story title" />
        <select className="struct-select" value={project.structureId}
          onChange={e => update({ structureId: e.target.value })}>
          {STRUCTURES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button className="ghost-btn" onClick={() => setShowStories(true)}>My Stories</button>
        <button className="ghost-btn" onClick={() => setShowExamples(true)}>Browse Examples</button>
        <button className="primary-btn" onClick={() => download(`${(project.title || "story").replace(/\s+/g, "-")}.md`, toMarkdown(project, structure))}>
          Export
        </button>
      </header>

      <p className="blurb">{structure.blurb}</p>

      <div className="plot-type-top">
        <label className="plot-type-top-picker">Plot type <span className="plot-type-hint">(pick one to see it against the timeline below)</span>
          <select value={project.plotType} onChange={e => update({ plotType: e.target.value })}>
            <option value="">None</option>
            {plotTypesByTaxonomy().map(g => (
              <optgroup key={g.taxonomy} label={g.taxonomy}>
                {g.items.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
        {plotType && (
          <p className="plot-type-top-blurb"><span>{plotType.taxonomy}</span> — <em>{plotType.blurb}</em></p>
        )}
        {plotType && plotTypeExamples.length > 0 && (
          <label className="plot-type-top-picker">See it in <span className="plot-type-hint">(a real example, mapped beat-by-beat — switches your structure to Three-Act, where it's fully mapped out)</span>
            <select value={project.plotTypeExample} onChange={e => pickPlotTypeExample(e.target.value)}>
              <option value="">None</option>
              {plotTypeExamples.map(ex => <option key={ex.id} value={ex.id}>{ex.title}</option>)}
            </select>
          </label>
        )}
      </div>

      <Timeline structure={structure} project={project} selected={selected} onSelect={id => { setSelected(id); setTab("beat"); }}
        plotTypeExample={plotTypeExample} />

      <div className="legend">
        {Object.values(ACTS).map(a => (
          <span key={a.label} className="legend-item"><i style={{ background: a.color }} />{a.label}</span>
        ))}
      </div>

      <ActTable structure={structure} project={project} plotTypeExample={plotTypeExample} />

      <main className="layout">
        <div className="side-col">
          <div className="tabs">
            <button className={tab === "beat" ? "is-sel" : ""} onClick={() => setTab("beat")}>Beat</button>
            <button className={tab === "characters" ? "is-sel" : ""} onClick={() => setTab("characters")}>Character Flow</button>
            <button className={tab === "notes" ? "is-sel" : ""} onClick={() => setTab("notes")}>Notes</button>
          </div>
          {tab === "beat" && (
            <>
              <div className="beat-subtabs">
                {FOUNDATION_TABS.map(f => (
                  <button key={f.id} className={selected === f.id ? "is-sel" : ""} onClick={() => setSelected(f.id)}>{f.name}</button>
                ))}
                {structure.beats.map(b => (
                  <button key={b.id} className={selected === b.id ? "is-sel" : ""} onClick={() => setSelected(b.id)}>{b.name}</button>
                ))}
              </div>
              {selected === SEED_TAB && (
                <>
                  <IdeaGenerator characters={project.characters}
                    onChangeCharacters={characters => update({ characters })}
                    onUseSeed={sentence => update({
                      seed: project.seed ? `${project.seed}\n\n${sentence}` : sentence,
                    })} />
                  <FoundationEditor title="The Seed" guide={FOUNDATION_TABS[0].guide}
                    text={project.seed} onChange={seed => update({ seed })} />
                </>
              )}
              {selected === NEED_TAB && (
                <FoundationEditor title="What the Protagonist Needs" guide={FOUNDATION_TABS[1].guide}
                  text={project.need} onChange={need => update({ need })} />
              )}
              {beat && (
                <BeatEditor beat={beat} text={project.beats[beat.id] || ""}
                  onChange={text => update({ beats: { ...project.beats, [beat.id]: text } })}
                  plotType={plotType} plotTypeExample={plotTypeExample} structureExample={structureExample}
                  characters={project.characters} interactions={project.interactions} />
              )}
            </>
          )}
          {tab === "characters" && (
            <CharacterFlow characters={project.characters} structure={structure} interactions={project.interactions}
              onChange={characters => update({ characters })}
              onChangeInteractions={interactions => update({ interactions })} />
          )}
          {tab === "notes" && (
            <div className="notes-panel">
              <label>Genre</label>
              <input value={project.genre} onChange={e => update({ genre: e.target.value })} placeholder="e.g. mystery, literary fiction, YA fantasy" />
              <label>Logline</label>
              <textarea value={project.logline} onChange={e => update({ logline: e.target.value })} rows={5}
                placeholder="One or two sentences: who wants what, and what's stopping them." />
            </div>
          )}
        </div>
      </main>

      {showStories && (
        <StoryPanel projects={projects} activeId={activeId} onOpen={openStory} onNew={newStory}
          onRename={renameStory} onDuplicate={duplicateStory} onDelete={deleteStory} onClose={() => setShowStories(false)}
          onExportAll={exportAllStories} onImport={importStories} />
      )}
      {showExamples && (
        <ExampleBrowser onPick={(plotTypeId, exampleId) => {
          update({ plotType: plotTypeId, plotTypeExample: exampleId, ...(exampleId ? { structureId: "three-act" } : {}) });
          setShowExamples(false);
        }}
          onClose={() => setShowExamples(false)} />
      )}
    </div>
  );
}

const CSS = `
:root{ --bg:#120E1C; --panel:#1B1530; --panel2:#241C3D; --ink:#EDE7DA; --dim:#8B8398;
  --gold:#E9C88A; --ember:#D2785A; --border:rgba(237,231,218,0.10); }
*{box-sizing:border-box}
.boot{color:var(--dim);font-family:system-ui;padding:40px;text-align:center}
.app{min-height:100vh;background:var(--bg);color:var(--ink);font-family:'Archivo',system-ui,sans-serif;padding:18px 20px 40px}
.topbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px}
.brand{font-family:'Fraunces',serif;font-weight:650;font-size:20px;color:var(--gold);white-space:nowrap}
.title-input{flex:1;min-width:160px;background:var(--panel);border:1px solid var(--border);color:var(--ink);
  border-radius:8px;padding:9px 12px;font-family:'Fraunces',serif;font-size:16px}
.struct-select{background:var(--panel);border:1px solid var(--border);color:var(--ink);border-radius:8px;padding:9px 10px;font-size:13px}
.blurb{color:var(--dim);font-size:13px;margin:2px 0 18px}
button{font-family:inherit;cursor:pointer}
.ghost-btn{background:transparent;border:1px solid var(--border);color:var(--ink);border-radius:8px;padding:8px 12px;font-size:13px}
.ghost-btn:hover{border-color:var(--gold);color:var(--gold)}
.primary-btn{background:var(--gold);border:none;color:#241606;font-weight:600;border-radius:8px;padding:9px 14px;font-size:13px}
.primary-btn:hover{filter:brightness(1.08)}
.icon-btn{background:transparent;border:none;color:var(--dim);font-size:14px;padding:4px 6px;border-radius:6px}
.icon-btn:hover{color:var(--ember)}
.layout{display:flex;justify-content:center}
@media (max-width: 480px){ .tl-label{width:44px;font-size:9px} .tl-clip-label{font-size:10px} }
.timeline{width:100%;max-width:960px;margin:0 auto 24px;display:flex;flex-direction:column;gap:2px}
.tl-summary{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px}
.tl-summary-title{font-family:'Fraunces',serif;font-size:16px;color:var(--ink)}
.tl-summary-sub{font-size:11px;color:var(--dim)}
.tl-track{display:flex;align-items:stretch;gap:8px}
.tl-track-thin{height:14px}
.tl-track-thin .tl-lane{height:14px}
.tl-label{width:64px;flex:none;font-size:10px;color:var(--dim);text-transform:uppercase;
  letter-spacing:.04em;display:flex;align-items:center}
.tl-lane{position:relative;flex:1;height:38px;background:var(--panel);border-radius:6px;overflow:hidden;
  border:1px solid var(--border)}
.tl-clip{position:absolute;top:0;bottom:0;cursor:pointer;transition:opacity .15s,filter .15s;
  display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1px var(--bg);overflow:hidden}
.tl-clip:hover{opacity:1!important}
.tl-clip.is-sel{filter:drop-shadow(0 0 6px rgba(233,200,138,.65));z-index:1}
.tl-clip-label{font-family:'Archivo',sans-serif;font-size:11px;font-weight:700;color:#120E1C;pointer-events:none;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;padding:0 3px}
.tl-lane-written{background:transparent;border:none}
.tl-clip-filled{opacity:.9}
.tl-clip-empty{background:transparent;border:1px solid var(--border);border-radius:3px}
.tl-lane-acts .tl-clip{background:var(--panel2);border:1px solid var(--border);cursor:default}
.tl-lane-acts .tl-clip-label{color:var(--gold)}
.arcline-empty{color:var(--dim);font-size:12px;margin:0}
.char-lanes-track{align-items:flex-start;margin-top:14px}
.char-lanes-col{flex:1;display:flex;flex-direction:column;min-width:0}
.char-lanes{position:relative;display:flex;flex-direction:column;background:var(--panel);
  border:1px solid var(--border);border-radius:6px;overflow:hidden}
.char-lane{display:flex;flex-direction:column;border-bottom:1px solid var(--border);
  transition:opacity .15s}
.char-lane:last-child{border-bottom:none}
.char-lane.is-off{opacity:.32}
.char-lane-label{display:flex;align-items:center;gap:6px;width:100%;padding:4px 10px 0;
  background:transparent;border:none;color:var(--ink);font-size:11px;
  text-align:left;cursor:pointer;font-family:inherit;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.char-lane-label:hover{color:var(--gold)}
.char-lane-label i{width:8px;height:8px;border-radius:3px;flex:none}
.char-lane-label-cat{color:var(--dim);text-transform:uppercase;letter-spacing:.03em;font-size:10px}
.char-lane-chart{flex:none;height:40px;position:relative;min-width:0}
.char-lane-chart svg{width:100%;height:100%;display:block}
.char-lane-band{opacity:.1}
.char-lane-midline{stroke:var(--border);stroke-width:1.5}
.char-lane-path{fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;opacity:.9}
.char-lane-path-dashed{stroke-dasharray:6 5;opacity:.6}
.char-lane-point{stroke:var(--panel);stroke-width:1.5}
.char-lanes-connectors{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.char-lane-connector,.char-lane-connector-tick{vector-effect:non-scaling-stroke}
.char-lane-connector{stroke:var(--ember);stroke-width:2;stroke-dasharray:5 4;opacity:.85}
.char-lane-connector-tick{stroke-width:3}
.char-lane-interactions{display:flex;flex-direction:column;gap:2px;margin:6px 0 0;font-size:12px;color:var(--dim)}
.char-lane-interaction-note b{color:var(--ember);font-weight:600}
.legend{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;align-items:center;margin:4px 0 20px}
.legend-item{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--dim)}
.legend-item i{width:9px;height:9px;border-radius:3px;display:inline-block}
.legend-swatch-dashed{border:1.5px dashed rgba(0,0,0,.45);box-sizing:border-box}
.plot-type-hint{text-transform:none;letter-spacing:normal;font-size:11px;opacity:.7}
.plot-type-top{display:flex;flex-wrap:wrap;align-items:flex-end;gap:16px;margin:4px 0 18px;
  padding:14px 16px;background:var(--panel);border:1px solid var(--border);border-radius:12px}
.plot-type-top-picker{display:flex;flex-direction:column;gap:4px;font-size:11px;color:var(--dim);
  text-transform:uppercase;letter-spacing:.04em}
.plot-type-top-picker select{background:var(--bg);border:1px solid var(--border);color:var(--ink);
  border-radius:8px;padding:9px 10px;font-size:13px;font-family:inherit;text-transform:none;
  letter-spacing:normal;min-width:220px}
.plot-type-top-blurb{flex:1;min-width:200px;font-size:13px;color:var(--dim);margin:0}
.plot-type-top-blurb span{color:var(--gold);text-transform:uppercase;font-size:10px;letter-spacing:.05em}
.plot-type-top-blurb em{font-style:italic;display:block;margin-top:2px;color:var(--ink)}
.act-table-wrap{width:100%;overflow-x:auto;margin-top:24px}
.act-table{width:100%;min-width:760px;border-collapse:collapse;font-size:13px}
.act-table th{text-align:left;font-size:11px;color:var(--dim);text-transform:uppercase;letter-spacing:.04em;
  font-weight:600;padding:0 14px 10px;border-bottom:1px solid var(--border);white-space:nowrap}
.act-table td{vertical-align:top;padding:14px;border-bottom:1px solid var(--border);line-height:1.5}
.act-table tr:last-child td{border-bottom:none}
.act-table-act{min-width:170px}
.act-table-act-heading{display:flex;align-items:center;gap:8px;font-weight:600;color:var(--gold);
  white-space:nowrap;margin-bottom:8px}
.act-table-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.act-table-list li{display:flex;gap:8px}
.act-table-list .act-breakdown-swatch{margin-top:5px}
.act-table-beat-name{font-weight:600;color:var(--ember);display:block;margin-bottom:2px}
.act-table-unwritten{font-style:italic;opacity:.6}
.act-table-interaction-line{display:block;font-size:12px;font-style:italic;margin-top:3px}
.plot-type-note{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 12px;
  font-size:12px;color:var(--dim);line-height:1.5;margin:0 0 12px}
.plot-type-note span{font-weight:600}
.plot-type-note-tax{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.05em;
  color:var(--dim);opacity:.7;font-weight:400!important;margin-bottom:2px}
.example-note{background:var(--bg);border:1px solid var(--ember);border-left-width:3px;border-radius:8px;
  padding:10px 12px;font-size:12px;color:var(--dim);line-height:1.5;margin:0 0 12px}
.example-note-tag{color:var(--ember);font-weight:600}
.example-line{font-size:12px;color:var(--dim);margin-top:4px;line-height:1.5}
.example-line span{color:var(--ember);font-weight:600}
.beat-interaction-lines{margin-top:10px;display:flex;flex-direction:column;gap:4px}
.beat-interaction-line{margin:0;font-size:13px;font-style:italic;line-height:1.5}
.side-col{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:16px;
  min-height:420px;width:100%;max-width:720px}
.tabs{display:flex;gap:4px;margin-bottom:14px;border-bottom:1px solid var(--border);padding-bottom:10px}
.tabs button{background:transparent;border:none;color:var(--dim);font-size:13px;padding:6px 10px;border-radius:7px}
.tabs button.is-sel{background:var(--panel2);color:var(--gold)}
.beat-subtabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
.beat-subtabs button{background:var(--bg);border:1px solid var(--border);color:var(--dim);font-size:12px;
  padding:6px 10px;border-radius:7px;white-space:nowrap}
.beat-subtabs button.is-sel{background:var(--panel2);color:var(--gold);border-color:var(--gold)}
.beat-editor h3{font-family:'Fraunces',serif;margin:0 0 6px;font-size:20px;color:var(--gold)}
.guide{color:var(--dim);font-size:13px;margin:0 0 6px;line-height:1.5}
.idea-gen{background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:16px}
.idea-gen-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}
.idea-gen-grid label{display:flex;flex-direction:column;gap:4px;font-size:11px;color:var(--dim);
  text-transform:uppercase;letter-spacing:.04em}
.idea-gen-grid select{background:var(--panel);border:1px solid var(--border);color:var(--ink);
  border-radius:7px;padding:8px 9px;font-size:13px;font-family:inherit}
.idea-gen-chars{display:flex;flex-direction:column;gap:10px;margin-top:12px}
.idea-gen-char-card{display:flex;flex-direction:column;gap:6px;background:var(--panel);
  border:1px solid var(--border);border-radius:8px;padding:10px}
.idea-gen-char-row1{display:flex;gap:8px}
.idea-gen-char-row1 input{flex:1;min-width:0}
.idea-gen-char-row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.idea-gen-char-card input,.idea-gen-char-card select,.idea-gen-char-card textarea{
  background:var(--bg);border:1px solid var(--border);color:var(--ink);border-radius:7px;
  padding:8px 9px;font-size:13px;font-family:inherit;width:100%;box-sizing:border-box;resize:vertical}
.idea-gen-add{margin-top:8px}
.idea-gen-preview{font-family:'Fraunces',serif;font-style:italic;color:var(--ink);font-size:15px;
  line-height:1.5;margin:14px 0 10px}
.idea-gen-actions{display:flex;gap:8px;flex-wrap:wrap}
.idea-gen-actions .primary-btn:disabled{opacity:.4}
.beat-ex-line{color:var(--gold);font-size:12px;margin:0 0 12px;opacity:.85}
.beat-ex-line em{font-style:italic}
.beat-editor textarea{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;
  color:var(--ink);padding:12px;font-size:14px;line-height:1.6;font-family:'Fraunces',serif;resize:vertical}
.wc{color:var(--dim);font-size:11px;margin-top:6px;text-align:right}
.character-flow{display:flex;flex-direction:column;gap:10px}
.char-flow-legend{display:flex;flex-wrap:wrap;gap:6px}
.char-flow-chip{display:flex;align-items:center;gap:6px;background:var(--panel);
  border:1px solid var(--border);color:var(--dim);border-radius:20px;padding:6px 12px;font-size:12px}
.char-flow-chip.is-active{color:var(--ink);border-color:var(--gold)}
.char-flow-swatch{width:9px;height:9px;border-radius:3px;flex:none}
.char-flow-cat{font-size:10px;color:var(--dim);text-transform:uppercase;letter-spacing:.04em}
.char-flow-active-info{display:flex;align-items:center;justify-content:space-between;gap:8px;
  font-size:12px;color:var(--dim)}
.char-flow-active-info b{color:var(--gold);font-weight:600}
.char-flow-active-info i{font-style:italic}
.arc-graph{display:flex;gap:8px}
.arc-graph-yaxis{display:flex;flex-direction:column;justify-content:space-between;
  font-size:10px;color:var(--dim);padding:2px 0}
.arc-graph-main{position:relative;flex:1;min-width:0}
.arc-graph-svg{width:100%;height:200px;display:block;border-radius:8px;background:var(--bg);
  border:1px solid var(--border);touch-action:none;cursor:crosshair}
.arc-grid-line{stroke:var(--border);stroke-width:1}
.arc-graph-path-dim{opacity:.4;stroke-width:2}
.arc-graph-point{stroke:var(--panel);stroke-width:1.5}
.arc-act-labels{position:relative;height:14px;margin-top:2px}
.arc-act-label{position:absolute;top:0;text-align:center;font-size:9px;color:var(--dim);
  text-transform:uppercase;letter-spacing:.03em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.interaction-line{stroke-width:2;stroke-dasharray:4 3;vector-effect:non-scaling-stroke;opacity:.9}
.interaction-line-dot{stroke:var(--panel);stroke-width:1}
.interactions-heading{font-family:'Fraunces',serif;margin:4px 0 0;font-size:15px;color:var(--gold)}
.interactions-table-wrap{width:100%;overflow-x:auto}
.interactions-table{width:100%;min-width:520px;border-collapse:collapse;font-size:13px}
.interactions-table th{text-align:left;font-size:11px;color:var(--dim);text-transform:uppercase;letter-spacing:.04em;
  font-weight:600;padding:0 8px 8px;border-bottom:1px solid var(--border);white-space:nowrap}
.interactions-table td{vertical-align:middle;padding:6px 8px;border-bottom:1px solid var(--border)}
.interactions-table tr:last-child td{border-bottom:none}
.interactions-table select{background:var(--bg);border:1px solid var(--border);color:var(--ink);
  border-radius:7px;padding:6px 8px;font-size:13px;font-family:inherit;width:100%}
.interactions-table-and{color:var(--dim);text-align:center;padding:6px 2px!important}
.char-sheet-hint{font-size:12px;color:var(--dim);line-height:1.5;margin:0}
.char-sheet-hint b{color:var(--gold)}
.empty{color:var(--dim);font-size:13px}
.notes-panel{display:flex;flex-direction:column;gap:6px}
.notes-panel label{color:var(--dim);font-size:11px;text-transform:uppercase;letter-spacing:.04em;margin-top:8px}
.notes-panel input,.notes-panel textarea{background:var(--bg);border:1px solid var(--border);color:var(--ink);
  border-radius:8px;padding:10px 12px;font-size:14px;font-family:'Fraunces',serif}
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:10;padding:20px}
.modal{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:20px;width:100%;max-width:560px;max-height:80vh;overflow:auto}
.modal-wide{max-width:720px}
.modal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.modal-head h3{font-family:'Fraunces',serif;margin:0;color:var(--gold)}
.story-list{list-style:none;margin:0 0 14px;padding:0;display:flex;flex-direction:column;gap:2px}
.story-list li{display:flex;flex-direction:column;gap:3px;padding:8px;border-radius:8px}
.story-list li.is-sel{background:var(--panel2)}
.story-list-row{display:flex;align-items:center;gap:8px}
.story-list input{flex:1;background:var(--bg);border:1px solid var(--border);color:var(--ink);border-radius:6px;padding:6px 8px;font-size:13px}
.story-struct{color:var(--dim);font-size:11px;white-space:nowrap}
.story-seed-preview{margin:0;padding:0 0 0 8px;font-size:12px;color:var(--dim);font-style:italic;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.struct-pick{display:flex;flex-direction:column;gap:8px}
.struct-opt{display:flex;flex-direction:column;align-items:flex-start;gap:2px;text-align:left;padding:10px 12px}
.struct-opt span{color:var(--dim);font-size:12px}
.backup-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;padding-top:14px;border-top:1px solid var(--border)}
.act-breakdown-swatch{width:10px;height:10px;border-radius:3px;flex:none;margin-top:4px}
.example-search{width:100%;background:var(--bg);border:1px solid var(--border);color:var(--ink);
  border-radius:8px;padding:9px 12px;font-size:13px;font-family:inherit;margin-bottom:14px}
.example-groups{display:flex;flex-direction:column;gap:16px}
.example-group h4{margin:0 0 6px;font-size:11px;color:var(--gold);text-transform:uppercase;letter-spacing:.05em}
.example-row{display:flex;align-items:baseline;gap:8px;width:100%;background:transparent;border:1px solid transparent;
  border-radius:7px;padding:7px 8px;font-family:inherit;text-align:left;color:var(--ink)}
.example-row:hover{border-color:var(--border);background:var(--panel2)}
.example-row-title{font-weight:600;color:var(--ember)}
.example-row-creator{color:var(--dim);font-size:12px;flex:1}
.example-row-plottype{color:var(--dim);font-size:11px;text-transform:uppercase;letter-spacing:.03em;white-space:nowrap}
`;
