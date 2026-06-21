/* StartWise — Reports, RunBook, Chart of Accounts, TaskEditor modal */
const { useState: useS2 } = React;
const SW2 = window.StartWiseData;
const DSmore = window.AcrossTheTableDesignSystem_520822;

/* =========================================================== TASK EDITOR ===== */
const FIN_CATS = ["Equipment & Assets", "Legal & Registration", "Sales Strategies", "Office & Operation", "Financial Planning", "Human Resource Strategy", "Location & Infrastructure", "Contracts"];
const NONFIN_CATS = ["Branding Strategy", "Customer Research", "Entrepreneur Mindset", "Financial Planning", "Funding Options", "Growth Strategy", "Launch Strategy", "Legal & Compliance", "Market Research", "Marketing Strategy", "Product / Service Development", "Sales Strategies", "Systems & Operations"];

/* Searchable vendor picker sourced from the StartWise vendor library (Excel import).
   onPick(name, website, role) — role lets the editor auto-connect the matching GL account. */
function VendorPicker({ value, website, desc, onPick, preferTask }) {
  const LIB = window.StartWiseVendorLibrary || [];
  const [q, setQ] = useS2("");
  const [open, setOpen] = useS2(false);
  const ql = q.trim().toLowerCase();
  let groups = LIB
    .map((g) => ({ ...g, vendors: g.vendors.filter((v) => !ql || v.name.toLowerCase().includes(ql) || g.task.toLowerCase().includes(ql) || (g.area || "").toLowerCase().includes(ql)) }))
    .filter((g) => g.vendors.length);
  const scoped = !ql && preferTask ? groups.filter((g) => g.task === preferTask) : null;
  const showGroups = scoped && scoped.length ? scoped : groups;
  const total = LIB.reduce((s, g) => s + g.vendors.length, 0);

  return (
    <div>
      <label style={{ font: "600 12px var(--font-sans)", color: "var(--ink-700)", display: "block", marginBottom: 5 }}>Choose a vendor <span style={{ color: "var(--ink-400)", fontWeight: 400 }}>— sets the GL account automatically</span></label>
      {value ? (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", border: "1px solid var(--forest-500)", background: "var(--forest-050)", borderRadius: "var(--radius-md)" }}>
          <Icon name="check" size={16} color="var(--forest-600)" style={{ marginTop: 2, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}>{value}</div>
            {desc && <div style={{ fontSize: 12, color: "var(--ink-600)", marginTop: 2, lineHeight: 1.45 }}>{desc}</div>}
            {website && <a href={website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11.5, color: "var(--navy-600)", wordBreak: "break-all" }}>{website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</a>}
          </div>
          <button type="button" onClick={() => onPick("", "", null, "")} title="Clear" style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-400)", alignSelf: "flex-start" }}><Icon name="x" size={16} /></button>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 10px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", background: "#fff" }}>
          <Icon name="search" size={15} color="var(--ink-400)" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} placeholder={`Search ${total} vendors — e.g. QuickBooks, CRM, Ads`} style={{ border: "none", outline: "none", fontSize: 13.5, padding: "9px 0", width: "100%", background: "transparent" }} />
        </div>
      )}
      {!value && open && (
        <div style={{ marginTop: 6, maxHeight: 230, overflowY: "auto", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", background: "#fff" }}>
          {scoped && scoped.length > 0 && <div style={{ padding: "7px 12px", fontSize: 11.5, color: "var(--ink-500)", background: "var(--gold-050)" }}>Vendors suggested for “{preferTask}”. Type to search all {total}.</div>}
          {showGroups.length === 0 && <div style={{ padding: "14px", fontSize: 13, color: "var(--ink-400)" }}>No vendors match “{q}”.</div>}
          {showGroups.map((g) => (
            <div key={g.task + g.sub}>
              <div style={{ position: "sticky", top: 0, background: "var(--cream-100)", padding: "6px 12px", font: "600 9.5px var(--font-mono)", letterSpacing: "0.08em", color: "var(--ink-500)" }}>{g.task.toUpperCase()}{g.area ? " · " + g.area : ""}</div>
              {g.vendors.map((v) => (
                <button key={v.name} type="button" onClick={() => { onPick(v.name, v.website, g.role, v.desc || g.desc || ""); setOpen(false); setQ(""); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "transparent", border: "none", borderTop: "1px solid var(--border-subtle)", cursor: "pointer", textAlign: "left" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--cream-50)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}>{v.name}</span>
                    {(v.desc || g.desc) && <span style={{ display: "block", fontSize: 11.5, color: "var(--ink-500)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.desc || g.desc}</span>}
                  </span>
                  <Icon name="plus" size={15} color="var(--ink-400)" />
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* Searchable task-name dropdown sourced from the StartWise task catalog (Excel import).
   Typing keeps a custom name; selecting an item fills category / cost / GL role. */
function TaskNamePicker({ value, type, onType, onSelect }) {
  const CAT = window.StartWiseTaskCatalog || { financial: [], nonFinancial: [] };
  const list = (type === "Financial" ? CAT.financial : CAT.nonFinancial) || [];
  const [open, setOpen] = useS2(false);
  const ql = (value || "").trim().toLowerCase();
  const filtered = list.filter((it) => !ql || it.name.toLowerCase().includes(ql) || (it.category || "").toLowerCase().includes(ql) || (it.sub || "").toLowerCase().includes(ql)).slice(0, 120);
  const byCat = {}; filtered.forEach((it) => { (byCat[it.category] = byCat[it.category] || []).push(it); });
  const exact = list.some((it) => it.name.toLowerCase() === ql);

  return (
    <div>
      <label style={{ font: "600 12px var(--font-sans)", color: "var(--ink-700)", display: "block", marginBottom: 5 }}>Task name <span style={{ color: "var(--ink-400)", fontWeight: 400 }}>— pick from the {list.length}-task library or type your own</span></label>
      <div onMouseDown={(e) => { if (e.target.tagName !== "INPUT") { e.preventDefault(); setOpen((o) => !o); } }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 10px", border: `1px solid ${open ? "var(--navy-700)" : "var(--border-default)"}`, borderRadius: "var(--radius-md)", background: "#fff", cursor: "pointer" }}>
        <Icon name="search" size={15} color="var(--ink-400)" />
        <input value={value} onChange={(e) => { onType(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} placeholder={type === "Financial" ? "e.g. General Liability Insurance" : "e.g. Build website + booking"} style={{ border: "none", outline: "none", fontSize: 14, padding: "10px 0", width: "100%", background: "transparent", cursor: "text" }} />
        <Icon name="chevron" size={16} color="var(--ink-400)" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
      </div>
      {open && (
        <div style={{ marginTop: 6, maxHeight: 260, overflowY: "auto", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", background: "#fff" }}>
          {Object.keys(byCat).map((cat) => (
            <div key={cat}>
              <div style={{ position: "sticky", top: 0, background: "var(--cream-100)", padding: "6px 12px", font: "600 9.5px var(--font-mono)", letterSpacing: "0.08em", color: "var(--ink-500)" }}>{(cat || "").toUpperCase()}</div>
              {byCat[cat].map((it) => (
                <button key={it.name + it.sub} type="button" onClick={() => { onSelect(it); setOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "transparent", border: "none", borderTop: "1px solid var(--border-subtle)", cursor: "pointer", textAlign: "left" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--cream-50)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}>{it.name}</span>
                    <span style={{ display: "block", fontSize: 11.5, color: "var(--ink-500)" }}>{it.sub}{it.vendors && it.vendors.length ? ` · ${it.vendors.length} vendor${it.vendors.length === 1 ? "" : "s"}` : ""}</span>
                  </span>
                  {type === "Financial" && it.est ? <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-500)" }}>{SW2.fmt0(it.est)}</span> : null}
                </button>
              ))}
            </div>
          ))}
          {value.trim() && !exact && (
            <button type="button" onClick={() => setOpen(false)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "var(--navy-050)", border: "none", borderTop: "1px solid var(--border-subtle)", cursor: "pointer", textAlign: "left", fontSize: 13, color: "var(--navy-700)", fontWeight: 600 }}>
              <Icon name="pencil" size={14} /> Use “{value}” as a custom task
            </button>
          )}
          {filtered.length === 0 && !value.trim() && <div style={{ padding: "14px", fontSize: 13, color: "var(--ink-400)" }}>Start typing to search the task library.</div>}
        </div>
      )}
    </div>
  );
}

function TaskEditor({ task, onSave, onClose, onDelete, coa = SW2.coa }) {
  const { Input, Select } = DSmore;
  const CAT = window.StartWiseTaskCatalog || {};
  const isNew = !task.id;
  const [t, setT] = useS2({ name: "", desc: "", type: "Financial", category: "Office & Operation", priority: "Medium", week: 1, est: 0, actual: 0, status: "To Do", gl: (coa[0] && coa[0].num) || "1500", due: SW2.due(1), vendorType: "", followUp: "", ...task });
  const [vTask, setVTask] = useS2(task.name || "");
  const set = (patch) => setT({ ...t, ...patch });
  const fin = t.type === "Financial";
  const cats = fin ? FIN_CATS : NONFIN_CATS;

  // Pick a task from the catalog → fill category, cost, and the GL role
  const selectCatalog = (it) => {
    const patch = { name: it.name };
    if (it.category && cats.includes(it.category)) patch.category = it.category;
    if (fin) {
      if (it.est) patch.est = it.est;
      if (it.role && CAT.resolveGL) patch.gl = CAT.resolveGL(coa, it.role);
      if (it.desc) patch.desc = it.desc;
    }
    setVTask(it.name);
    set(patch);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(14,27,44,0.45)", zIndex: 60, display: "grid", placeItems: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", background: "#fff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-card-hover)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--border-default)", position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
          <h2 style={{ font: "700 19px var(--font-display)", margin: 0, color: "var(--ink-900)" }}>{isNew ? "Add a task" : "Edit task"}</h2>
          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-400)" }}><Icon name="x" size={20} /></button>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <Select label="Type" value={t.type} onChange={(e) => { setVTask(""); set({ type: e.target.value, name: "", category: e.target.value === "Financial" ? "Office & Operation" : NONFIN_CATS[0] }); }}><option>Financial</option><option>Non-Financial</option></Select>
          <TaskNamePicker value={t.name} type={t.type} onType={(v) => { setVTask(""); set({ name: v }); }} onSelect={selectCatalog} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Select label="Priority" value={t.priority} onChange={(e) => set({ priority: e.target.value })}>{SW2.PRIORITIES.map((p) => <option key={p}>{p}</option>)}</Select>
            <Select label="Status" value={t.status} onChange={(e) => set({ status: e.target.value, followUp: e.target.value === "Follow-Up" && !t.followUp ? SW2.due(t.week) : t.followUp })}>{SW2.STATUSES.map((s) => <option key={s}>{s}</option>)}</Select>
            <Select label="Week" value={t.week} onChange={(e) => set({ week: +e.target.value, due: SW2.due(+e.target.value) })}>{Array.from({ length: 12 }, (_, k) => k + 1).map((k) => <option key={k} value={k}>Week {k} — {SW2.weekThemes[k]}</option>)}</Select>
            <Input label="Due date" type="date" value={t.due} onChange={(e) => set({ due: e.target.value })} />
          </div>
          {t.status === "Follow-Up" && (
            <div style={{ background: "var(--gold-050)", border: "1px solid var(--gold-100)", borderRadius: "var(--radius-md)", padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
              <Icon name="bell" size={18} color="var(--gold-700)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>Follow up on this task</div>
                <div style={{ fontSize: 12, color: "var(--ink-500)" }}>We'll flag it on your planner and dashboard on this date.</div>
              </div>
              <input type="date" value={t.followUp || ""} onChange={(e) => set({ followUp: e.target.value })} style={{ padding: "9px 12px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", fontSize: 13.5, fontFamily: "var(--font-sans)" }} />
            </div>
          )}
          {fin && (
            <div style={{ background: "var(--cream-50)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ font: "600 10px var(--font-mono)", letterSpacing: "0.1em", color: "var(--ink-500)" }}>FINANCIAL DETAILS</div>
              <VendorPicker value={t.vendor} website={t.vendorWebsite} desc={t.vendorDesc} preferTask={vTask} onPick={(name, web, role, vdesc) => set({ vendor: name, vendorWebsite: web, vendorDesc: vdesc || "", desc: vdesc || t.desc, gl: role && CAT.resolveGL ? CAT.resolveGL(coa, role) : t.gl })} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <Input label="Estimated cost" type="number" value={t.est} onChange={(e) => set({ est: +e.target.value })} />
                <Input label="Actual cost" type="number" value={t.actual} onChange={(e) => set({ actual: +e.target.value })} />
                <Select label="GL account" value={t.gl} onChange={(e) => set({ gl: e.target.value })}>{coa.map((a) => <option key={a.num} value={a.num}>{a.num} — {a.name}</option>)}</Select>
              </div>
              {t.vendor && <div style={{ fontSize: 11.5, color: "var(--forest-700)", display: "flex", alignItems: "center", gap: 6 }}><Icon name="check" size={13} /> {t.vendor} is connected to GL {t.gl} — {(coa.find((a) => a.num === t.gl) || {}).name}</div>}
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderTop: "1px solid var(--border-default)", position: "sticky", bottom: 0, background: "#fff" }}>
          <div>{!isNew && onDelete && <button onClick={() => onDelete(t.id)} style={{ ...btnGhost, color: "var(--red-600)", border: "1px solid var(--red-100)" }}><Icon name="trash" size={15} /> Delete</button>}</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={btnGhost}>Cancel</button>
            <button onClick={() => t.name.trim() && onSave(t)} style={btnPrimary}><Icon name="check" size={16} /> {isNew ? "Add task" : "Save changes"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================== REPORTS ===== */
function Reports({ tasks }) {
  const fin = tasks.filter((t) => t.type === "Financial");
  const done = tasks.filter((t) => t.status === "Completed").length;
  const prog = tasks.filter((t) => t.status === "In Progress").length;
  const todo = tasks.filter((t) => t.status === "To Do").length;

  const finCats = Array.from(new Set(fin.map((t) => t.category)));
  const catRows = finCats.map((c) => {
    const items = fin.filter((t) => t.category === c);
    return {
      label: c, meta: `${SW2.fmt0(items.reduce((s, t) => s + +t.actual, 0))} / ${SW2.fmt0(items.reduce((s, t) => s + +t.est, 0))} · ${items.length} tasks`,
      bars: [
        { value: items.reduce((s, t) => s + +t.est, 0), color: "var(--navy-600)" },
        { value: items.reduce((s, t) => s + +t.actual, 0), color: "var(--gold-500)" },
      ],
    };
  });

  const nonCats = Array.from(new Set(tasks.filter((t) => t.type === "Non-Financial").map((t) => t.category))).sort();
  const nonRows = nonCats.map((c) => {
    const items = tasks.filter((t) => t.category === c);
    const d = items.filter((t) => t.status === "Completed").length;
    const p = items.length ? Math.round((d / items.length) * 100) : 0;
    return { label: c, meta: `${items.length} tasks · ${p}% done`, bars: [{ value: p, color: p === 100 ? "var(--forest-600)" : "var(--navy-500)" }] };
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Panel title="Category breakdown" subtitle="Estimated vs actual spend by category">
        <HBar rows={catRows} />
        <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-600)" }}><span style={{ width: 11, height: 11, borderRadius: 3, background: "var(--navy-600)" }}></span>Estimated</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-600)" }}><span style={{ width: 11, height: 11, borderRadius: 3, background: "var(--gold-500)" }}></span>Actual</span>
        </div>
      </Panel>
      <Panel title="Task completion status" subtitle="To do / In progress / Done across all tasks">
        <Donut
          data={[{ label: "Completed", value: done, color: "var(--forest-600)" }, { label: "In progress", value: prog, color: "var(--navy-500)" }, { label: "To do", value: todo, color: "var(--ink-200)" }]}
          centerTop={`${done}/${tasks.length}`} centerBottom="Done"
        />
      </Panel>
      <Panel title="Financial budget health" subtitle={`${finCats.length} categories — actual vs estimated`}>
        <HBar rows={catRows.map((r) => ({ ...r, bars: [r.bars[1], { value: r.bars[0].value, color: "var(--cream-100)" }] }))} />
      </Panel>
      <Panel title="Non-financial progress" subtitle={`${nonCats.length} operational categories — task completion`}>
        <div style={{ maxHeight: 360, overflowY: "auto", paddingRight: 4 }}><HBar rows={nonRows} money={false} /></div>
      </Panel>
    </div>
  );
}

/* =========================================================== RUNBOOK ===== */
function VendorDirectory() {
  const all = (window.StartWiseSource && window.StartWiseSource.vendors) || [];
  const cats = ["All", ...Array.from(new Set(all.map((v) => v.category).filter(Boolean))).sort()];
  const [q, setQ] = useS2("");
  const [cat, setCat] = useS2("All");
  const rows = all.filter((v) => (cat === "All" || v.category === cat) && v.name.toLowerCase().includes(q.toLowerCase()));
  const sel = { padding: "8px 12px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", fontSize: 13, background: "#fff", color: "var(--ink-700)" };
  const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return u.replace(/^https?:\/\//, "").split("/")[0]; } };
  return (
    <Panel
      title="Suggested vendors & tools"
      subtitle={`${all.length} vendors from the Across the Table launch library — with website links`}
      right={
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 10px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", background: "#fff" }}>
            <Icon name="search" size={15} color="var(--ink-400)" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search vendors" style={{ border: "none", outline: "none", fontSize: 13, padding: "8px 0", width: 130, background: "transparent" }} />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} style={sel}>{cats.map((c) => <option key={c}>{c === "All" ? "All categories" : c}</option>)}</select>
        </div>
      }
    >
      <div style={{ maxHeight: 440, overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, paddingRight: 4 }}>
        {rows.map((v, i) => (
          <a key={i} href={v.website || "#"} target="_blank" rel="noopener noreferrer" onClick={(e) => { if (!v.website) e.preventDefault(); }} style={{ display: "flex", flexDirection: "column", gap: 6, padding: "12px 14px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", background: "var(--cream-50)", textDecoration: "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}>{v.name}</span>
              {v.website && <Icon name="arrowRight" size={14} color="var(--navy-600)" />}
            </div>
            {v.category && <span style={{ fontSize: 10.5, fontWeight: 600, color: "var(--gold-700)", background: "var(--gold-050)", padding: "2px 7px", borderRadius: 999, alignSelf: "flex-start" }}>{v.category}</span>}
            {v.website && <span style={{ fontSize: 11.5, color: "var(--navy-600)", wordBreak: "break-all" }}>{host(v.website)}</span>}
          </a>
        ))}
        {rows.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "30px 0", color: "var(--ink-400)", fontSize: 14 }}>No vendors match your search.</div>}
      </div>
    </Panel>
  );
}

function daysUntil(dateStr) {
  if (!dateStr || dateStr === "\u2014") return null;
  const d = new Date(dateStr); if (isNaN(d)) return null;
  return Math.round((d.getTime() - Date.now()) / 86400000);
}
const vStatusPill = (status) => {
  const map = { Active: { bg: "var(--success-bg)", fg: "var(--success)" }, Pending: { bg: "var(--info-bg)", fg: "var(--info)" }, Inactive: { bg: "var(--ink-100)", fg: "var(--ink-500)" } };
  const s = map[status] || map.Active;
  return <span style={{ background: s.bg, color: s.fg, fontSize: 10.5, fontWeight: 600, padding: "2px 9px", borderRadius: 999 }}>{status}</span>;
};

function RunBook({ vendors, setVendors, products = [] }) {
  const [cat, setCat] = useS2("All");
  const BZ = window.StartWiseBiz;
  const rate = (id, n) => setVendors(vendors.map((v) => (v.id === id ? { ...v, rating: n } : v)));
  const del = (id) => setVendors(vendors.filter((v) => v.id !== id));
  const cats = ["All", ...Array.from(new Set(vendors.map((v) => v.category).filter(Boolean)))];
  const rows = vendors.filter((v) => cat === "All" || v.category === cat);

  // dashboard metrics
  const active = vendors.filter((v) => v.status === "Active").length;
  const expiring = vendors.filter((v) => { const d = daysUntil(v.renewal); return d != null && d >= 0 && d <= 30; });
  const rated = vendors.filter((v) => v.rating > 0);
  const avgRating = rated.length ? (rated.reduce((s, v) => s + v.rating, 0) / rated.length) : 0;
  const upcoming = vendors.filter((v) => { const d = daysUntil(v.nextOrder); return d != null && d >= 0 && d <= 14; });
  const lowStock = (products || []).filter((p) => BZ && BZ.lowStock(p));
  // vendor spend by category
  const spendByCat = {};
  vendors.forEach((v) => { spendByCat[v.category || "Other"] = (spendByCat[v.category || "Other"] || 0) + (+v.cost || 0); });
  const spendRows = Object.entries(spendByCat).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, meta: SW2.fmt0(value), bars: [{ value, color: "var(--navy-600)" }] }));
  const sel = { padding: "8px 12px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", fontSize: 13, background: "#fff", color: "var(--ink-700)" };
  const ctx = "Vendors (category · payment terms · rating · monthly/contract cost):\n" + vendors.map((v) => `- ${v.vendorName} [${v.category}]: ${v.terms || "?"}, ${v.rating || "unrated"}\u2605, ${SW2.fmt0(v.cost)}`).join("\n");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <Callout icon="user" title="Manage every company that helps you run your business.">
        Track suppliers, software, agencies, and contractors in one place — with ratings, payment terms, and renewal reminders so nothing slips through the cracks.
      </Callout>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <Kpi label="Active vendors" value={active} sub={`${vendors.length} total`} />
        <Kpi label="Contracts expiring soon" value={expiring.length} tone={expiring.length ? "warn" : undefined} sub="within 30 days" />
        <Kpi label="Average vendor rating" value={avgRating ? avgRating.toFixed(1) + " ★" : "—"} />
        <Kpi label="Upcoming orders" value={upcoming.length} sub="next 14 days" />
      </div>

      {(expiring.length > 0 || lowStock.length > 0) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {expiring.map((v) => (
            <Callout key={v.id} icon="flag" title="Contract renewal alert">
              Your contract with <strong>{v.vendorName}</strong> {(() => { const d = daysUntil(v.renewal); return d === 0 ? "expires today" : `expires in ${d} day${d === 1 ? "" : "s"}`; })()}. Review terms before it renews.
            </Callout>
          ))}
          {lowStock.map((p) => (
            <Callout key={p.id} icon="bell" title="Reorder alert">
              <strong>{p.name}</strong> has reached its minimum stock level. It may be time to reorder {p.reorder ? `${p.reorder} units` : ""} from your vendor.
            </Callout>
          ))}
        </div>
      )}

    <Panel
      title="Your vendors"
      subtitle="Vendor records — start one by marking a financial task Done, then fill in the details"
      right={
        <div style={{ display: "flex", gap: 8 }}>
          <select value={cat} onChange={(e) => setCat(e.target.value)} style={sel}>{cats.map((c) => <option key={c}>{c === "All" ? "All categories" : c}</option>)}</select>
          <button style={btnGhost}><Icon name="printer" size={15} /> Print PDF</button>
        </div>
      }
    >
      {rows.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--ink-400)", fontSize: 14 }}>No vendors yet — complete a financial task to start your RunBook.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {rows.map((v) => (
            <div key={v.id} style={{ border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 18, background: "var(--cream-50)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ font: "700 16px var(--font-display)", color: "var(--ink-900)" }}>{v.vendorName}</span>
                    {vStatusPill(v.status || "Active")}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 2 }}>{v.category ? v.category + " · " : ""}{v.service}</div>
                </div>
                <Stars value={v.rating} onChange={(n) => rate(v.id, n)} size={17} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
                {[["Contact", v.contact], ["Phone", v.phone], ["Email", v.email], ["Payment terms", v.terms || "—"], ["Cost", SW2.fmt(v.cost)], ["GL account", v.gl], ["Last order", v.lastOrder || "—"], ["Next order", v.nextOrder || "—"], ["Renewal", v.renewal]].map(([k, val]) => (
                  <div key={k}>
                    <div style={{ font: "600 9px var(--font-mono)", letterSpacing: "0.08em", color: "var(--ink-400)" }}>{k.toUpperCase()}</div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-800)", marginTop: 2, wordBreak: "break-word" }}>{val || "—"}</div>
                  </div>
                ))}
              </div>
              {v.notes && <div style={{ fontSize: 12.5, color: "var(--ink-600)", fontStyle: "italic", marginBottom: 12 }}>"{v.notes}"</div>}
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ ...btnOutline, fontSize: 12, padding: "6px 12px" }}><Icon name="pencil" size={14} /> Edit</button>
                <button onClick={() => del(v.id)} style={{ ...btnOutline, fontSize: 12, padding: "6px 12px", color: "var(--red-600)", borderColor: "var(--red-100)" }}><Icon name="trash" size={14} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>

    {spendRows.length > 0 && (
      <Panel title="Vendor spend by category" subtitle="Where your vendor dollars go">
        <HBar rows={spendRows} />
      </Panel>
    )}

    <VendorDirectory />

    <AiAssistant icon="user" title="Optimize my vendors" subtitle="Ask your AI to find cost-saving opportunities" prompt={(window.StartWiseBiz.aiAssistant[2]).prompt} context={ctx} />
    </div>
  );
}

/* =========================================================== CHART OF ACCOUNTS ===== */
function COA({ tasks, coa = SW2.coa, business }) {
  const posted = tasks.filter((t) => t.type === "Financial" && t.status === "Completed" && +t.actual > 0);
  const grouped = {};
  const order = [];
  coa.forEach((a) => { if (!grouped[a.type]) { grouped[a.type] = []; order.push(a.type); } grouped[a.type].push(a); });
  const typeColor = { Asset: "var(--forest-600)", Bank: "var(--forest-600)", "Accounts Receivable": "var(--forest-500)", "Other Current Asset": "var(--forest-700)", "Fixed Asset": "var(--forest-800)", Liability: "var(--red-600)", "Accounts Payable": "var(--red-600)", "Credit Card": "var(--red-600)", "Long Term Liability": "var(--gold-700)", Equity: "var(--navy-700)", Revenue: "var(--gold-600)", Income: "var(--gold-600)", "Cost of Goods Sold": "var(--ink-600)", Expense: "var(--navy-500)" };
  const tc = (t) => typeColor[t] || "var(--ink-600)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Panel
        title="Chart of Accounts"
        subtitle={`${(business && business.businessType) || "Tailored"} edition · ${coa.length} accounts, QuickBooks-ready`}
        right={<div style={{ display: "flex", gap: 8 }}><button style={btnGhost}><Icon name="download" size={15} /> Export CSV</button><button style={btnGhost}><Icon name="file" size={15} /> Export to QuickBooks</button></div>}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                {["GL #", "Account name", "Type", "Category", "Description"].map((h) => (
                  <th key={h} style={{ font: "600 10px var(--font-mono)", letterSpacing: "0.08em", color: "var(--ink-500)", padding: "0 12px 10px" }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {order.map((type) => (
                grouped[type] ? [
                  <tr key={type + "h"} style={{ background: "var(--cream-100)" }}>
                    <td colSpan={5} style={{ padding: "8px 12px", font: "700 11px var(--font-mono)", letterSpacing: "0.1em", color: tc(type) }}>{type.toUpperCase()}</td>
                  </tr>,
                  ...grouped[type].map((a) => (
                    <tr key={a.num} style={{ borderTop: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "11px 12px", fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--navy-700)" }}>{a.num}</td>
                      <td style={{ padding: "11px 12px", fontWeight: 600, color: "var(--ink-900)" }}>{a.name}</td>
                      <td style={{ padding: "11px 12px" }}><span style={{ fontSize: 11.5, fontWeight: 600, color: tc(a.type) }}>{a.type}</span></td>
                      <td style={{ padding: "11px 12px", color: "var(--ink-600)" }}>{a.category}</td>
                      <td style={{ padding: "11px 12px", color: "var(--ink-500)", fontSize: 12.5 }}>{a.desc}</td>
                    </tr>
                  )),
                ] : null
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Posted from completed tasks" subtitle="Done financial tasks with an actual cost, mapped to their GL account & vendor">
        {posted.length === 0 ? (
          <div style={{ color: "var(--ink-400)", fontSize: 14, padding: "12px 0" }}>No posted transactions yet.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead><tr style={{ textAlign: "left" }}>{["GL #", "Account", "Task / memo", "Amount"].map((h, i) => <th key={h} style={{ font: "600 10px var(--font-mono)", letterSpacing: "0.08em", color: "var(--ink-500)", padding: "0 12px 10px", textAlign: i === 3 ? "right" : "left" }}>{h.toUpperCase()}</th>)}</tr></thead>
            <tbody>
              {posted.map((t) => {
                const acct = coa.find((a) => a.num === t.gl) || {};
                return (
                  <tr key={t.id} style={{ borderTop: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "11px 12px", fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--navy-700)" }}>{t.gl}</td>
                    <td style={{ padding: "11px 12px", color: "var(--ink-800)" }}>{acct.name}</td>
                    <td style={{ padding: "11px 12px", color: "var(--ink-700)" }}>{t.name}</td>
                    <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600 }}>{SW2.fmt(t.actual)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}

/* =========================================================== TASK LIBRARY ===== */
function TaskLibrary({ tasks, coa = SW2.coa, onAdd, onClose }) {
  const CAT = window.StartWiseTaskCatalog || { financial: [], nonFinancial: [] };
  const [tab, setTab] = useS2("Financial");
  const [q, setQ] = useS2("");
  const list = (tab === "Financial" ? CAT.financial : CAT.nonFinancial) || [];
  const ql = q.trim().toLowerCase();
  const filtered = list.filter((it) => !ql || it.name.toLowerCase().includes(ql) || (it.category || "").toLowerCase().includes(ql) || (it.sub || "").toLowerCase().includes(ql));
  const byCat = {}; filtered.forEach((it) => { (byCat[it.category] = byCat[it.category] || []).push(it); });
  const have = new Set(tasks.map((t) => (t.name || "").toLowerCase()));
  const added = tasks.filter((t) => t.type === tab).length;

  const build = (it) => {
    const base = { id: "lib" + Date.now() + Math.floor(Math.random() * 999), name: it.name, type: tab, category: it.category, priority: "Medium", week: 1, actual: 0, status: "To Do", due: SW2.due(1), desc: it.desc || "" };
    if (tab === "Financial") {
      base.est = it.est || 0;
      base.gl = (it.role && CAT.resolveGL) ? CAT.resolveGL(coa, it.role) : ((coa[0] && coa[0].num) || "6000");
      if (it.vendors && it.vendors[0]) { base.vendor = it.vendors[0].name; base.vendorWebsite = it.vendors[0].website; }
    } else { base.est = 0; }
    return base;
  };

  const tabBtn = (name, count) => (
    <button onClick={() => setTab(name)} style={{ padding: "9px 16px", border: "none", borderBottom: `2px solid ${tab === name ? "var(--gold-500)" : "transparent"}`, background: "transparent", cursor: "pointer", font: `${tab === name ? 700 : 500} 14px var(--font-sans)`, color: tab === name ? "var(--ink-900)" : "var(--ink-500)" }}>
      {name} <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-400)" }}>{count}</span>
    </button>
  );

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(14,27,44,0.45)", zIndex: 60, display: "grid", placeItems: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 760, height: "88vh", display: "flex", flexDirection: "column", background: "#fff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-card-hover)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, padding: "20px 24px 0" }}>
          <div>
            <h2 style={{ font: "700 19px var(--font-display)", margin: 0, color: "var(--ink-900)" }}>Task library</h2>
            <p style={{ fontSize: 13, color: "var(--ink-500)", margin: "4px 0 0" }}>Browse every financial and non-financial task. Add the ones you need — skip the rest.</p>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-400)" }}><Icon name="x" size={20} /></button>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 24px 0", borderBottom: "1px solid var(--border-default)" }}>
          <div style={{ display: "flex", gap: 4 }}>{tabBtn("Financial", CAT.financial.length)}{tabBtn("Non-Financial", CAT.nonFinancial.length)}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 10px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", background: "#fff", marginBottom: 8 }}>
            <Icon name="search" size={15} color="var(--ink-400)" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks" style={{ border: "none", outline: "none", fontSize: 13, padding: "8px 0", width: 160, background: "transparent" }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {Object.keys(byCat).map((cat) => (
            <div key={cat} style={{ marginBottom: 18 }}>
              <div style={{ font: "600 10px var(--font-mono)", letterSpacing: "0.1em", color: "var(--gold-700)", marginBottom: 8 }}>{cat.toUpperCase()}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {byCat[cat].map((it) => {
                  const inPlan = have.has(it.name.toLowerCase());
                  return (
                    <div key={it.name + it.sub} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", background: inPlan ? "var(--forest-050)" : "var(--cream-50)" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}>{it.name}</div>
                        <div style={{ fontSize: 11.5, color: "var(--ink-500)" }}>{it.sub}{tab === "Financial" && it.est ? " · " + SW2.fmt0(it.est) : ""}{it.vendors && it.vendors.length ? ` · ${it.vendors.length} vendor${it.vendors.length === 1 ? "" : "s"}` : ""}</div>
                      </div>
                      {inPlan ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "var(--forest-700)" }}><Icon name="check" size={14} /> Added</span>
                      ) : (
                        <button onClick={() => onAdd(build(it))} style={{ ...btnOutline, fontSize: 12, padding: "6px 12px" }}><Icon name="plus" size={14} /> Add</button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "var(--ink-400)", fontSize: 14 }}>No tasks match “{q}”.</div>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderTop: "1px solid var(--border-default)" }}>
          <span style={{ fontSize: 12.5, color: "var(--ink-500)" }}>{added} {tab.toLowerCase()} task{added === 1 ? "" : "s"} in your plan · added tasks land in Week 1 — move them anytime in the planner.</span>
          <button onClick={onClose} style={btnPrimary}>Done</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TaskEditor, TaskLibrary, Reports, RunBook, COA });
