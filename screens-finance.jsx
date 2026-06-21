/* StartWise — Business Info + Knowledge Center + Legal */
const { useState: useS3 } = React;
const SW3 = window.StartWiseData;
const DSx = window.AcrossTheTableDesignSystem_520822;

/* =========================================================== LEGAL DOCS ===== */
const LEGAL_DOCS = [
  {
    id: "terms", title: "Terms of Service", icon: "file", updated: "June 1, 2026",
    intro: "These terms govern your use of StartWise, a product of Across the Table Small Business Consulting. By creating an account you agree to them.",
    sections: [
      ["1. Acceptance of these terms", "By accessing or using StartWise you agree to these Terms of Service. If you do not agree, do not use the service."],
      ["2. Your account & one-business license", "Each StartWise account is tied to one business — your owner name, business name, industry, and business type. After 48 hours your business type and Chart of Accounts lock to your license. Running a second business requires a separate license."],
      ["3. Acceptable use", "You agree to use StartWise only for lawful purposes and not to misuse, copy, resell, or reverse-engineer the service. You are responsible for activity under your account and for keeping your access code secure."],
      ["4. Your content & data", "You own the data you enter — tasks, budgets, vendors, and notes. You grant us a limited license to store and process it to provide the service. You may export your data at any time."],
      ["5. AI features", "StartWise connects to your own AI account to generate your Chart of Accounts, expenses, and prompts. We do not pay for or resell AI usage; your prompts and history are governed by your AI provider's terms."],
      ["6. No financial or legal advice", "StartWise is a planning tool, not a substitute for a licensed accountant, attorney, or financial advisor. Verify filings, taxes, and legal decisions with a qualified professional."],
      ["7. Limitation of liability", "StartWise is provided \u201Cas is.\u201D To the fullest extent permitted by law, Across the Table is not liable for indirect or consequential damages arising from your use of the service."],
      ["8. Changes & contact", "We may update these terms and will note the effective date above. Questions? Email info@acrossthetable.biz."],
    ],
  },
  {
    id: "privacy", title: "Privacy Policy", icon: "shield", updated: "June 1, 2026",
    intro: "This policy explains what we collect, how we use it, and the choices you have. We keep it plain — no surprises.",
    sections: [
      ["1. What we collect", "Account details (name, business name, email, phone), the business data you enter, and basic usage information needed to run the app."],
      ["2. How we use it", "To provide your 12-week plan, dashboard, budgets, reports, and reminders — and to support you. We do not sell your personal information."],
      ["3. AI & third parties", "When you use AI features, your prompts are sent to your own connected AI provider. Their handling of that data is governed by their policy, not ours."],
      ["4. SMS reminders", "If you opt in, we send daily SMS reminders with an affirmation. Standard message rates may apply. You can turn reminders off anytime in Business Info."],
      ["5. Security", "We use reasonable safeguards to protect your data. No system is perfectly secure, so keep your access code private."],
      ["6. Your rights", "You can view, edit, export, or request deletion of your data. Email info@acrossthetable.biz to make a request."],
      ["7. Retention", "We retain your data while your account is active and for a reasonable period afterward, unless you ask us to delete it sooner."],
    ],
  },
  {
    id: "license", title: "Software License Agreement", icon: "scale", updated: "June 1, 2026",
    intro: "This agreement covers your right to use the StartWise software for a single business.",
    sections: [
      ["1. Grant of license", "Across the Table grants you a limited, non-exclusive, non-transferable license to use StartWise for one business associated with your account."],
      ["2. Restrictions", "You may not sublicense, resell, share access codes, or use one license across multiple businesses. Additional businesses require additional licenses."],
      ["3. Ownership", "StartWise, its content libraries (templates, prompts, blueprint series), and its design remain the property of Across the Table."],
      ["4. Term & termination", "This license lasts while your subscription is active. We may suspend or terminate it for breach of these terms; you may cancel at any time."],
      ["5. Updates", "We may release updates and improvements. Continued use after an update means you accept the updated software."],
      ["6. Warranty disclaimer", "The software is provided \u201Cas is\u201D without warranties of any kind, express or implied, including fitness for a particular purpose."],
      ["7. Governing law & contact", "This agreement is governed by the laws of the State of Arizona. Questions? Email info@acrossthetable.biz."],
    ],
  },
];
window.LEGAL_DOCS = LEGAL_DOCS;

function LegalModal({ doc, onClose }) {
  return (
    <div onClick={onClose} style={modalOverlay}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...modalCard, maxWidth: 680 }}>
        <div style={modalHead}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--navy-050)", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name={doc.icon} size={19} color="var(--navy-700)" /></div>
            <div>
              <h2 style={{ font: "700 18px var(--font-display)", margin: 0, color: "var(--ink-900)" }}>{doc.title}</h2>
              <div style={{ fontSize: 11.5, color: "var(--ink-400)" }}>Last updated {doc.updated}</div>
            </div>
          </div>
          <button onClick={onClose} style={iconX}><Icon name="x" size={20} /></button>
        </div>
        <div style={{ padding: 24 }}>
          <p style={{ fontSize: 13.5, color: "var(--ink-600)", margin: "0 0 18px", lineHeight: 1.6 }}>{doc.intro}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {doc.sections.map(([h, body]) => (
              <div key={h}>
                <div style={{ font: "700 13.5px var(--font-display)", color: "var(--ink-900)", marginBottom: 4 }}>{h}</div>
                <div style={{ fontSize: 13, color: "var(--ink-600)", lineHeight: 1.6 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={modalFoot}>
          <span style={{ fontSize: 12, color: "var(--ink-400)" }}>Across the Table · acrossthetable.biz</span>
          <button onClick={onClose} style={btnPrimary}>Close</button>
        </div>
      </div>
    </div>
  );
}

function Legal({ business, setBusiness }) {
  const [doc, setDoc] = useS3(null);
  const accepted = !!business.termsAccepted;
  const when = business.termsAcceptedAt ? new Date(business.termsAcceptedAt) : null;
  const accept = () => setBusiness({ ...business, termsAccepted: true, termsAcceptedAt: new Date().toISOString() });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Callout icon="shield" title="Your legal documents, always one click away">
        Review the Terms of Service, Privacy Policy, and Software License Agreement anytime. Your acceptance is recorded with a date and time stamp below.
      </Callout>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {LEGAL_DOCS.map((d) => (
          <button key={d.id} onClick={() => setDoc(d)} style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 12, padding: 20, background: "#fff", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", cursor: "pointer" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--navy-050)", display: "grid", placeItems: "center" }}><Icon name={d.icon} size={22} color="var(--navy-700)" /></div>
            <div>
              <div style={{ font: "700 16px var(--font-display)", color: "var(--ink-900)" }}>{d.title}</div>
              <div style={{ fontSize: 12, color: "var(--ink-400)", marginTop: 2 }}>Updated {d.updated} · {d.sections.length} sections</div>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--navy-600)", fontWeight: 600 }}>Read document <Icon name="arrowRight" size={14} /></span>
          </button>
        ))}
      </div>

      <Panel title="Acceptance record" subtitle="Your agreement to the documents above is stored here">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 999, background: accepted ? "var(--forest-050)" : "var(--gold-050)", display: "grid", placeItems: "center" }}><Icon name={accepted ? "check" : "bell"} size={20} color={accepted ? "var(--forest-600)" : "var(--gold-700)"} /></div>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink-900)" }}>{accepted ? "Documents accepted" : "Acceptance pending"}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-500)" }}>{accepted && when ? `Accepted on ${when.toLocaleDateString()} at ${when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Review and accept to record your agreement."}</div>
            </div>
          </div>
          <button onClick={accept} style={accepted ? btnGhost : btnPrimary}><Icon name="check" size={16} /> {accepted ? "Re-accept current versions" : "Accept all documents"}</button>
        </div>
      </Panel>

      {doc && <LegalModal doc={doc} onClose={() => setDoc(null)} />}
    </div>
  );
}

/* =========================================================== BUSINESS INFO ===== */
function BusinessInfo({ business, setBusiness, funding, setFunding, totalBudget, actualSpend, hoursLeft, coa, onRebuild }) {
  const { Input, Select, Switch } = DSx;
  const [invite, setInvite] = useS3("");
  const [rebuild, setRebuild] = useS3(false);
  const typeLocked = hoursLeft <= 0;
  const hrs = Math.floor(hoursLeft);
  const set = (patch) => setBusiness({ ...business, ...patch });
  const setF = (i, patch) => setFunding(funding.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  const total = funding.filter((f) => f.on).reduce((s, f) => s + (+f.amount || 0), 0);
  const remaining = total - actualSpend;
  const pct = total ? Math.round((actualSpend / total) * 100) : 0;
  const monthly = 4200;
  const runway = monthly ? Math.floor(remaining / monthly) : 0;

  const LockLabel = ({ children, on }) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{children}{on && <Icon name="lock" size={12} color="var(--ink-400)" />}</span>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Panel title="Business profile" right={!typeLocked ? <button onClick={() => setRebuild(true)} style={{ ...btnOutline, fontSize: 12.5 }}><Icon name="sparkle" size={14} /> Change type & rebuild COA</button> : null}>
          {!typeLocked ? (
            <div style={{ marginBottom: 16 }}><Callout icon="lock" title={`Business type & Chart of Accounts editable for ${hrs} more hour${hrs === 1 ? "" : "s"}`}>You can still switch your business type and rebuild your Chart of Accounts. After 48 hours these lock to your license so one license can't be reused across businesses. Funding and launch date stay editable anytime.</Callout></div>
          ) : (
            <div style={{ marginBottom: 16 }}><Callout icon="lock" title="Business type & Chart of Accounts are locked">Your 48-hour window has closed. Business name, funding, and launch date stay editable — but your business type and COA are locked to your license.</Callout></div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Input label="Owner name" value={business.fullName} onChange={(e) => set({ fullName: e.target.value })} />
              <Input label="Business name" value={business.businessName} onChange={(e) => set({ businessName: e.target.value })} />
              <div style={fieldWrap}><label style={fieldLab}><LockLabel on={typeLocked}>Industry</LockLabel></label><select disabled={typeLocked} value={business.industry} onChange={(e) => set({ industry: e.target.value, businessType: (SW3.industries[e.target.value] || [""])[0] })} style={inp(typeLocked)}>{Object.keys(SW3.industries).map((x) => <option key={x}>{x}</option>)}</select></div>
              <div style={fieldWrap}><label style={fieldLab}><LockLabel on={typeLocked}>Business type</LockLabel></label><select disabled={typeLocked} value={business.businessType} onChange={(e) => set({ businessType: e.target.value })} style={inp(typeLocked)}>{(SW3.industries[business.industry] || [business.businessType]).map((x) => <option key={x}>{x}</option>)}</select></div>
              <Input label="Email" value={business.email} onChange={(e) => set({ email: e.target.value })} />
              <Input label="Phone" value={business.phone} onChange={(e) => set({ phone: e.target.value })} />
              <Input label="Target launch date" type="date" value={business.launchDate} onChange={(e) => set({ launchDate: e.target.value })} hint="Editable anytime — your plan counts down from here." />
              <div style={{ paddingTop: 22 }}><Switch label="SMS weekly reminders" checked={business.smsReminders} onChange={(e) => set({ smsReminders: e.target.checked })} /></div>
            </div>
          </div>
        </Panel>
        {rebuild && <RebuildModal business={business} coa={coa} onClose={() => setRebuild(false)} onApply={(plan, patch) => { onRebuild(plan, patch); setRebuild(false); }} />}

        <Panel title="Your account">
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[["Account number", business.accountNumber], ["Email", business.email], ["Role", "Admin"], ["Member since", new Date(business.dateJoined).toLocaleDateString()], ["Subscription", business.membership], ["License", "1 business · 1 industry"]].map(([k, v], i) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderTop: i ? "1px solid var(--border-subtle)" : "none" }}>
                <span style={{ fontSize: 13, color: "var(--ink-500)" }}>{k}</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)", fontFamily: k === "Account number" ? "var(--font-mono)" : "inherit" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18, padding: 16, background: "var(--cream-50)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)" }}>
            <div style={{ font: "600 9.5px var(--font-mono)", letterSpacing: "0.1em", color: "var(--ink-500)", marginBottom: 10 }}>INVITE A TEAM MEMBER (ADMIN ONLY)</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={invite} onChange={(e) => setInvite(e.target.value)} placeholder="teammate@email.com" style={{ flex: 1, padding: "9px 12px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", fontSize: 13.5 }} />
              <button style={btnPrimary}><Icon name="plus" size={15} /> Send invite</button>
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-400)", marginTop: 8 }}>Team members can view, edit tasks, and add notes — but can't delete tasks or change the subscription.</div>
          </div>
        </Panel>
      </div>

      <Panel title="Funding & budget" subtitle="Check every source you're using and set an amount">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {funding.map((f, i) => (
            <label key={f.source} style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 12px", border: `1px solid ${f.on ? "var(--forest-500)" : "var(--border-default)"}`, background: f.on ? "var(--forest-050)" : "#fff", borderRadius: "var(--radius-md)", cursor: "pointer", transition: "all .13s" }}>
              <input type="checkbox" checked={f.on} onChange={(e) => setF(i, { on: e.target.checked })} style={{ accentColor: "var(--forest-600)", width: 15, height: 15 }} />
              <span style={{ flex: 1, fontSize: 12.5, color: "var(--ink-800)", fontWeight: 500 }}>{f.source}</span>
              {f.on && <span style={{ display: "flex", alignItems: "center", gap: 2 }}><span style={{ color: "var(--ink-400)", fontSize: 12 }}>$</span><input type="number" value={f.amount} onChange={(e) => setF(i, { amount: e.target.value })} style={{ width: 66, padding: "4px 6px", border: "1px solid var(--border-default)", borderRadius: 6, fontSize: 12.5, fontFamily: "var(--font-mono)" }} /></span>}
            </label>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", background: "var(--forest-050)", border: "1px solid var(--forest-100)", borderRadius: "var(--radius-md)", marginTop: 14 }}>
          <span style={{ fontSize: 13, color: "var(--forest-700)", fontWeight: 600 }}>Total startup funding</span>
          <span style={{ font: "800 22px var(--font-display)", color: "var(--forest-700)" }}>{SW3.fmt0(total)}</span>
        </div>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column" }}>
          {[["Total funding", SW3.fmt(total), "var(--ink-900)"], ["Actual spend to date", SW3.fmt(actualSpend), "var(--gold-700)"], ["Remaining budget", SW3.fmt(remaining), "var(--forest-600)"], ["% budget used", pct + "%", "var(--ink-900)"], ["Estimated runway", runway + " months", "var(--ink-900)"]].map(([k, v, c], i) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderTop: i ? "1px solid var(--border-subtle)" : "none" }}>
              <span style={{ fontSize: 13, color: "var(--ink-500)" }}>{k}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: c, fontFamily: "var(--font-mono)" }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8 }}><ProgressBar value={pct} color={pct > 90 ? "var(--red-600)" : "var(--forest-600)"} /></div>
      </Panel>
    </div>
  );
}

const fieldWrap = { display: "flex", flexDirection: "column", gap: 5 };
const fieldLab = { font: "600 12px var(--font-sans)", color: "var(--ink-700)" };
const inp = (locked) => ({ padding: "10px 12px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", fontSize: 14, background: locked ? "var(--cream-100)" : "#fff", color: locked ? "var(--ink-500)" : "var(--ink-900)", cursor: locked ? "not-allowed" : "auto", fontFamily: "var(--font-sans)" });

/* =========================================================== KNOWLEDGE CENTER ===== */
const HOWTO = [
  { icon: "dashboard", t: "Dashboard", d: "Read your launch progress and spend at a glance — every number updates live as you work." },
  { icon: "calendar", t: "12-Week Plan", d: "Work week by week. Check off tasks, drag them between weeks, and watch your progress climb." },
  { icon: "dollar", t: "Budget Planner", d: "Every financial task is an expense. Enter what you actually paid to track real vs. estimated." },
  { icon: "runbook", t: "RunBook", d: "Completed financial tasks become vendor records you can rate, revisit, and export to PDF." },
  { icon: "chart", t: "Reports", d: "See budget health by category and how your operational tasks are tracking." },
  { icon: "ledger", t: "Chart of Accounts", d: "Your GL structure, pre-built for your industry — export straight to your accounting tool." },
];
const KB = (window.StartWiseKnowledge || { toolkit: [], blueprint: [] });

const modalOverlay = { position: "fixed", inset: 0, background: "rgba(14,27,44,0.45)", zIndex: 60, display: "grid", placeItems: "center", padding: 20 };
const modalCard = { width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", background: "#fff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-card-hover)" };
const modalHead = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, padding: "20px 22px", borderBottom: "1px solid var(--border-default)", position: "sticky", top: 0, background: "#fff", zIndex: 1 };
const modalFoot = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 22px", borderTop: "1px solid var(--border-default)", position: "sticky", bottom: 0, background: "#fff" };
const iconX = { border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-400)" };

function RebuildModal({ business, coa, onClose, onApply }) {
  const { Select } = DSx;
  const [ind, setInd] = useS3(business.industry);
  const [bt, setBt] = useS3(business.businessType);
  const [stage, setStage] = useS3(business.stage || "Pre-Revenue");
  const [plan, setPlan] = useS3(null);
  const STAGES = ["Idea / Planning", "Pre-Revenue", "Just Launched", "Operating"];
  return (
    <div onClick={onClose} style={modalOverlay}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...modalCard, maxWidth: 640 }}>
        <div style={modalHead}>
          <h2 style={{ font: "700 18px var(--font-display)", margin: 0, color: "var(--ink-900)" }}>Change business type & rebuild COA</h2>
          <button onClick={onClose} style={iconX}><Icon name="x" size={20} /></button>
        </div>
        <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
          <Callout icon="lock">Switching your type rebuilds your Chart of Accounts and startup expenses. This is only available in your first 48 hours.</Callout>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Select label="Industry" value={ind} onChange={(e) => { setInd(e.target.value); setBt((SW3.industries[e.target.value] || [""])[0]); setPlan(null); }}>{Object.keys(SW3.industries).map((x) => <option key={x}>{x}</option>)}</Select>
            <Select label="Business type" value={bt} onChange={(e) => { setBt(e.target.value); setPlan(null); }}>{(SW3.industries[ind] || []).map((x) => <option key={x}>{x}</option>)}</Select>
            <Select label="Stage" value={stage} onChange={(e) => { setStage(e.target.value); setPlan(null); }}>{STAGES.map((x) => <option key={x}>{x}</option>)}</Select>
          </div>
          <AiGenerate industry={ind} businessType={bt} stage={stage} plan={plan} onPlan={setPlan} />
        </div>
        <div style={modalFoot}>
          <button onClick={onClose} style={btnGhost}>Cancel</button>
          <button disabled={!plan} onClick={() => plan && onApply(plan, { industry: ind, businessType: bt, stage })} style={{ ...btnPrimary, opacity: plan ? 1 : 0.5 }}><Icon name="check" size={16} /> Apply new COA & expenses</button>
        </div>
      </div>
    </div>
  );
}

function PromptModal({ item, phase, onClose }) {
  const [copied, setCopied] = useS3(false);
  const copy = () => { try { navigator.clipboard && navigator.clipboard.writeText(item.prompt); } catch (e) {} setCopied(true); setTimeout(() => setCopied(false), 1600); };
  return (
    <div onClick={onClose} style={modalOverlay}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...modalCard, maxWidth: 640 }}>
        <div style={modalHead}>
          <div>
            <div style={{ font: "600 10px var(--font-mono)", letterSpacing: "0.1em", color: "var(--gold-700)" }}>{phase.toUpperCase()} · PROMPT {item.n}</div>
            <h2 style={{ font: "700 18px var(--font-display)", margin: "4px 0 0", color: "var(--ink-900)" }}>{item.title}</h2>
          </div>
          <button onClick={onClose} style={iconX}><Icon name="x" size={20} /></button>
        </div>
        <div style={{ padding: 22 }}>
          <p style={{ fontSize: 13.5, color: "var(--ink-500)", margin: "0 0 14px" }}>{item.subtitle}</p>
          <div style={{ background: "var(--cream-100)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 16, fontSize: 13.5, color: "var(--ink-800)", lineHeight: 1.6, whiteSpace: "pre-wrap", maxHeight: 360, overflowY: "auto" }}>{item.prompt}</div>
          <div style={{ marginTop: 14 }}><Callout icon="sparkle">Paste this into your own AI account. StartWise doesn't bill for AI usage — your history stays yours.</Callout></div>
        </div>
        <div style={modalFoot}>
          <button onClick={onClose} style={btnGhost}>Close</button>
          <button onClick={copy} style={btnPrimary}><Icon name={copied ? "check" : "file"} size={16} /> {copied ? "Copied!" : "Copy prompt"}</button>
        </div>
      </div>
    </div>
  );
}

function Knowledge({ onTour }) {
  const [sel, setSel] = useS3(null);
  const [openStage, setOpenStage] = useS3(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "var(--navy-900)", borderRadius: "var(--radius-lg)", padding: 28, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <div style={{ maxWidth: 560 }}>
          <div style={{ font: "600 10px var(--font-mono)", letterSpacing: "0.14em", color: "var(--gold-400)" }}>NEW TO STARTWISE?</div>
          <h2 style={{ font: "800 26px var(--font-display)", margin: "8px 0 8px", letterSpacing: "-0.02em" }}>Take the guided tour</h2>
          <p style={{ fontSize: 14, color: "var(--text-on-dark-muted)", margin: 0, lineHeight: 1.55 }}>A two-minute walkthrough of navigation, your dashboard, account setup, the 12-week planner, reports, and resources — so you can launch with confidence.</p>
        </div>
        <button onClick={onTour} style={{ ...btnPrimary, background: "var(--gold-500)", color: "var(--navy-900)", padding: "12px 22px", fontSize: 14.5 }}><Icon name="arrowRight" size={17} /> Take a tour</button>
      </div>

      <Panel title="How to use StartWise" subtitle="Six short guides to every part of your launch plan">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {HOWTO.map((h) => (
            <div key={h.t} style={{ border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 18, background: "var(--cream-50)" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--navy-050)", display: "grid", placeItems: "center", marginBottom: 12 }}><Icon name={h.icon} size={19} color="var(--navy-700)" /></div>
              <div style={{ font: "700 15px var(--font-display)", color: "var(--ink-900)", marginBottom: 5 }}>{h.t}</div>
              <div style={{ fontSize: 13, color: "var(--ink-500)", lineHeight: 1.5 }}>{h.d}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Business owner prompt toolkit" subtitle={`${KB.toolkit.reduce((s, p) => s + p.items.length, 0)} AI prompts across the journey — bring your own AI account`}>
        <div style={{ marginBottom: 16 }}><Callout icon="sparkle"><strong>Bring your own AI.</strong> Each prompt is built to paste straight into your own AI account. StartWise doesn't bill for AI usage, and your history stays yours.</Callout></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {KB.toolkit.map((p) => (
            <div key={p.phase}>
              <div style={{ font: "600 10px var(--font-mono)", letterSpacing: "0.1em", color: "var(--gold-700)", marginBottom: 8 }}>{p.phase.toUpperCase()}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {p.items.map((it) => (
                  <button key={it.n} onClick={() => setSel({ item: it, phase: p.phase })} style={{ textAlign: "left", display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", background: "var(--cream-50)", cursor: "pointer" }}>
                    <span style={{ font: "700 12px var(--font-mono)", color: "var(--navy-700)", marginTop: 1 }}>{it.n}</span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}>{it.title}</span>
                      <span style={{ display: "block", fontSize: 12, color: "var(--ink-500)", marginTop: 2 }}>{it.subtitle}</span>
                    </span>
                    <Icon name="arrowRight" size={15} color="var(--ink-400)" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Entrepreneur blueprint series" subtitle={`${KB.blueprint.reduce((s, p) => s + p.stages.length, 0)} plain-English stages from idea to exit`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {KB.blueprint.map((p) => (
            <div key={p.phase}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{ font: "600 10px var(--font-mono)", letterSpacing: "0.1em", color: "var(--gold-700)" }}>{p.phase.toUpperCase()}</span>
                <span style={{ fontSize: 12, color: "var(--ink-400)" }}>{p.subtitle}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {p.stages.map((st) => {
                  const open = openStage === st.n;
                  return (
                    <div key={st.n} style={{ border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", background: "var(--cream-50)", overflow: "hidden" }}>
                      <button onClick={() => setOpenStage(open ? null : st.n)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                        <div style={{ width: 30, height: 30, borderRadius: 999, background: "var(--gold-050)", color: "var(--gold-700)", display: "grid", placeItems: "center", font: "700 12px var(--font-mono)", flexShrink: 0 }}>{st.n}</div>
                        <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>{st.title}</span>
                        <Icon name="chevron" size={17} color="var(--ink-400)" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                      </button>
                      {open && (
                        <div style={{ padding: "0 16px 16px 58px", display: "flex", flexDirection: "column", gap: 12 }}>
                          {[["What it is", st.whatItIs], ["In plain English", st.plainEnglish], ["Why it matters", st.whyItMatters], ["Your first step", st.firstStep]].map(([k, v]) => v ? (
                            <div key={k}>
                              <div style={{ font: "600 10px var(--font-mono)", letterSpacing: "0.08em", color: k === "Your first step" ? "var(--forest-700)" : "var(--ink-500)", marginBottom: 3 }}>{k.toUpperCase()}</div>
                              <div style={{ fontSize: 13.5, color: "var(--ink-700)", lineHeight: 1.55 }}>{v}</div>
                            </div>
                          ) : null)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {sel && <PromptModal item={sel.item} phase={sel.phase} onClose={() => setSel(null)} />}

      <Panel title="Finance for beginners" subtitle="Plain-English answers to the money questions every new owner asks">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {(window.StartWiseBiz.financeArticles).map((g) => (
            <div key={g.group}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--navy-050)", display: "grid", placeItems: "center" }}><Icon name={g.icon} size={15} color="var(--navy-700)" /></div>
                <span style={{ font: "600 10px var(--font-mono)", letterSpacing: "0.1em", color: "var(--gold-700)" }}>{g.group.toUpperCase()}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {g.articles.map((a) => (
                  <div key={a.t} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", background: "var(--cream-50)" }}>
                    <Icon name="book" size={16} color="var(--navy-600)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}>{a.t}</div>
                      <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginTop: 2, lineHeight: 1.45 }}>{a.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="AI business assistant" subtitle="Your connected AI account can analyze your business data — find these on each screen">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {(window.StartWiseBiz.aiAssistant).map((a) => (
            <div key={a.title} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 16px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", background: "var(--cream-50)" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--gold-050)", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name={a.icon} size={17} color="var(--gold-700)" /></div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--gold-700)" }}>{a.area}</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)", marginTop: 1 }}>{a.title}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginTop: 2, lineHeight: 1.45 }}>{a.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14 }}><Callout icon="sparkle"><strong>Bring your own AI.</strong> StartWise sends your data summary to your connected AI account for analysis — it never bills you for AI usage, and your history stays yours.</Callout></div>
      </Panel>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, padding: "20px 24px", background: "var(--gold-050)", border: "1px solid var(--gold-100)", borderRadius: "var(--radius-lg)", flexWrap: "wrap" }}>
        <div>
          <div style={{ font: "700 17px var(--font-display)", color: "var(--ink-900)" }}>Need help building your business?</div>
          <div style={{ fontSize: 13.5, color: "var(--ink-600)", marginTop: 3 }}>Across the Table offers one-on-one consulting for small business owners.</div>
        </div>
        <a href="mailto:info@acrossthetable.biz" style={{ ...btnPrimary, textDecoration: "none", background: "var(--navy-700)" }}><Icon name="mail" size={16} /> info@acrossthetable.biz</a>
      </div>
    </div>
  );
}

Object.assign(window, { BusinessInfo, Knowledge, Legal, LegalModal });
