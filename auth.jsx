/* StartWise — Auth: login + onboarding */
const { useState: useAuthState } = React;
const DSauth = window.AcrossTheTableDesignSystem_520822;

function AuthShell({ children, wide }) {
  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr", placeItems: "center", background: "var(--cream-50)", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: wide ? 720 : 440 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 22 }}>
          <img src={(window.__resources && window.__resources.logo) || "assets/logo.png"} alt="Across the Table" style={{ width: 190, display: "block" }} />
          <div style={{ font: "800 24px var(--font-display)", letterSpacing: "-0.02em", color: "var(--navy-700)", marginTop: 8 }}>StartWise</div>
          <div style={{ font: "500 10px var(--font-mono)", letterSpacing: "0.16em", color: "var(--ink-500)", marginTop: 4 }}>YOUR 12-WEEK BUSINESS LAUNCH PLANNER</div>
        </div>
        {children}
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "var(--ink-400)" }}>
          Across the Table · acrossthetable.biz
        </div>
      </div>
    </div>
  );
}

function Login({ onLogin, onStart }) {
  const { Input, Button } = DSauth;
  const [email, setEmail] = useAuthState("dana@freshnestclean.com");
  const [code, setCode] = useAuthState("SW-HC-2048");
  return (
    <AuthShell>
      <div style={{ background: "#fff", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", padding: 28 }}>
        <h2 style={{ font: "700 20px var(--font-display)", color: "var(--ink-900)", margin: "0 0 4px" }}>Welcome back</h2>
        <p style={{ fontSize: 13.5, color: "var(--ink-500)", margin: "0 0 20px" }}>Sign in to pick up your launch plan where you left off.</p>
        <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Access code" value={code} onChange={(e) => setCode(e.target.value)} hint="Found in your welcome email." />
          <Button variant="primary" size="lg" type="submit" style={{ marginTop: 4 }}>Sign in</Button>
        </form>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16, fontSize: 13, color: "var(--ink-500)" }}>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "var(--navy-600)" }}>Forgot access code?</a>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
        <div style={{ flex: 1, height: 1, background: "var(--border-default)" }}></div>
        <span style={{ fontSize: 11, color: "var(--ink-400)", letterSpacing: "0.08em" }}>NEW HERE?</span>
        <div style={{ flex: 1, height: 1, background: "var(--border-default)" }}></div>
      </div>
      <button onClick={onStart} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px", background: "#fff", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-md)", font: "600 14px var(--font-sans)", color: "var(--navy-700)", cursor: "pointer" }}>
        <Icon name="sparkle" size={16} color="var(--gold-600)" /> Start a new business
      </button>
    </AuthShell>
  );
}

const INDUSTRIES = ["House Cleaning", "Landscaping", "HVAC", "Hair Salon", "Mobile Detailing", "Other"];
const STAGES = ["Idea / Planning", "Pre-Revenue", "Just Launched", "Operating"];
const FUND_OPTS = ["Personal Savings", "Friends & Family", "SBA Loan", "Business Loan", "Investor Funding", "Grants", "Credit Cards", "Equipment Financing", "Crowdfunding", "Other"];

function Onboarding({ onDone, onCancel }) {
  const { Input, Select, Checkbox, Switch, Button } = DSauth;
  const [step, setStep] = useAuthState(0);
  const [biz, setBiz] = useAuthState({ businessName: "", fullName: "", industry: "Home Service Industry", businessType: "Cleaning Companies", stage: "Idea / Planning", launchDate: "" });
  const [funds, setFunds] = useAuthState(FUND_OPTS.map((s, i) => ({ source: s, on: i < 2, amount: i === 0 ? 12000 : i === 1 ? 5000 : 0 })));
  const [sms, setSms] = useAuthState(true);
  const [terms, setTerms] = useAuthState(false);
  const [legalDoc, setLegalDoc] = useAuthState(null);

  const [plan, setPlan] = useAuthState(null);
  const total = funds.filter((f) => f.on).reduce((s, f) => s + (+f.amount || 0), 0);
  const steps = ["Business", "AI plan", "Funding", "Launch & terms"];

  const setFund = (i, patch) => setFunds(funds.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  const canNext = step === 0 ? (biz.businessName.trim() && biz.fullName.trim()) : step === 1 ? !!plan : step === 3 ? terms : true;

  return (
    <AuthShell wide>
      <div style={{ background: "#fff", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", padding: 30 }}>
        {/* stepper */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
              <div style={{ height: 4, borderRadius: 999, background: i <= step ? "var(--forest-600)" : "var(--cream-100)", transition: "background .2s" }}></div>
              <span style={{ fontSize: 11, fontWeight: 600, color: i <= step ? "var(--forest-700)" : "var(--ink-400)" }}>{i + 1}. {s}</span>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h2 style={{ font: "700 19px var(--font-display)", margin: 0, color: "var(--ink-900)" }}>Tell us about your business</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Input label="Your name" placeholder="e.g. Dana Rivera" value={biz.fullName} onChange={(e) => setBiz({ ...biz, fullName: e.target.value })} />
              <Input label="Business name" placeholder="e.g. FreshNest Cleaning Co." value={biz.businessName} onChange={(e) => setBiz({ ...biz, businessName: e.target.value })} />
              <Select label="Business type" value={biz.businessType} onChange={(e) => { const bt = e.target.value; setBiz({ ...biz, businessType: bt, industry: StartWiseData.typeToIndustry[bt] || biz.industry }); setPlan(null); }}>{StartWiseData.allBusinessTypes.map((x) => <option key={x}>{x}</option>)}</Select>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ font: "600 12px var(--font-sans)", color: "var(--ink-700)" }}>Industry <span style={{ color: "var(--ink-400)", fontWeight: 400 }}>· auto-filled</span></label>
                <div style={{ padding: "0 12px", height: "var(--control-md)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", fontSize: 14, background: "var(--cream-100)", color: "var(--ink-700)", display: "flex", alignItems: "center", gap: 8 }}><Icon name="briefcase" size={15} color="var(--ink-400)" />{biz.industry}</div>
              </div>
            </div>
            <Select label="Business stage" value={biz.stage} onChange={(e) => setBiz({ ...biz, stage: e.target.value })}>{STAGES.map((x) => <option key={x}>{x}</option>)}</Select>
            <Callout icon="lock"><strong>Heads up:</strong> after 15 days your business name, industry, and type lock to your license. Next, AI builds a Chart of Accounts tailored to a {biz.businessType}.</Callout>
          </div>
        )}

        {step === 1 && (
          <AiGenerate industry={biz.industry} businessType={biz.businessType} stage={biz.stage} plan={plan} onPlan={setPlan} />
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h2 style={{ font: "700 19px var(--font-display)", margin: 0, color: "var(--ink-900)" }}>How are you funding the launch?</h2>
            <p style={{ fontSize: 13, color: "var(--ink-500)", margin: 0 }}>Check every source you'll use and enter an amount. We'll total your startup budget.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {funds.map((f, i) => (
                <label key={f.source} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: `1px solid ${f.on ? "var(--forest-500)" : "var(--border-default)"}`, background: f.on ? "var(--forest-050)" : "#fff", borderRadius: "var(--radius-md)", cursor: "pointer", transition: "all .13s" }}>
                  <input type="checkbox" checked={f.on} onChange={(e) => setFund(i, { on: e.target.checked })} style={{ accentColor: "var(--forest-600)", width: 16, height: 16 }} />
                  <span style={{ flex: 1, fontSize: 13.5, color: "var(--ink-800)", fontWeight: 500 }}>{f.source}</span>
                  {f.on && (
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <span style={{ color: "var(--ink-400)", fontSize: 13 }}>$</span>
                      <input type="number" value={f.amount} onChange={(e) => setFund(i, { amount: e.target.value })} onClick={(e) => e.preventDefault()} style={{ width: 78, padding: "5px 7px", border: "1px solid var(--border-default)", borderRadius: 6, fontSize: 13, fontFamily: "var(--font-mono)" }} />
                    </span>
                  )}
                </label>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "var(--navy-900)", borderRadius: "var(--radius-md)", color: "#fff" }}>
              <span style={{ fontSize: 13, color: "var(--text-on-dark-muted)" }}>Total startup budget</span>
              <span style={{ font: "800 24px var(--font-display)" }}>{StartWiseData.fmt0(total)}</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h2 style={{ font: "700 19px var(--font-display)", margin: 0, color: "var(--ink-900)" }}>When do you want to launch?</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, alignItems: "end" }}>
              <Input label="Target launch date" type="date" value={biz.launchDate} onChange={(e) => setBiz({ ...biz, launchDate: e.target.value })} hint="We'll build your 12-week plan backward from here." />
              <div style={{ paddingBottom: 8 }}><Switch label="Daily SMS reminders" checked={sms} onChange={(e) => setSms(e.target.checked)} /></div>
            </div>
            {sms && (
              <div style={{ display: "flex", gap: 12, background: "var(--navy-900)", borderRadius: "var(--radius-md)", padding: "14px 16px", color: "#fff" }}>
                <Icon name="sparkle" size={18} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ font: "600 9px var(--font-mono)", letterSpacing: "0.12em", color: "var(--gold-400)" }}>EVERY DAILY SMS INCLUDES AN AFFIRMATION</div>
                  <div style={{ fontSize: 13.5, marginTop: 4, lineHeight: 1.45 }}>“{(StartWiseData.affirmationOfDay() || {}).text}”</div>
                </div>
              </div>
            )}
            <div style={{ background: "var(--cream-100)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 18 }}>
              <div style={{ font: "600 9.5px var(--font-mono)", letterSpacing: "0.12em", color: "var(--ink-500)", marginBottom: 10 }}>BEFORE YOU START</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "var(--ink-600)", marginBottom: 14 }}>
                {(window.LEGAL_DOCS || []).map((d) => (
                  <a key={d.id} href="#" onClick={(e) => { e.preventDefault(); setLegalDoc(d); }} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--navy-600)" }}><Icon name="file" size={15} /> {d.title}</a>
                ))}
              </div>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
                <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} style={{ accentColor: "var(--forest-600)", width: 17, height: 17, marginTop: 1 }} />
                <span style={{ fontSize: 13, color: "var(--ink-700)" }}>I've reviewed and accept the Terms, Privacy Policy, and License Agreement. {terms && <span style={{ color: "var(--ink-400)" }}>· accepted {new Date().toLocaleDateString()}</span>}</span>
              </label>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26 }}>
          <button onClick={() => (step === 0 ? onCancel() : setStep(step - 1))} style={{ ...btnGhost, background: "transparent", border: "none", color: "var(--ink-500)" }}>{step === 0 ? "Cancel" : "Back"}</button>
          {step < 3 ? (
            <Button variant="primary" disabled={!canNext} onClick={() => canNext && setStep(step + 1)} rightIcon={<Icon name="arrowRight" size={16} />}>Continue</Button>
          ) : (
            <Button variant="primary" disabled={!terms} onClick={() => onDone({ biz, funds, sms, terms, total, plan })} rightIcon={<Icon name="check" size={16} />}>Launch my plan</Button>
          )}
        </div>
      </div>
      {legalDoc && <LegalModal doc={legalDoc} onClose={() => setLegalDoc(null)} />}
    </AuthShell>
  );
}

Object.assign(window, { Login, Onboarding });
