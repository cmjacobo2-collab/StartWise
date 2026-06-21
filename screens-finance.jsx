/* StartWise — root app: state, routing, tweaks, cross-screen flows */
const { useState: useApp, useMemo: useAppM, useRef } = React;
const SWa = window.StartWiseData;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#246049",
  "density": "comfortable"
}/*EDITMODE-END*/;

const ACCENTS = ["#246049", "#1B344F", "#C8962E", "#34597A"];

const ROUTE_TITLES = {
  dashboard: "Dashboard", plan: "12-Week Launch Plan", budget: "Budget Planner",
  products: "Products & Services", revenue: "Revenue Planner", cashflow: "Cash Flow Planner",
  reports: "Reports", runbook: "Vendors & RunBook", coa: "Chart of Accounts",
  business: "Business Info", knowledge: "Knowledge Center", legal: "Legal & Compliance",
};

function expenseToTask(e, i) {
  const wk = Math.min(12, Math.max(1, +e.week || 1));
  return { id: "g" + i + "_" + Math.floor(Math.random() * 9999), name: e.name, desc: e.desc || "", type: "Financial", category: e.category || "Equipment & Assets", priority: e.priority || "Medium", est: +e.est || 0, actual: 0, week: wk, due: SWa.due(wk), status: "To Do", gl: String(e.gl || ""), vendorType: e.vendorType || "" };
}

function makeVendor(t) {
  return {
    id: "v" + Date.now() + Math.floor(Math.random() * 999),
    taskName: t.name, vendorName: t.vendor || ("New vendor — " + t.name), category: "Supplier", status: "Pending",
    contact: "", phone: "", email: "",
    website: t.vendorWebsite || "", service: t.name, contractStart: new Date().toISOString().slice(0, 10),
    renewal: "—", lastOrder: new Date().toISOString().slice(0, 10), nextOrder: "—",
    terms: t.vendorType || "", cost: +t.actual || +t.est || 0, rating: 0,
    gl: t.gl, notes: t.vendor ? ("Chosen from your vendor list when this task was completed. Add contact details.") : "Auto-created when this financial task was marked Done. Add the vendor details.",
  };
}

function Tour({ onClose }) {
  const steps = [
    ["Navigate", "Use the left sidebar to move between your dashboard, planner, budget, reports, RunBook, and accounts."],
    ["Dashboard", "Your live launch scorecard — tasks, spend, and budget health update as you work."],
    ["Account setup", "Set your business profile and funding in Business Info. Identity locks after 15 days."],
    ["Budget setup", "Funding sources roll up to your total startup budget and runway."],
    ["12-week planner", "Work week by week. Check off tasks and move them as plans change."],
    ["Reports & resources", "Track budget health and tap the Knowledge Center for AI prompts and the blueprint series."],
  ];
  const [i, setI] = useApp(0);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(14,27,44,0.5)", zIndex: 70, display: "grid", placeItems: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 460, background: "#fff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-card-hover)", padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ font: "600 10px var(--font-mono)", letterSpacing: "0.12em", color: "var(--gold-700)" }}>TOUR · {i + 1} OF {steps.length}</span>
          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-400)" }}><Icon name="x" size={18} /></button>
        </div>
        <h2 style={{ font: "800 23px var(--font-display)", margin: "0 0 8px", color: "var(--ink-900)" }}>{steps[i][0]}</h2>
        <p style={{ fontSize: 14.5, color: "var(--ink-600)", lineHeight: 1.55, margin: "0 0 22px" }}>{steps[i][1]}</p>
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {steps.map((_, k) => <div key={k} style={{ flex: 1, height: 4, borderRadius: 999, background: k <= i ? "var(--forest-600)" : "var(--cream-100)" }}></div>)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => (i === 0 ? onClose() : setI(i - 1))} style={btnGhost}>{i === 0 ? "Skip" : "Back"}</button>
          <button onClick={() => (i === steps.length - 1 ? onClose() : setI(i + 1))} style={btnPrimary}>{i === steps.length - 1 ? "Done" : "Next"} <Icon name="arrowRight" size={15} /></button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [phase, setPhase] = useApp("login"); // login | onboarding | app
  const [route, setRoute] = useApp("dashboard");
  const [tasks, setTasks] = useApp(SWa.tasks);
  const [coa, setCoa] = useApp((window.StartWiseSource && window.StartWiseSource.coaMaster) || SWa.coa);
  const [vendors, setVendors] = useApp(SWa.vendors);
  const [products, setProducts] = useApp((window.StartWiseBiz && window.StartWiseBiz.products) || []);
  const [editingProduct, setEditingProduct] = useApp(null);
  const [business, setBusiness] = useApp(SWa.business);
  const [funding, setFunding] = useApp(SWa.funding);
  const [user, setUser] = useApp({ name: "Dana Rivera", role: "Admin" });
  const [editing, setEditing] = useApp(null);
  const [library, setLibrary] = useApp(false);
  const [tour, setTour] = useApp(false);

  const totalBudget = useAppM(() => funding.filter((f) => f.on).reduce((s, f) => s + (+f.amount || 0), 0), [funding]);
  const actualSpend = useAppM(() => tasks.filter((x) => x.type === "Financial").reduce((s, x) => s + (+x.actual || 0), 0), [tasks]);
  const startingBalance = Math.max(0, totalBudget - actualSpend);

  const saveProduct = (p) => { setProducts((prev) => (prev.some((x) => x.id === p.id) ? prev.map((x) => (x.id === p.id ? p : x)) : [...prev, p])); setEditingProduct(null); };
  const deleteProduct = (id) => { setProducts((prev) => prev.filter((x) => x.id !== id)); setEditingProduct(null); };

  const joined = new Date(business.dateJoined);
  const daysLeft = Math.max(0, 15 - Math.floor((Date.now() - joined.getTime()) / 86400000));
  const setupAt = new Date(business.setupAt || business.dateJoined);
  const hoursLeft = Math.max(0, 48 - (Date.now() - setupAt.getTime()) / 3600000);

  // rebuild COA + expenses for a (new) business type within the 48-hour window
  const rebuildPlan = (plan, patch) => {
    setCoa(plan.coa);
    setTasks((prev) => {
      const nonFin = prev.filter((x) => x.type === "Non-Financial");
      const fin = plan.expenses.map(expenseToTask);
      return [...fin, ...nonFin];
    });
    setVendors([]);
    if (patch) setBusiness((b) => ({ ...b, ...patch }));
  };

  // cross-screen: completing a financial task spins up a RunBook vendor record
  const applyTasks = (next) => {
    setTasks((prev) => {
      const arr = typeof next === "function" ? next(prev) : next;
      const toAdd = [];
      arr.forEach((x) => {
        const was = prev.find((p) => p.id === x.id);
        if (x.type === "Financial" && x.status === "Completed" && (!was || was.status !== "Completed")) {
          setVendors((vs) => (vs.some((v) => v.taskName === x.name) ? vs : [...vs, makeVendor(x)]));
        }
      });
      return arr;
    });
  };

  const saveTask = (task) => {
    if (task.id) applyTasks(tasks.map((x) => (x.id === task.id ? task : x)));
    else applyTasks([...tasks, { ...task, id: "t" + Date.now() }]);
    setEditing(null);
  };
  const deleteTask = (id) => { applyTasks(tasks.filter((x) => x.id !== id)); setEditing(null); };

  const exportCSV = () => {
    const rows = [["Task", "Type", "Category", "Priority", "Status", "Week", "Estimated", "Actual", "GL", "Due"]];
    tasks.forEach((x) => rows.push([x.name, x.type, x.category, x.priority, x.status, x.week, x.est, x.actual, x.gl || "", x.due]));
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "startwise-tasks.csv";
    a.click();
  };

  if (phase === "login") return <><Login onLogin={() => setPhase("app")} onStart={() => setPhase("onboarding")} /><AppTweaks t={t} setTweak={setTweak} /></>;
  if (phase === "onboarding")
    return <><Onboarding onCancel={() => setPhase("login")} onDone={(data) => {
      setBusiness({ ...business, businessName: data.biz.businessName, fullName: data.biz.fullName, industry: data.biz.industry, businessType: data.biz.businessType, stage: data.biz.stage, launchDate: data.biz.launchDate, smsReminders: data.sms, dateJoined: new Date().toISOString().slice(0, 10), setupAt: new Date().toISOString() });
      setFunding(SWa.funding.map((f) => { const m = data.funds.find((d) => d.source === f.source); return m ? { ...f, on: m.on, amount: +m.amount || 0 } : f; }));
      setUser({ name: data.biz.fullName || "Dana Rivera", role: "Admin" });
      if (data.plan) {
        setCoa(data.plan.coa);
        const finTasks = data.plan.expenses.map(expenseToTask);
        const stageT = (SWa.stageTasks[data.biz.stage] || SWa.stageTasks["Pre-Revenue"]).map((x, i) => ({ id: "n" + i, name: x.name, desc: x.desc, type: "Non-Financial", category: x.category, priority: x.priority, est: 0, actual: 0, week: x.week, due: SWa.due(x.week), status: "To Do" }));
        setTasks([...finTasks, ...stageT]);
        setVendors([]);
      }
      setPhase("app"); setRoute("dashboard");
    }} /><AppTweaks t={t} setTweak={setTweak} /></>;

  let screen = null;
  if (route === "dashboard") screen = <Dashboard tasks={tasks} totalBudget={totalBudget} affirmation={SWa.affirmationOfDay()} smsOn={business.smsReminders} products={products} startingBalance={startingBalance} />;
  else if (route === "plan") screen = <Plan tasks={tasks} setTasks={applyTasks} openEdit={setEditing} />;
  else if (route === "budget") screen = <Budget tasks={tasks} setTasks={applyTasks} openEdit={setEditing} role={user.role} />;
  else if (route === "products") screen = <Products products={products} setProducts={setProducts} openEdit={setEditingProduct} role={user.role} />;
  else if (route === "revenue") screen = <Revenue products={products} startingBalance={startingBalance} />;
  else if (route === "cashflow") screen = <CashFlow products={products} startingBalance={startingBalance} />;
  else if (route === "reports") screen = <Reports tasks={tasks} />;
  else if (route === "runbook") screen = <RunBook vendors={vendors} setVendors={setVendors} products={products} />;
  else if (route === "coa") screen = <COA tasks={tasks} coa={coa} business={business} />;
  else if (route === "business") screen = <BusinessInfo business={business} setBusiness={setBusiness} funding={funding} setFunding={setFunding} totalBudget={totalBudget} actualSpend={actualSpend} hoursLeft={hoursLeft} coa={coa} onRebuild={rebuildPlan} />;
  else if (route === "knowledge") screen = <Knowledge onTour={() => setTour(true)} />;
  else if (route === "legal") screen = <Legal business={business} setBusiness={setBusiness} />;

  return (
    <div data-density={t.density} style={{ display: "flex", minHeight: "100vh", background: "var(--cream-50)" }}>
      <Sidebar route={route} setRoute={setRoute} accent={t.accent} business={business} edition={business.businessType} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <TopBar title={ROUTE_TITLES[route]} user={user} onAddTask={() => setEditing({})} onLibrary={() => setLibrary(true)} onExport={exportCSV} onSignOut={() => setPhase("login")} />
        <main style={{ flex: 1, padding: "26px 28px 48px", maxWidth: 1320, width: "100%", margin: "0 auto" }}>{screen}</main>
      </div>
      {editing && <TaskEditor task={editing} coa={coa} onSave={saveTask} onClose={() => setEditing(null)} onDelete={editing.id && user.role === "Admin" ? deleteTask : null} />}
      {library && <TaskLibrary tasks={tasks} coa={coa} onAdd={(task) => applyTasks((prev) => [...prev, task])} onClose={() => setLibrary(false)} />}
      {editingProduct && <ProductEditor product={editingProduct} onSave={saveProduct} onClose={() => setEditingProduct(null)} onDelete={editingProduct.id && user.role === "Admin" ? deleteProduct : null} />}
      {tour && <Tour onClose={() => setTour(false)} />}
      <AppTweaks t={t} setTweak={setTweak} user={user} setUser={setUser} />
    </div>
  );
}

function AppTweaks({ t, setTweak, user, setUser }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme" />
      <TweakColor label="Sidebar accent" value={t.accent} options={ACCENTS} onChange={(v) => setTweak("accent", v)} />
      <TweakSection label="Layout" />
      <TweakRadio label="Table density" value={t.density} options={["compact", "comfortable"]} onChange={(v) => setTweak("density", v)} />
      {user && (
        <>
          <TweakSection label="Demo" />
          <TweakRadio label="Acting as" value={user.role} options={["Admin", "Member"]} onChange={(v) => setUser({ ...user, role: v, name: v === "Admin" ? "Dana Rivera" : "Sam Chen" })} />
        </>
      )}
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
