import { useEffect, useMemo, useRef, useState } from "react";
import { ACTS, STRUCTURES, structureById } from "./structures.js";
import { PLOT_TYPES, plotTypeById, plotTypesByTaxonomy } from "./plot-types.js";
import { examplesFor, exampleById } from "./examples.js";
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
    return Array.isArray(parsed) ? parsed : [];
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
    id: uid(), title: "Untitled Story", structureId, genre: "", logline: "", plotType: "",
    plotTypeExample: "", arcCharacterId: "",
    beats: {}, characters: [], createdAt: now, updatedAt: now,
  };
}

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
   track) -> Plot Type (an external 4-clip track, only present once one's picked; a highlighted
   border marks a clip that also has a real-world example). */
function Timeline({ structure, project, selected, onSelect, arcCharacter, selectedArcAct, onSelectArcAct }) {
  const slices = useMemo(() => segments(structure.beats), [structure]);
  const acts3 = useMemo(() => groupSlices(slices, b => b.threeAct), [slices]);
  const actGroups = useMemo(() => groupSlices(slices, b => b.act), [slices]);
  const done = structure.beats.filter(b => wordCount(project.beats[b.id]) > 0).length;
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

      {arcCharacter && (
        <div className="tl-track">
          <div className="tl-label">Arc</div>
          <div className="tl-lane tl-lane-arc">
            {actGroups.map(({ key, a0, a1 }) => {
              const isSel = selectedArcAct === key;
              const hasText = wordCount(arcCharacter.arc?.[key]) > 0;
              return (
                <div key={key} className={`tl-clip tl-clip-arc${isSel ? " is-sel" : ""}`}
                  style={{ left: a0 + "%", width: (a1 - a0) + "%", background: ACTS[key].color, opacity: isSel ? 1 : hasText ? 0.88 : 0.45 }}
                  onClick={() => onSelectArcAct(key)} title={`${arcCharacter.name || "Unnamed"} — ${ACTS[key].label}`}>
                  <span className="tl-clip-label">{ACTS[key].label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== compare view — two timelines stacked, ribbons linking their matching acts ===== */
// a plot type has no beats of its own — represented here as 4 equal-share pseudo-beats (one per
// shared act-phase) so it can be dropped straight into CompareTimeline/ribbon math alongside a
// real structure, with no separate code path
function plotTypeAsWheel(plotType) {
  return {
    id: plotType.id, name: plotType.name,
    beats: Object.keys(ACTS).map(key => ({ id: key, name: ACTS[key].label, pct: 25, act: key })),
  };
}
// a smooth Sankey-style ribbon linking a span on the bottom edge of the top track to a span on
// the top edge of the bottom track — both spans given as 0-100 percentages of the shared width
function ribbonPathLinear(xA0, xA1, yA, xB0, xB1, yB) {
  const midY = (yA + yB) / 2;
  return [
    `M ${xA0} ${yA}`, `C ${xA0} ${midY} ${xB0} ${midY} ${xB0} ${yB}`,
    `L ${xB1} ${yB}`, `C ${xB1} ${midY} ${xA1} ${midY} ${xA1} ${yA}`, "Z",
  ].join(" ");
}
function CompareTimeline({ structA, structB, numberedA = true, numberedB = true }) {
  const W = 1000, trackH = 60, gap = 120;
  const yA0 = 0, yA1 = trackH, yB0 = trackH + gap, yB1 = trackH + gap + trackH;
  const slicesA = useMemo(() => segments(structA.beats), [structA]);
  const slicesB = useMemo(() => segments(structB.beats), [structB]);
  const groupsA = useMemo(() => groupSlices(slicesA, b => b.act), [slicesA]);
  const groupsB = useMemo(() => groupSlices(slicesB, b => b.act), [slicesB]);
  const ribbons = useMemo(() => groupsA
    .map(gA => { const gB = groupsB.find(g => g.key === gA.key); return gB && { act: gA.key, d: ribbonPathLinear(gA.a0 * 10, gA.a1 * 10, yA1, gB.a0 * 10, gB.a1 * 10, yB0) }; })
    .filter(Boolean), [groupsA, groupsB]);
  return (
    <svg viewBox={`0 0 ${W} ${yB1}`} className="compare-timeline" role="img" aria-label="Structure comparison timeline" preserveAspectRatio="none">
      {slicesA.map(({ beat, a0, a1 }, i) => (
        <g key={beat.id}>
          <rect x={a0 * 10} y={yA0} width={(a1 - a0) * 10} height={trackH} fill={ACTS[beat.act].color} opacity={0.85} />
          {numberedA && (a1 - a0) * 10 > 24 && (
            <text x={a0 * 10 + (a1 - a0) * 5} y={yA0 + trackH / 2} textAnchor="middle" dominantBaseline="middle" className="slice-num">{i + 1}</text>
          )}
        </g>
      ))}
      {ribbons.map(r => <path key={r.act} d={r.d} fill={ACTS[r.act].color} className="ribbon" />)}
      {slicesB.map(({ beat, a0, a1 }, i) => (
        <g key={beat.id}>
          <rect x={a0 * 10} y={yB0} width={(a1 - a0) * 10} height={trackH} fill={ACTS[beat.act].color} opacity={0.85} />
          {numberedB && (a1 - a0) * 10 > 24 && (
            <text x={a0 * 10 + (a1 - a0) * 5} y={yB0 + trackH / 2} textAnchor="middle" dominantBaseline="middle" className="slice-num">{i + 1}</text>
          )}
        </g>
      ))}
    </svg>
  );
}
function ActBreakdown({ structure }) {
  const groups = Object.keys(ACTS)
    .map(key => ({ key, beats: structure.beats.filter(b => b.act === key) }))
    .filter(g => g.beats.length);
  return (
    <div className="act-breakdown">
      <h4>{structure.name}</h4>
      {groups.map(g => (
        <div className="act-breakdown-row" key={g.key}>
          <span className="act-breakdown-swatch" style={{ background: ACTS[g.key].color }} />
          <div>
            <div className="act-breakdown-label">{ACTS[g.key].label}</div>
            <div className="act-breakdown-beats">{g.beats.map(b => b.name).join(", ")}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
function PlotTypePanel({ plotType, example }) {
  return (
    <div className="plot-type-panel">
      <div className="plot-type-taxonomy">{plotType.taxonomy}</div>
      <p className="plot-type-blurb">{plotType.blurb}</p>
      {Object.keys(ACTS).map(key => (
        <div className="act-breakdown-row" key={key}>
          <span className="act-breakdown-swatch" style={{ background: ACTS[key].color }} />
          <div>
            <div className="act-breakdown-label">{ACTS[key].label}</div>
            <div className="act-breakdown-beats">{plotType.acts[key]}</div>
            {example && <div className="example-line"><span>In {example.title}:</span> {example.beats[key]}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
// the unified grid: one row per shared act, showing (as columns exist) the plot type's own
// description of that act, a plot-type example's version of it, which of the CURRENT structure's
// beats fall in that act, and — its own column — the parts of the structure-level literature
// example that correspond to those same beats. The join key throughout is the act, so this works
// for any structure without per-structure content, and the literature column re-splits itself
// automatically whenever a different structure re-groups the same beats into different acts.
function ActTable({ structure, plotType, plotTypeExample, structureExample }) {
  return (
    <div className="act-table-wrap">
      <table className="act-table">
        <thead>
          <tr>
            <th>Act</th>
            {plotType && <th>{plotType.name}</th>}
            {plotTypeExample && <th>In {plotTypeExample.title}</th>}
            <th>{structure.name} sections</th>
            {structureExample && <th>In {structureExample.title}</th>}
          </tr>
        </thead>
        <tbody>
          {Object.keys(ACTS).map(key => {
            const beats = structure.beats.filter(b => b.act === key);
            return (
              <tr key={key}>
                <td className="act-table-act">
                  <span className="act-breakdown-swatch" style={{ background: ACTS[key].color }} />
                  {ACTS[key].label}
                </td>
                {plotType && <td>{plotType.acts[key]}</td>}
                {plotTypeExample && <td>{plotTypeExample.beats[key]}</td>}
                <td>
                  {beats.length === 0 ? "—" : (
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
                {structureExample && (
                  <td>
                    {beats.length === 0 ? "—" : (
                      <ul className="act-table-list">
                        {beats.map(b => (
                          <li key={b.id}>
                            <span className="act-breakdown-swatch" style={{ background: ACTS[key].color }} />
                            <span>
                              <span className="act-table-beat-name">{b.name}</span>
                              <span>{structureExample.beats[b.id]}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
function SidePicker({ label, kind, onKind, id, onId }) {
  return (
    <div className="compare-picker">
      <span className="compare-picker-label">{label}</span>
      <div className="compare-kind-toggle">
        <button className={kind === "structure" ? "is-sel" : ""} onClick={() => onKind("structure")}>Structure</button>
        <button className={kind === "plotType" ? "is-sel" : ""} onClick={() => onKind("plotType")}>Plot type</button>
      </div>
      {kind === "structure" ? (
        <select value={id} onChange={e => onId(e.target.value)}>
          {STRUCTURES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      ) : (
        <select value={id} onChange={e => onId(e.target.value)}>
          {plotTypesByTaxonomy().map(g => (
            <optgroup key={g.taxonomy} label={g.taxonomy}>
              {g.items.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </optgroup>
          ))}
        </select>
      )}
    </div>
  );
}
function CompareView({ onClose }) {
  const [aKind, setAKind] = useState("plotType");
  const [aId, setAId] = useState(PLOT_TYPES[0].id);
  const [bKind, setBKind] = useState("structure");
  const [bId, setBId] = useState(STRUCTURES[0].id);

  const changeKindA = kind => { setAKind(kind); setAId(kind === "structure" ? STRUCTURES[0].id : PLOT_TYPES[0].id); };
  const changeKindB = kind => { setBKind(kind); setBId(kind === "structure" ? STRUCTURES[0].id : PLOT_TYPES[0].id); };

  const structA = aKind === "structure" ? structureById(aId) : plotTypeAsWheel(plotTypeById(aId));
  const structB = bKind === "structure" ? structureById(bId) : plotTypeAsWheel(plotTypeById(bId));

  return (
    <div className="compare-view">
      <div className="compare-head">
        <SidePicker label="Top track" kind={aKind} onKind={changeKindA} id={aId} onId={setAId} />
        <SidePicker label="Bottom track" kind={bKind} onKind={changeKindB} id={bId} onId={setBId} />
        <button className="ghost-btn" onClick={onClose}>← Back to editor</button>
      </div>
      <p className="blurb">Ribbons connect each act to its counterpart on the other track. A structure's ribbon width is that act's real share of its story; a plot type's four acts are conceptual, not timed, so its segments are always even — it's the shape of a plot type's ribbons meeting a structure's real proportions that's worth reading.</p>
      <div className="compare-body">
        <CompareTimeline structA={structA} structB={structB} numberedA={aKind === "structure"} numberedB={bKind === "structure"} />
        <div className="compare-legends">
          {aKind === "structure" ? <ActBreakdown structure={structA} /> : <PlotTypePanel plotType={plotTypeById(aId)} />}
          {bKind === "structure" ? <ActBreakdown structure={structB} /> : <PlotTypePanel plotType={plotTypeById(bId)} />}
        </div>
      </div>
    </div>
  );
}

/* ===== beat editor ===== */

function BeatEditor({ beat, text, onChange, plotType, example }) {
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
      {example && example.beats[beat.id] && (
        <p className="example-note">
          <span className="example-note-tag">In {example.title}</span> — {example.beats[beat.id]}
        </p>
      )}
      <textarea value={text} placeholder="Write the scene, or just jot what has to happen…"
        onChange={e => onChange(e.target.value)} rows={12} />
      <div className="wc">{wordCount(text)} words</div>
    </div>
  );
}
// four stock stages of a change arc, mapped onto the same shared acts every structure, plot type
// and example already uses — so a character's arc is just another act-keyed track, no new join key
const ARC_STAGE_GUIDE = {
  setup: "Who they are before the story disrupts them — their flaw, lie, or unmet want.",
  rise: "How they change while pursuing the goal — new skills, allies, doubts.",
  climax: "The test that forces a real choice — what breaks or reveals them.",
  fall: "Who they've become — the lie replaced, the flaw faced, or, for a flat arc, what they proved right.",
};
function ArcEditor({ character, act, text, onChange, example }) {
  return (
    <div className="beat-editor">
      <h3>{character.name || "Unnamed"} <span className="arc-editor-act" style={{ color: ACTS[act].color }}>— {ACTS[act].label}</span></h3>
      <p className="guide">{ARC_STAGE_GUIDE[act]}</p>
      {example && (
        <p className="example-note">
          <span className="example-note-tag">In {example.title}</span> — {example.beats[act]}
        </p>
      )}
      <textarea value={text} placeholder="What's happening to them here?"
        onChange={e => onChange(e.target.value)} rows={12} />
      <div className="wc">{wordCount(text)} words</div>
    </div>
  );
}

/* ===== characters ===== */
const ROLES = ["Protagonist", "Antagonist", "Supporting", "Other"];
function Characters({ characters, onChange, arcCharacterId, onArcCharacterChange }) {
  const add = () => onChange([...characters, {
    id: uid(), name: "", role: "Supporting", notes: "",
    arc: { setup: "", rise: "", climax: "", fall: "" },
  }]);
  const set = (id, patch) => onChange(characters.map(c => (c.id === id ? { ...c, ...patch } : c)));
  const remove = id => onChange(characters.filter(c => c.id !== id));
  return (
    <div className="characters">
      {characters.length === 0 && <p className="empty">No characters yet.</p>}
      {characters.length > 0 && (
        <label className="plot-type-top-picker arc-tracker-picker">Track arc in timeline
          <span className="plot-type-hint">(adds an Arc track to the arrangement view)</span>
          <select value={arcCharacterId} onChange={e => onArcCharacterChange(e.target.value)}>
            <option value="">None</option>
            {characters.map(c => <option key={c.id} value={c.id}>{c.name || "Unnamed"}</option>)}
          </select>
        </label>
      )}
      {characters.map(c => (
        <div className="char-row" key={c.id}>
          <input placeholder="Name" value={c.name} onChange={e => set(c.id, { name: e.target.value })} />
          <select value={c.role} onChange={e => set(c.id, { role: e.target.value })}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <input placeholder="One-line notes" value={c.notes} onChange={e => set(c.id, { notes: e.target.value })} />
          <button className="icon-btn" onClick={() => remove(c.id)} title="Remove">✕</button>
        </div>
      ))}
      <button className="ghost-btn" onClick={add}>+ Add character</button>
    </div>
  );
}

/* ===== story switcher ===== */
function StoryPanel({ projects, activeId, onOpen, onNew, onRename, onDuplicate, onDelete, onClose }) {
  const [picking, setPicking] = useState(false);
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
              <input value={p.title} onChange={e => onRename(p.id, e.target.value)} onClick={e => e.stopPropagation()} />
              <span className="story-struct">{structureById(p.structureId).name}</span>
              <button className="ghost-btn" onClick={() => onOpen(p.id)}>Open</button>
              <button className="icon-btn" onClick={() => onDuplicate(p.id)} title="Duplicate">⎘</button>
              <button className="icon-btn" onClick={() => onDelete(p.id)} title="Delete">🗑</button>
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
      </div>
    </div>
  );
}

/* ===== markdown export ===== */
function toMarkdown(project, structure) {
  const lines = [`# ${project.title || "Untitled Story"}`, ""];
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
      lines.push(`- **${c.name || "Unnamed"}** (${c.role})${c.notes ? ` — ${c.notes}` : ""}`);
      for (const key of Object.keys(ACTS)) if (c.arc?.[key]) lines.push(`  - *${ACTS[key].label}:* ${c.arc[key]}`);
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
function download(filename, text) {
  const blob = new Blob([text], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ===== app ===== */
export default function StoryWheel() {
  const [projects, setProjects] = useState(loadProjects);
  const [activeId, setActiveId] = useState(() => loadActiveId());
  const [selected, setSelected] = useState(null);
  const [selectedArcAct, setSelectedArcAct] = useState(null);
  const [tab, setTab] = useState("beat"); // beat | arc | characters | notes
  const [showStories, setShowStories] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
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
    if (structure && (!selected || !structure.beats.some(b => b.id === selected)))
      setSelected(structure.beats[0]?.id || null);
  }, [structure?.id]); // eslint-disable-line

  useEffect(() => {
    setSelectedArcAct(project?.arcCharacterId ? "setup" : null);
  }, [project?.arcCharacterId]); // eslint-disable-line

  const update = patch => setProjects(ps => ps.map(p => (p.id === activeId ? { ...p, ...patch, updatedAt: Date.now() } : p)));

  if (!project || !structure) return <div className="boot">Sharpening the pencil…</div>;

  const beat = structure.beats.find(b => b.id === selected);
  const plotType = plotTypeById(project.plotType);
  const arcCharacter = project.characters.find(c => c.id === project.arcCharacterId) || null;
  // "A Christmas Carol" already illustrates the MICE Quotient's "Character" plot type act by act —
  // a character-driven plot type IS a change arc, so the same beats double as the arc reference
  // rather than duplicating the same story as separate data
  const arcExample = arcCharacter ? exampleById("christmas-carol-mice-character") : null;
  // every structure ships with exactly one worked literature example, so it's shown automatically
  // rather than picked from a dropdown — see it inline in the beat editor and split across the
  // grid below the timeline
  const structureExample = examplesFor("structure", structure.id)[0] || null;
  const plotTypeExamples = plotType ? examplesFor("plotType", plotType.id) : [];
  const plotTypeExample = plotTypeExamples.some(e => e.id === project.plotTypeExample) ? exampleById(project.plotTypeExample) : null;

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

  return (
    <div className="app">
      <style>{CSS}</style>
      <header className="topbar">
        <div className="brand">✦ Story Wheel</div>
        {!compareOpen && (
          <>
            <input className="title-input" value={project.title}
              onChange={e => update({ title: e.target.value })} placeholder="Story title" />
            <select className="struct-select" value={project.structureId}
              onChange={e => update({ structureId: e.target.value })}>
              {STRUCTURES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <button className="ghost-btn" onClick={() => setShowStories(true)}>My Stories</button>
            <button className="ghost-btn" onClick={() => setCompareOpen(true)}>Compare</button>
            <button className="primary-btn" onClick={() => download(`${(project.title || "story").replace(/\s+/g, "-")}.md`, toMarkdown(project, structure))}>
              Export
            </button>
          </>
        )}
      </header>

      {compareOpen ? (
        <CompareView onClose={() => setCompareOpen(false)} />
      ) : (
        <>
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
              <label className="plot-type-top-picker">See it in <span className="plot-type-hint">(a real example, mapped act-by-act)</span>
                <select value={project.plotTypeExample} onChange={e => update({ plotTypeExample: e.target.value })}>
                  <option value="">None</option>
                  {plotTypeExamples.map(ex => <option key={ex.id} value={ex.id}>{ex.title}</option>)}
                </select>
              </label>
            )}
          </div>

          <Timeline structure={structure} project={project} selected={selected} onSelect={id => { setSelected(id); setTab("beat"); }}
            arcCharacter={arcCharacter} selectedArcAct={selectedArcAct}
            onSelectArcAct={key => { setSelectedArcAct(key); setTab("arc"); }} />

          <div className="legend">
            {Object.values(ACTS).map(a => (
              <span key={a.label} className="legend-item"><i style={{ background: a.color }} />{a.label}</span>
            ))}
          </div>

          <ActTable structure={structure} plotType={plotType} plotTypeExample={plotTypeExample} structureExample={structureExample} />

          <main className="layout">
            <div className="side-col">
              <div className="tabs">
                <button className={tab === "beat" ? "is-sel" : ""} onClick={() => setTab("beat")}>Beat</button>
                {arcCharacter && (
                  <button className={tab === "arc" ? "is-sel" : ""} onClick={() => setTab("arc")}>Arc</button>
                )}
                <button className={tab === "characters" ? "is-sel" : ""} onClick={() => setTab("characters")}>Characters</button>
                <button className={tab === "notes" ? "is-sel" : ""} onClick={() => setTab("notes")}>Logline &amp; Notes</button>
              </div>
              {tab === "beat" && beat && (
                <BeatEditor beat={beat} text={project.beats[beat.id] || ""}
                  onChange={text => update({ beats: { ...project.beats, [beat.id]: text } })}
                  plotType={plotType} example={structureExample} />
              )}
              {tab === "arc" && arcCharacter && selectedArcAct && (
                <ArcEditor character={arcCharacter} act={selectedArcAct} text={arcCharacter.arc?.[selectedArcAct] || ""}
                  onChange={text => update({
                    characters: project.characters.map(c => (c.id === arcCharacter.id
                      ? { ...c, arc: { ...c.arc, [selectedArcAct]: text } } : c)),
                  })} example={arcExample} />
              )}
              {tab === "characters" && (
                <Characters characters={project.characters} onChange={characters => update({ characters })}
                  arcCharacterId={project.arcCharacterId} onArcCharacterChange={id => update({ arcCharacterId: id })} />
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
              onRename={renameStory} onDuplicate={duplicateStory} onDelete={deleteStory} onClose={() => setShowStories(false)} />
          )}
        </>
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
.tl-lane-arc .tl-clip{border-radius:3px}
.legend{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin:4px 0 20px}
.legend-item{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--dim)}
.legend-item i{width:9px;height:9px;border-radius:3px;display:inline-block}
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
.act-table-act{white-space:nowrap;font-weight:600;color:var(--gold)}
.act-table-act .act-breakdown-swatch{display:inline-block;vertical-align:middle;margin:0 8px 2px 0}
.act-table-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.act-table-list li{display:flex;gap:8px}
.act-table-list .act-breakdown-swatch{margin-top:5px}
.act-table-beat-name{font-weight:600;color:var(--ember);display:block;margin-bottom:2px}
.plot-type-panel{width:100%;max-width:420px;background:var(--panel);border:1px solid var(--border);
  border-radius:12px;padding:14px 16px}
.plot-type-taxonomy{font-size:10px;color:var(--dim);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
.plot-type-blurb{color:var(--gold);font-size:13px;font-style:italic;margin:0 0 12px}
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
.side-col{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:16px;
  min-height:420px;width:100%;max-width:720px}
.tabs{display:flex;gap:4px;margin-bottom:14px;border-bottom:1px solid var(--border);padding-bottom:10px}
.tabs button{background:transparent;border:none;color:var(--dim);font-size:13px;padding:6px 10px;border-radius:7px}
.tabs button.is-sel{background:var(--panel2);color:var(--gold)}
.beat-editor h3{font-family:'Fraunces',serif;margin:0 0 6px;font-size:20px;color:var(--gold)}
.guide{color:var(--dim);font-size:13px;margin:0 0 6px;line-height:1.5}
.beat-ex-line{color:var(--gold);font-size:12px;margin:0 0 12px;opacity:.85}
.beat-ex-line em{font-style:italic}
.beat-editor textarea{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;
  color:var(--ink);padding:12px;font-size:14px;line-height:1.6;font-family:'Fraunces',serif;resize:vertical}
.wc{color:var(--dim);font-size:11px;margin-top:6px;text-align:right}
.characters{display:flex;flex-direction:column;gap:8px}
.arc-tracker-picker{padding-bottom:12px;margin-bottom:4px;border-bottom:1px solid var(--border)}
.char-row{display:grid;grid-template-columns:1fr 120px 2fr auto;gap:8px}
.char-row input,.char-row select{background:var(--bg);border:1px solid var(--border);color:var(--ink);
  border-radius:7px;padding:8px 10px;font-size:13px}
.empty{color:var(--dim);font-size:13px}
.notes-panel{display:flex;flex-direction:column;gap:6px}
.notes-panel label{color:var(--dim);font-size:11px;text-transform:uppercase;letter-spacing:.04em;margin-top:8px}
.notes-panel input,.notes-panel textarea{background:var(--bg);border:1px solid var(--border);color:var(--ink);
  border-radius:8px;padding:10px 12px;font-size:14px;font-family:'Fraunces',serif}
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:10;padding:20px}
.modal{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:20px;width:100%;max-width:560px;max-height:80vh;overflow:auto}
.modal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.modal-head h3{font-family:'Fraunces',serif;margin:0;color:var(--gold)}
.story-list{list-style:none;margin:0 0 14px;padding:0;display:flex;flex-direction:column;gap:6px}
.story-list li{display:flex;align-items:center;gap:8px;padding:8px;border-radius:8px}
.story-list li.is-sel{background:var(--panel2)}
.story-list input{flex:1;background:var(--bg);border:1px solid var(--border);color:var(--ink);border-radius:6px;padding:6px 8px;font-size:13px}
.story-struct{color:var(--dim);font-size:11px;white-space:nowrap}
.struct-pick{display:flex;flex-direction:column;gap:8px}
.struct-opt{display:flex;flex-direction:column;align-items:flex-start;gap:2px;text-align:left;padding:10px 12px}
.struct-opt span{color:var(--dim);font-size:12px}
.compare-head{display:flex;align-items:flex-end;gap:16px;flex-wrap:wrap;margin-bottom:8px}
.compare-picker{display:flex;flex-direction:column;gap:6px}
.compare-picker-label{font-size:11px;color:var(--dim);text-transform:uppercase;letter-spacing:.04em}
.compare-kind-toggle{display:flex;gap:4px}
.compare-kind-toggle button{background:transparent;border:1px solid var(--border);color:var(--dim);font-size:11px;padding:4px 9px;border-radius:6px}
.compare-kind-toggle button.is-sel{background:var(--panel2);color:var(--gold);border-color:var(--gold)}
.compare-picker select{background:var(--panel);border:1px solid var(--border);color:var(--ink);border-radius:8px;padding:9px 10px;font-size:13px;font-family:inherit;text-transform:none;letter-spacing:normal;min-width:200px}
.compare-body{display:flex;flex-direction:column;align-items:center;gap:24px}
.compare-timeline{width:100%;max-width:820px}
.ribbon{opacity:.28}
.slice-num{font-family:'Archivo',sans-serif;font-size:26px;font-weight:700;fill:#120E1C;pointer-events:none}
.compare-legends{display:grid;grid-template-columns:1fr 1fr;gap:24px;width:100%;max-width:900px}
@media (max-width: 700px){ .compare-legends{grid-template-columns:1fr} }
.act-breakdown h4{font-family:'Fraunces',serif;color:var(--gold);margin:0 0 10px;font-size:16px}
.act-breakdown-row{display:flex;gap:10px;margin-bottom:10px}
.act-breakdown-swatch{width:10px;height:10px;border-radius:3px;flex:none;margin-top:4px}
.act-breakdown-label{font-size:12px;color:var(--dim);text-transform:uppercase;letter-spacing:.04em;margin-bottom:2px}
.act-breakdown-beats{font-size:13px;line-height:1.5}
`;
