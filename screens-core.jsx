/* StartWise — core screens: Dashboard, 12-Week Plan, Budget Planner */
const { useState: useS, useMemo: useM } = React;
const SW = window.StartWiseData;
const DScore = window.AcrossTheTableDesignSystem_520822;

/* ---------- shared KPI card ---------- */
function Kpi({ label, value, accent, sub, tone }) {
  const col = tone === "good" ? "var(--forest-600)" : tone === "warn" ? "var(--gold-700)" : "var(--ink-900)";
  return (
    <div style={{ background: "#fff", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", padding: "16px 18px" }}>
      <div style={{ font: "600 9.5px var(--font-mono)", letterSpacing: "0.1em", color: "var(--ink-500)" }}>{label.toUpperCase()}</div>
      <div style={{ font: "800 27px var(--font-display)", color: col, marginTop: 8, letterSpacing: "-0.02em" }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: "var(--ink-400)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

/* =========================================================== DASHBOARD */
function Dashboard({ tasks, totalBudget, affirmation, smsOn, products = [], startingBalance = 0 }) {
  const m = useM(() => {
    const fin = tasks.filter((t) => t.type === "Financial");
    const done = tasks.filter((t) => t.status === "Completed").length;
    const prog = tasks.filter((t) => t.status === "In Progress").length;
    const todo = tasks.filter((t) => t.status === "To Do").length;
    const est = fin.reduce((s, t) => s + (+t.est || 0), 0);
    const act = fin.reduce((s, t) => s + (+t.actual || 0), 0);
    const byCat = {};
    fin.forEach((t) => { byCat[t.category] = (byCat[t.category] || 0) + (+t.est || 0); });
    const cats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
    const phases = [[1, 3], [4, 6], [7, 9], [10, 12]];
    const timeline = phases.map(([a, b], i) => ({
      label: `Wk ${a}\u2013${b}`,
      bars: [
        { value: fin.filter((t) => t.week >= a && t.week <= b).reduce((s, t) => s + (+t.est || 0), 0), color: "var(--navy-600)" },
        { value: fin.filter((t) => t.week >= a && t.week <= b).reduce((s, t) => s + (+t.actual || 0), 0), color: "var(--gold-500)" },
      ],
    }));
    const prio = ["High", "Medium", "Low"].map((p, i) => ({
      label: p,
      bars: [{ value: fin.filter((t) => t.priority === p).reduce((s, t) => s + (+t.est || 0), 0), color: ["var(--red-600)", "var(--gold-500)", "var(--forest-500)"][i] }],
    }));
    return { fin, done, prog, todo, est, act, cats, timeline, prio };
  }, [tasks]);

  const remaining = totalBudget - m.act;
  const pctUsed = totalBudget ? Math.round((m.act / totalBudget) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Callout icon="flag" title="You're 2 weeks into your launch.">
        Keep marking tasks done — every completed financial task posts its actual cost here and into your Chart of Accounts automatically.
      </Callout>

      {products.length > 0 && <HealthScore products={products} startingBalance={startingBalance} compact />}

      {affirmation && affirmation.text && (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "var(--navy-900)", borderRadius: "var(--radius-lg)", padding: "18px 22px", color: "#fff" }}>
          <Icon name="sparkle" size={20} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <div style={{ font: "600 9.5px var(--font-mono)", letterSpacing: "0.12em", color: "var(--gold-400)" }}>TODAY'S AFFIRMATION · {(affirmation.title || "").toUpperCase()}</div>
            <div style={{ font: "600 17px var(--font-display)", marginTop: 6, lineHeight: 1.4 }}>{affirmation.text}</div>
            {smsOn && <div style={{ fontSize: 12, color: "var(--text-on-dark-muted)", marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}><Icon name="bell" size={13} /> Sent to your phone with today's daily SMS reminder</div>}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <Kpi label="Total tasks" value={tasks.length} />
        <Kpi label="Completed" value={m.done} tone="good" sub={`${m.prog} in progress · ${m.todo} to do`} />
        <Kpi label="Estimated spend" value={SW.fmt0(m.est)} />
        <Kpi label="Actual spend" value={SW.fmt0(m.act)} tone="warn" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        <Kpi label="Total budget" value={SW.fmt0(totalBudget)} />
        <Kpi label="Remaining budget" value={SW.fmt0(remaining)} tone="good" />
        <Kpi label="% budget used" value={pctUsed + "%"} sub={`${SW.fmt0(m.act)} of ${SW.fmt0(totalBudget)}`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Panel title="Budget allocation" subtitle="Estimated spend by category">
          <Donut data={m.cats.map(([label, value], i) => ({ label, short: label.split(" ")[0], value, display: SW.fmt0(value), color: SW.catColors[label] || SW.palette[i % SW.palette.length] }))} centerTop={SW.fmt0(m.est)} centerBottom="Est. spend" />
        </Panel>
        <Panel title="Spend timeline" subtitle="Planned vs actual by phase">
          <BarChart groups={m.timeline} legend={[{ label: "Planned", color: "var(--navy-600)" }, { label: "Actual", color: "var(--gold-500)" }]} />
        </Panel>
        <Panel title="Spending by priority" subtitle="Estimated cost grouped by priority">
          <BarChart groups={m.prio} />
        </Panel>
        <Panel title="Task completion" subtitle="Status breakdown across all tasks">
          <Donut
            data={[
              { label: "Completed", value: m.done, color: "var(--forest-600)" },
              { label: "In progress", value: m.prog, color: "var(--navy-500)" },
              { label: "To do", value: m.todo, color: "var(--ink-200)" },
            ]}
            centerTop={`${Math.round((m.done / tasks.length) * 100)}%`}
            centerBottom="Complete"
          />
        </Panel>
      </div>
    </div>
  );
}

/* =========================================================== 12-WEEK PLAN */
function Plan({ tasks, setTasks, openEdit }) {
  const [open, setOpen] = useS(() => new Set([1, 2]));
  const toggle = (w) => { const n = new Set(open); n.has(w) ? n.delete(w) : n.add(w); setOpen(n); };

  const done = tasks.filter((t) => t.status === "Completed").length;
  const prog = tasks.filter((t) => t.status === "In Progress").length;
  const todo = tasks.filter((t) => t.status === "To Do").length;
  const pct = Math.round((done / tasks.length) * 100);

  const cycle = (t) => {
    const order = ["To Do", "In Progress", "Completed"];
    const next = order[(order.indexOf(t.status) + 1) % 3];
    setTasks(tasks.map((x) => (x.id === t.id ? { ...x, status: next } : x)));
  };
  const moveWeek = (t, w) => setTasks(tasks.map((x) => (x.id === t.id ? { ...x, week: +w, due: SW.due(+w) } : x)));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <Panel pad={22}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ font: "600 10px var(--font-mono)", letterSpacing: "0.12em", color: "var(--ink-500)" }}>OVERALL LAUNCH PROGRESS</div>
            <div style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 4 }}>Your complete 12-week roadmap, backward from {SW.business.launchDate}. Click a week to expand.</div>
          </div>
          <div style={{ font: "800 34px var(--font-display)", color: "var(--forest-600)" }}>{pct}%</div>
        </div>
        <ProgressBar value={pct} height={10} />
        <div style={{ display: "flex", gap: 28, marginTop: 16 }}>
          {[["Completed", done, "var(--forest-600)"], ["In progress", prog, "var(--navy-500)"], ["To do", todo, "var(--ink-500)"], ["Total tasks", tasks.length, "var(--ink-900)"]].map(([l, v, c]) => (
            <div key={l}>
              <div style={{ font: "800 22px var(--font-display)", color: c }}>{v}</div>
              <div style={{ font: "600 9.5px var(--font-mono)", letterSpacing: "0.1em", color: "var(--ink-500)" }}>{l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </Panel>

      {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => {
        const wt = tasks.filter((t) => t.week === w);
        const wd = wt.filter((t) => t.status === "Completed").length;
        const isOpen = open.has(w);
        return (
          <div key={w} style={{ background: "#fff", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
            <button onClick={() => toggle(w)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "16px 22px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: wd === wt.length && wt.length ? "var(--forest-050)" : "var(--cream-100)", display: "grid", placeItems: "center", font: "800 14px var(--font-display)", color: wd === wt.length && wt.length ? "var(--forest-600)" : "var(--navy-700)", flexShrink: 0 }}>{w}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ font: "600 10px var(--font-mono)", letterSpacing: "0.1em", color: "var(--gold-700)" }}>WEEK {w}</span>
                  <span style={{ font: "700 15.5px var(--font-display)", color: "var(--ink-900)" }}>{SW.weekThemes[w]}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginTop: 2 }}>{wt.length ? `${wd}/${wt.length} done` : "No tasks scheduled"}</div>
              </div>
              <div style={{ width: 90 }}><ProgressBar value={wt.length ? (wd / wt.length) * 100 : 0} /></div>
              <Icon name="chevron" size={18} color="var(--ink-400)" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
            </button>
            {isOpen && (
              <div style={{ padding: "0 22px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
                {wt.length === 0 && <div style={{ fontSize: 13, color: "var(--ink-400)", padding: "8px 0" }}>Nothing here yet — add a task to this week.</div>}
                {wt.map((t) => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: "var(--cream-50)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
                    <button onClick={() => cycle(t)} title="Toggle status" style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${t.status === "Completed" ? "var(--forest-600)" : t.status === "In Progress" ? "var(--navy-500)" : "var(--ink-300)"}`, background: t.status === "Completed" ? "var(--forest-600)" : "transparent", cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 }}>
                      {t.status === "Completed" && <Icon name="check" size={13} color="#fff" />}
                      {t.status === "In Progress" && <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--navy-500)" }}></span>}
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)", textDecoration: t.status === "Completed" ? "line-through" : "none", textDecorationColor: "var(--ink-300)" }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-500)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.desc}</div>
                    </div>
                    <TypeTag type={t.type} />
                    <PriorityPill p={t.priority} />
                    {t.type === "Financial" && <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--ink-600)", minWidth: 64, textAlign: "right" }}>{SW.fmt0(t.est)}</span>}
                    <select value={t.week} onChange={(e) => moveWeek(t, e.target.value)} title="Move to week" style={{ fontSize: 12, padding: "4px 6px", border: "1px solid var(--border-default)", borderRadius: 6, background: "#fff", color: "var(--ink-600)" }}>
                      {Array.from({ length: 12 }, (_, k) => k + 1).map((k) => <option key={k} value={k}>Wk {k}</option>)}
                    </select>
                    <button onClick={() => openEdit(t)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-400)", padding: 4 }}><Icon name="pencil" size={15} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================== BUDGET PLANNER */
function Budget({ tasks, setTasks, openEdit, role }) {
  const [cat, setCat] = useS("All");
  const [stat, setStat] = useS("All");
  const [q, setQ] = useS("");
  const fin = tasks.filter((t) => t.type === "Financial");
  const cats = ["All", ...Array.from(new Set(fin.map((t) => t.category)))];
  const rows = fin.filter((t) => (cat === "All" || t.category === cat) && (stat === "All" || t.status === stat) && t.name.toLowerCase().includes(q.toLowerCase()));
  const totEst = rows.reduce((s, t) => s + (+t.est || 0), 0);
  const totAct = rows.reduce((s, t) => s + (+t.actual || 0), 0);
  const del = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const sel = { padding: "8px 12px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", fontSize: 13, background: "#fff", color: "var(--ink-700)" };

  return (
    <Panel
      title="All expenses"
      subtitle={`${rows.length} financial tasks linked to your Chart of Accounts`}
      right={
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 10px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", background: "#fff" }}>
            <Icon name="search" size={15} color="var(--ink-400)" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search expenses" style={{ border: "none", outline: "none", fontSize: 13, padding: "8px 0", width: 130, background: "transparent" }} />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} style={sel}>{cats.map((c) => <option key={c}>{c === "All" ? "All categories" : c}</option>)}</select>
          <select value={stat} onChange={(e) => setStat(e.target.value)} style={sel}>{["All", ...SW.STATUSES].map((s) => <option key={s}>{s === "All" ? "All statuses" : s}</option>)}</select>
        </div>
      }
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              {["Expense", "Category", "Priority", "Status", "Est. cost", "Actual", "Difference", "Due", ""].map((h, i) => (
                <th key={h + i} style={{ font: "600 10px var(--font-mono)", letterSpacing: "0.08em", color: "var(--ink-500)", padding: "0 12px 10px", textAlign: i >= 4 && i <= 6 ? "right" : "left", whiteSpace: "nowrap" }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => {
              const diff = (+t.actual || 0) - (+t.est || 0);
              return (
                <tr key={t.id} style={{ borderTop: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "13px 12px" }}>
                    <div style={{ fontWeight: 600, color: "var(--ink-900)" }}>{t.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-400)", fontFamily: "var(--font-mono)" }}>GL {t.gl} · Wk {t.week}</div>
                  </td>
                  <td style={{ padding: "13px 12px", color: "var(--ink-600)" }}>{t.category}</td>
                  <td style={{ padding: "13px 12px" }}><PriorityPill p={t.priority} /></td>
                  <td style={{ padding: "13px 12px" }}><StatusPill status={t.status} followUp={t.followUp} /></td>
                  <td style={{ padding: "13px 12px", textAlign: "right", fontFamily: "var(--font-mono)" }}>{SW.fmt(t.est)}</td>
                  <td style={{ padding: "13px 12px", textAlign: "right", fontFamily: "var(--font-mono)", color: t.actual ? "var(--ink-900)" : "var(--ink-300)" }}>{SW.fmt(t.actual)}</td>
                  <td style={{ padding: "13px 12px", textAlign: "right", fontFamily: "var(--font-mono)", color: diff > 0 ? "var(--red-600)" : diff < 0 ? "var(--forest-600)" : "var(--ink-300)" }}>{t.actual ? (diff > 0 ? "+" : "") + SW.fmt(diff) : "—"}</td>
                  <td style={{ padding: "13px 12px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-500)", whiteSpace: "nowrap" }}>{t.due || "—"}</td>
                  <td style={{ padding: "13px 12px" }}>
                    <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                      <button onClick={() => openEdit(t)} title="Edit" style={iconBtn}><Icon name="pencil" size={15} /></button>
                      {role === "Admin" && <button onClick={() => del(t.id)} title="Delete" style={{ ...iconBtn, color: "var(--red-600)" }}><Icon name="trash" size={15} /></button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: "2px solid var(--border-strong)" }}>
              <td colSpan={4} style={{ padding: "14px 12px", fontWeight: 700, color: "var(--ink-900)" }}>Total (financial tasks)</td>
              <td style={{ padding: "14px 12px", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{SW.fmt(totEst)}</td>
              <td style={{ padding: "14px 12px", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{SW.fmt(totAct)}</td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>
      {role !== "Admin" && <div style={{ marginTop: 14 }}><Callout icon="lock">As a team member you can add and edit expenses, but only the admin can delete them.</Callout></div>}
    </Panel>
  );
}

const iconBtn = { display: "grid", placeItems: "center", width: 30, height: 30, border: "1px solid var(--border-default)", borderRadius: 8, background: "#fff", cursor: "pointer", color: "var(--ink-600)" };

Object.assign(window, { Dashboard, Plan, Budget, Kpi });
