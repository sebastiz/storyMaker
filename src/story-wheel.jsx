import { useEffect, useMemo, useRef, useState } from "react";
import { ACTS, STRUCTURES, structureById } from "./structures.js";
// Story Wheel — a circular story-structure sketchpad
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
    id: uid(), title: "Untitled Story", structureId, genre: "", logline: "",
    beats: {}, characters: [], createdAt: now, updatedAt: now,
  };
}

/* ===== geometry ===== */
function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function donutSlice(cx, cy, rInner, rOuter, a0, a1) {
  const large = a1 - a0 > 180 ? 1 : 0;
  const p0o = polar(cx, cy, rOuter, a0), p1o = polar(cx, cy, rOuter, a1);
  const p0i = polar(cx, cy, rInner, a0), p1i = polar(cx, cy, rInner, a1);
  return [
    `M ${p0o.x} ${p0o.y}`, `A ${rOuter} ${rOuter} 0 ${large} 1 ${p1o.x} ${p1o.y}`,
    `L ${p1i.x} ${p1i.y}`, `A ${rInner} ${rInner} 0 ${large} 0 ${p0i.x} ${p0i.y}`, "Z",
  ].join(" ");
}
// each slice is drawn at least MIN_SHARE wide so a single-beat "moment" (a 1%-of-story catalyst)
// stays clickable and legible — the wheel reads proportionally without any wedge going to a sliver
const MIN_SHARE = 4;
function wedges(beats) {
  const shares = beats.map(b => Math.max(b.pct, MIN_SHARE));
  const total = shares.reduce((s, n) => s + n, 0);
  let angle = 0;
  return beats.map((b, i) => {
    const span = (shares[i] / total) * 360;
    const a0 = angle, a1 = angle + span;
    angle = a1;
    return { beat: b, a0, a1, mid: (a0 + a1) / 2 };
  });
}
const wordCount = s => (s && s.trim() ? s.trim().split(/\s+/).length : 0);

/* ===== wheel ===== */
function Wheel({ structure, project, selected, onSelect }) {
  const size = 420, cx = size / 2, cy = size / 2, rOuter = 200, rInner = 108;
  const slices = useMemo(() => wedges(structure.beats), [structure]);
  const done = structure.beats.filter(b => wordCount(project.beats[b.id]) > 0).length;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="wheel" role="img" aria-label={`${structure.name} wheel`}>
      {slices.map(({ beat, a0, a1, mid }, i) => {
        const isSel = selected === beat.id;
        const hasText = wordCount(project.beats[beat.id]) > 0;
        const p = polar(cx, cy, (rInner + rOuter) / 2, mid);
        const wide = a1 - a0 > 14;
        return (
          <g key={beat.id} className={`slice${isSel ? " is-sel" : ""}`} onClick={() => onSelect(beat.id)}>
            <path d={donutSlice(cx, cy, rInner, rOuter, a0 + 0.6, a1 - 0.6)}
              fill={ACTS[beat.act].color} opacity={isSel ? 1 : hasText ? 0.82 : 0.42} />
            {wide && (
              <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="slice-num">
                {i + 1}
              </text>
            )}
            {hasText && (
              <circle cx={polar(cx, cy, rOuter - 14, mid).x} cy={polar(cx, cy, rOuter - 14, mid).y} r={3.4} className="dot" />
            )}
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={rInner - 4} className="hub" />
      <text x={cx} y={cy - 10} textAnchor="middle" className="hub-title">{project.title || "Untitled Story"}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" className="hub-sub">{done} / {structure.beats.length} beats</text>
    </svg>
  );
}

/* ===== beat list + editor ===== */
function BeatList({ structure, project, selected, onSelect }) {
  return (
    <ol className="beat-list">
      {structure.beats.map((b, i) => {
        const has = wordCount(project.beats[b.id]) > 0;
        return (
          <li key={b.id} className={selected === b.id ? "is-sel" : ""} onClick={() => onSelect(b.id)} title={`e.g. ${b.ex}`}>
            <span className="beat-swatch" style={{ background: ACTS[b.act].color }} />
            <span className="beat-num">{i + 1}</span>
            <span className="beat-name">{b.name}</span>
            <span className="beat-ex">{b.ex}</span>
            <span className={`beat-flag${has ? " on" : ""}`}>{has ? "●" : "○"}</span>
          </li>
        );
      })}
    </ol>
  );
}

function BeatEditor({ beat, text, onChange }) {
  return (
    <div className="beat-editor">
      <h3>{beat.name}</h3>
      <p className="guide">{beat.guide}</p>
      <p className="beat-ex-line">e.g. <em>{beat.ex}</em></p>
      <textarea value={text} placeholder="Write the scene, or just jot what has to happen…"
        onChange={e => onChange(e.target.value)} rows={12} />
      <div className="wc">{wordCount(text)} words</div>
    </div>
  );
}

/* ===== characters ===== */
const ROLES = ["Protagonist", "Antagonist", "Supporting", "Other"];
function Characters({ characters, onChange }) {
  const add = () => onChange([...characters, { id: uid(), name: "", role: "Supporting", notes: "" }]);
  const set = (id, patch) => onChange(characters.map(c => (c.id === id ? { ...c, ...patch } : c)));
  const remove = id => onChange(characters.filter(c => c.id !== id));
  return (
    <div className="characters">
      {characters.length === 0 && <p className="empty">No characters yet.</p>}
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
  if (project.characters.length) {
    lines.push("## Characters", "");
    for (const c of project.characters) lines.push(`- **${c.name || "Unnamed"}** (${c.role})${c.notes ? ` — ${c.notes}` : ""}`);
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
  const [tab, setTab] = useState("beat"); // beat | characters | notes
  const [showStories, setShowStories] = useState(false);
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

  const update = patch => setProjects(ps => ps.map(p => (p.id === activeId ? { ...p, ...patch, updatedAt: Date.now() } : p)));

  if (!project || !structure) return <div className="boot">Sharpening the pencil…</div>;

  const beat = structure.beats.find(b => b.id === selected);

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
        <input className="title-input" value={project.title}
          onChange={e => update({ title: e.target.value })} placeholder="Story title" />
        <select className="struct-select" value={project.structureId}
          onChange={e => update({ structureId: e.target.value })}>
          {STRUCTURES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button className="ghost-btn" onClick={() => setShowStories(true)}>My Stories</button>
        <button className="primary-btn" onClick={() => download(`${(project.title || "story").replace(/\s+/g, "-")}.md`, toMarkdown(project, structure))}>
          Export
        </button>
      </header>

      <p className="blurb">{structure.blurb}</p>

      <main className="layout">
        <div className="wheel-col">
          <Wheel structure={structure} project={project} selected={selected} onSelect={id => { setSelected(id); setTab("beat"); }} />
          <BeatList structure={structure} project={project} selected={selected} onSelect={id => { setSelected(id); setTab("beat"); }} />
          <div className="legend">
            {Object.values(ACTS).map(a => (
              <span key={a.label} className="legend-item"><i style={{ background: a.color }} />{a.label}</span>
            ))}
          </div>
        </div>

        <div className="side-col">
          <div className="tabs">
            <button className={tab === "beat" ? "is-sel" : ""} onClick={() => setTab("beat")}>Beat</button>
            <button className={tab === "characters" ? "is-sel" : ""} onClick={() => setTab("characters")}>Characters</button>
            <button className={tab === "notes" ? "is-sel" : ""} onClick={() => setTab("notes")}>Logline &amp; Notes</button>
          </div>
          {tab === "beat" && beat && (
            <BeatEditor beat={beat} text={project.beats[beat.id] || ""}
              onChange={text => update({ beats: { ...project.beats, [beat.id]: text } })} />
          )}
          {tab === "characters" && (
            <Characters characters={project.characters} onChange={characters => update({ characters })} />
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
.layout{display:grid;grid-template-columns:minmax(320px,460px) 1fr;gap:24px;align-items:start}
@media (max-width: 860px){ .layout{grid-template-columns:1fr} }
.wheel-col{display:flex;flex-direction:column;align-items:center;gap:12px}
.wheel{width:100%;max-width:420px}
.slice{cursor:pointer;transition:opacity .15s}
.slice:hover path{opacity:1}
.slice.is-sel path{filter:drop-shadow(0 0 6px rgba(233,200,138,.55))}
.slice-num{font-family:'Archivo',sans-serif;font-size:13px;font-weight:700;fill:#120E1C;pointer-events:none}
.dot{fill:#120E1C;stroke:var(--ink);stroke-width:1;pointer-events:none}
.hub{fill:var(--panel);stroke:var(--border);stroke-width:1}
.hub-title{font-family:'Fraunces',serif;font-size:16px;fill:var(--ink);pointer-events:none}
.hub-sub{font-size:11px;fill:var(--dim);pointer-events:none}
.beat-list{list-style:none;margin:0;padding:0;width:100%;max-width:420px;display:flex;flex-direction:column;gap:2px}
.beat-list li{display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:7px;cursor:pointer;font-size:13px}
.beat-list li:hover{background:var(--panel)}
.beat-list li.is-sel{background:var(--panel2)}
.beat-swatch{width:8px;height:8px;border-radius:50%;flex:none}
.beat-num{color:var(--dim);width:18px;flex:none;font-size:12px}
.beat-name{flex:1}
.beat-ex{color:var(--dim);font-size:11px;font-style:italic;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px}
.beat-flag{color:var(--dim);font-size:11px}
.beat-flag.on{color:var(--gold)}
.legend{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:4px}
.legend-item{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--dim)}
.legend-item i{width:9px;height:9px;border-radius:3px;display:inline-block}
.side-col{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:16px;min-height:420px}
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
`;
