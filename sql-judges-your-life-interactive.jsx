import { useState, useEffect, useRef } from "react";

const ACCENT_COLORS = {
  swiggy:  { main: "#ff3b6b", light: "#ff8a65", muted: "#ff3b6b33", name: "rose" },
  gym:     { main: "#3bffb0", light: "#6dffd9", muted: "#3bffb033", name: "mint" },
  sleep:   { main: "#a78bfa", light: "#c4b5fd", muted: "#a78bfa33", name: "violet" },
  money:   { main: "#ffe566", light: "#fff099", muted: "#ffe56633", name: "yellow" },
  texts:   { main: "#f87171", light: "#fca5a5", muted: "#f8717133", name: "coral" },
};

const EPISODES = [
  {
    id: "swiggy",
    emoji: "🍔",
    title: "Swiggy / Food Orders",
    tagline: "How bad are your 3AM cravings?",
    fields: [
      { key: "orders_per_week", label: "Avg food orders per week", type: "number", placeholder: "e.g. 5", min: 0 },
      { key: "late_night_pct", label: "% of orders after 10 PM", type: "number", placeholder: "e.g. 40", min: 0, max: 100 },
      { key: "avg_spend", label: "Avg spend per order (₹)", type: "number", placeholder: "e.g. 350" },
      { key: "fav_food", label: "Most ordered dish", type: "text", placeholder: "e.g. Biryani" },
      { key: "weekend_multiplier", label: "Weekend orders vs weekday (×)", type: "number", placeholder: "e.g. 2.5", step: "0.1" },
    ],
  },
  {
    id: "gym",
    emoji: "💪",
    title: "Gym Attendance",
    tagline: "Your membership vs your actions.",
    fields: [
      { key: "goal_days", label: "Goal gym days per week", type: "number", placeholder: "e.g. 5", min: 0, max: 7 },
      { key: "actual_days", label: "Actual gym days per week", type: "number", placeholder: "e.g. 1", min: 0, max: 7 },
      { key: "session_mins", label: "Avg session duration (mins)", type: "number", placeholder: "e.g. 25" },
      { key: "jan_visits", label: "January visits (new year energy)", type: "number", placeholder: "e.g. 18" },
      { key: "top_excuse", label: "Favourite skip excuse", type: "text", placeholder: "e.g. Too tired" },
    ],
  },
  {
    id: "sleep",
    emoji: "😴",
    title: "Sleep Cycle",
    tagline: "Your circadian rhythm wants a word.",
    fields: [
      { key: "bedtime", label: "Average bedtime", type: "time", placeholder: "01:30" },
      { key: "wake_time", label: "Average wake time", type: "time", placeholder: "08:00" },
      { key: "coffee_cups", label: "Coffee/tea cups per day", type: "number", placeholder: "e.g. 4", min: 0 },
      { key: "screen_before_sleep", label: "Screen time before bed (mins)", type: "number", placeholder: "e.g. 60" },
      { key: "quality", label: "Sleep quality self-score (1–10)", type: "number", placeholder: "e.g. 5", min: 1, max: 10 },
    ],
  },
  {
    id: "money",
    emoji: "💸",
    title: "Spending Habits",
    tagline: "Your bank statement doesn't lie.",
    fields: [
      { key: "monthly_income", label: "Monthly income (₹)", type: "number", placeholder: "e.g. 60000" },
      { key: "monthly_spend", label: "Actual monthly spend (₹)", type: "number", placeholder: "e.g. 72000" },
      { key: "top_category", label: "Biggest spend category", type: "text", placeholder: "e.g. Food, Shopping" },
      { key: "impulse_count", label: "Impulse buys this month (#)", type: "number", placeholder: "e.g. 7" },
      { key: "savings_goal", label: "Savings goal % of income", type: "number", placeholder: "e.g. 20", min: 0, max: 100 },
    ],
  },
  {
    id: "texts",
    emoji: "📱",
    title: "Text Response Time",
    tagline: "Who do you actually ghost?",
    fields: [
      { key: "avg_reply_hrs", label: "Avg reply time to friends (hrs)", type: "number", placeholder: "e.g. 4", step: "0.5" },
      { key: "meme_reply_secs", label: "Reply time to memes (secs)", type: "number", placeholder: "e.g. 8" },
      { key: "ghost_rate", label: "% of messages you never reply to", type: "number", placeholder: "e.g. 25", min: 0, max: 100 },
      { key: "most_ignored", label: "Who you ignore most", type: "text", placeholder: "e.g. work group, relatives" },
      { key: "screen_checks", label: "Times you check phone/hour", type: "number", placeholder: "e.g. 12" },
    ],
  },
];

function TypewriterText({ text, speed = 18, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);
  useEffect(() => {
    setDisplayed("");
    idx.current = 0;
    if (!text) return;
    const iv = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) { clearInterval(iv); onDone && onDone(); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return <span>{displayed}<span style={{ opacity: displayed.length < (text || "").length ? 1 : 0 }}>▋</span></span>;
}

function ProgressBar({ value, max, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ background: "#1a1a25", height: 6, borderRadius: 3, overflow: "hidden", margin: "4px 0 12px" }}>
      <div style={{ width: pct + "%", height: "100%", background: color, transition: "width 1s ease", borderRadius: 3 }} />
    </div>
  );
}

function SqlBlock({ lines, color }) {
  return (
    <pre style={{
      background: "#0d0d15",
      border: `1px solid #222230`,
      borderLeft: `3px solid ${color}`,
      padding: "18px 20px",
      fontFamily: "'DM Mono', 'Fira Code', monospace",
      fontSize: 12,
      lineHeight: 1.9,
      overflowX: "auto",
      borderRadius: 2,
      margin: "12px 0",
      color: "#ddd",
    }}
      dangerouslySetInnerHTML={{ __html: lines }}
    />
  );
}

function StatRow({ label, value, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1e1e2e" }}>
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#666680", letterSpacing: 1 }}>{label}</span>
      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color }}>{value}</span>
    </div>
  );
}

export default function App() {
  const [activeEp, setActiveEp] = useState(null);
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verdictDone, setVerdictDone] = useState(false);
  const resultRef = useRef(null);

  const ep = EPISODES.find(e => e.id === activeEp);
  const col = activeEp ? ACCENT_COLORS[activeEp] : null;

  function handleField(key, val) {
    setFormData(prev => ({ ...prev, [key]: val }));
  }

  async function analyze() {
    setLoading(true);
    setError(null);
    setResult(null);
    setVerdictDone(false);

    const fieldsText = ep.fields.map(f => `- ${f.label}: ${formData[f.key] || "not provided"}`).join("\n");

    const prompt = `You are SQL Judges Your Life — a brutally funny data analyst who roasts people's life habits using SQL metaphors and queries. The user has submitted their real "${ep.title}" data.

User data:
${fieldsText}

Respond ONLY with a JSON object (no markdown, no backticks) with these exact keys:

{
  "sql_query": "A single funny SQL query (as a string with \\n for newlines) using their actual numbers. Use SELECT, FROM (fake table name), WHERE/GROUP BY/CASE WHEN/window functions creatively. Include SQL comments (--) with jokes. Make it look real and clever. 15-25 lines.",
  "stats": [
    {"label": "...", "value": "..."},
    {"label": "...", "value": "..."},
    {"label": "...", "value": "..."},
    {"label": "...", "value": "..."}
  ],
  "verdict": "One punchy 1-2 sentence roast verdict. Start with 'SQL says:'. Make it devastatingly accurate and funny based on their actual numbers.",
  "skill_tags": ["TAG1", "TAG2", "TAG3", "TAG4"]
}

The stats should be derived FROM their actual data — calculate percentages, totals, comparisons. Be specific. The verdict must reference their actual numbers to feel personal. Keep skill_tags as real SQL concepts used in the query.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const raw = data.content.map(b => b.text || "").join("");
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) {
      setError("Query execution failed. Check your data and try again. 😬");
    } finally {
      setLoading(false);
    }
  }

  function colorizeSQL(sql) {
    if (!sql) return "";
    const c = col?.main || "#ff3b6b";
    return sql
      .replace(/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|JOIN|LEFT JOIN|INNER JOIN|ON|AS|CASE|WHEN|THEN|ELSE|END|AND|OR|NOT|IN|IS|NULL|LIMIT|PARTITION BY|OVER|ROWS|BETWEEN|UNBOUNDED|PRECEDING|CURRENT ROW|DISTINCT|COUNT|SUM|AVG|MAX|MIN|ROUND|EXTRACT|LAG|LEAD|RANK|DENSE_RANK|ROW_NUMBER|DATE_TRUNC|COALESCE|CAST|TO_CHAR|ILIKE|LIKE)\b/g,
        `<span style="color:${c};font-weight:700">$1</span>`)
      .replace(/(--[^\n]*)/g, `<span style="color:#555570;font-style:italic">$1</span>`)
      .replace(/('.*?')/g, `<span style="color:${col?.light || "#ffcc80"}">$1</span>`)
      .replace(/\b(\d+\.?\d*)\b/g, `<span style="color:${col?.light || "#ffcc80"}">$1</span>`);
  }

  // Home screen
  if (!activeEp) {
    return (
      <div style={{ minHeight: "100vh", background: "#08080f", color: "#f0f0f0", fontFamily: "'Space Mono', monospace" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800;900&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');
          * { box-sizing: border-box; }
          ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #333; }
          .ep-card { cursor: pointer; border: 1px solid #1e1e2e; padding: 24px; transition: all 0.2s; position: relative; overflow: hidden; }
          .ep-card::before { content: ''; position: absolute; inset: 0; opacity: 0; transition: opacity 0.2s; }
          .ep-card:hover { transform: translateY(-3px); }
        `}</style>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "60px 20px 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "#ff3b6b", color: "#fff", fontSize: 10, letterSpacing: 3, padding: "5px 14px", marginBottom: 20, fontFamily: "'DM Mono',monospace" }}>INTERACTIVE SERIES</div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(40px,8vw,84px)", lineHeight: 0.92, letterSpacing: -2, margin: "0 0 16px" }}>
              SQL<br /><span style={{ color: "#ff3b6b" }}>Judges</span><br />Your Life
            </h1>
            <p style={{ color: "#555570", fontSize: 12, letterSpacing: 2 }}>// Enter your real data. Get roasted by SQL. 💀</p>
          </div>

          <div style={{ display: "grid", gap: 3 }}>
            {EPISODES.map(e => {
              const c = ACCENT_COLORS[e.id];
              return (
                <div
                  key={e.id}
                  className="ep-card"
                  style={{ borderTop: `2px solid ${c.main}` }}
                  onClick={() => { setActiveEp(e.id); setFormData({}); setResult(null); }}
                  onMouseEnter={ev => ev.currentTarget.style.background = c.muted}
                  onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ fontSize: 32, lineHeight: 1 }}>{e.emoji}</div>
                    <div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: c.main }}>{e.title}</div>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#555570", marginTop: 3, fontStyle: "italic" }}>{e.tagline}</div>
                    </div>
                    <div style={{ marginLeft: "auto", color: c.main, fontSize: 20 }}>→</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: 40, color: "#333345", fontSize: 11, letterSpacing: 2 }}>
            POWERED BY CLAUDE — DATA STAYS IN YOUR BROWSER
          </div>
        </div>
      </div>
    );
  }

  // Episode form + result
  const allFilled = ep.fields.every(f => formData[f.key] && String(formData[f.key]).trim() !== "");

  return (
    <div style={{ minHeight: "100vh", background: "#08080f", color: "#f0f0f0", fontFamily: "'Space Mono', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800;900&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #333; }
        input { background: #0d0d18; border: 1px solid #222230; color: #f0f0f0; font-family: 'Space Mono', monospace; font-size: 13px; padding: 10px 14px; width: 100%; outline: none; transition: border 0.2s; }
        input:focus { border-color: ${col.main}; }
        input::placeholder { color: #333345; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .result-section { animation: fadeUp 0.4s ease both; }
      `}</style>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 20px 80px" }}>
        {/* Back + header */}
        <button
          onClick={() => setActiveEp(null)}
          style={{ background: "none", border: "none", color: "#444455", cursor: "pointer", fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: 2, marginBottom: 32, padding: 0 }}
        >← ALL EPISODES</button>

        <div style={{ borderTop: `3px solid ${col.main}`, border: `1px solid #1e1e2e`, borderTopColor: col.main, padding: "28px 28px 24px", marginBottom: 3, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -50, right: -50, width: 160, height: 160, borderRadius: "50%", background: col.main, opacity: 0.06, filter: "blur(40px)" }} />
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: 3, color: col.main, marginBottom: 10 }}>EPISODE {String(EPISODES.findIndex(e => e.id === activeEp) + 1).padStart(2, "0")} / 05</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(22px,5vw,36px)", lineHeight: 1.05, marginBottom: 6 }}>{ep.emoji} {ep.title}</div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#555570", fontStyle: "italic" }}>// {ep.tagline}</div>
        </div>

        {/* Form */}
        <div style={{ border: "1px solid #1e1e2e", borderTop: "none", padding: "28px" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: col.main, marginBottom: 20 }}>YOUR DATA →</div>
          <div style={{ display: "grid", gap: 18 }}>
            {ep.fields.map(f => (
              <div key={f.key}>
                <label style={{ display: "block", fontSize: 11, letterSpacing: 2, color: "#888899", marginBottom: 7 }}>
                  {f.label.toUpperCase()}
                </label>
                <input
                  type={f.type || "text"}
                  placeholder={f.placeholder}
                  value={formData[f.key] || ""}
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  onChange={e => handleField(f.key, e.target.value)}
                />
              </div>
            ))}
          </div>

          <button
            onClick={analyze}
            disabled={!allFilled || loading}
            style={{
              marginTop: 28,
              width: "100%",
              background: allFilled && !loading ? col.main : "#1e1e2e",
              border: "none",
              color: allFilled && !loading ? "#08080f" : "#333345",
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              fontSize: 15,
              padding: "14px",
              cursor: allFilled && !loading ? "pointer" : "not-allowed",
              letterSpacing: 1,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {loading ? (
              <>
                <span style={{ display: "inline-block", width: 16, height: 16, border: `2px solid #333`, borderTopColor: col.main, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                RUNNING QUERY…
              </>
            ) : (
              <>EXECUTE QUERY — JUDGE MY LIFE 💀</>
            )}
          </button>

          {!allFilled && <p style={{ textAlign: "center", fontSize: 10, color: "#333345", letterSpacing: 2, marginTop: 10 }}>FILL ALL FIELDS TO RUN</p>}
          {error && <p style={{ color: "#ff3b6b", fontSize: 12, marginTop: 12, textAlign: "center" }}>{error}</p>}
        </div>

        {/* Results */}
        {result && (
          <div ref={resultRef}>
            {/* SQL Query */}
            <div className="result-section" style={{ border: "1px solid #1e1e2e", borderTop: "none", padding: "28px", animationDelay: "0.05s" }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: col.main, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                🔍 GENERATED QUERY
                <span style={{ flex: 1, height: 1, background: "#1e1e2e" }} />
              </div>
              <SqlBlock lines={colorizeSQL(result.sql_query)} color={col.main} />
            </div>

            {/* Stats */}
            <div className="result-section" style={{ border: "1px solid #1e1e2e", borderTop: "none", padding: "28px", animationDelay: "0.1s" }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: col.main, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                📊 QUERY RESULTS
                <span style={{ flex: 1, height: 1, background: "#1e1e2e" }} />
              </div>
              {result.stats?.map((s, i) => (
                <StatRow key={i} label={s.label} value={s.value} color={col.main} />
              ))}
            </div>

            {/* Verdict */}
            <div className="result-section" style={{
              border: `2px solid ${col.main}`,
              padding: "28px",
              display: "flex",
              gap: 20,
              alignItems: "flex-start",
              animationDelay: "0.15s",
              background: col.muted,
            }}>
              <div style={{ fontSize: 44, lineHeight: 1, flexShrink: 0 }}>🤖</div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 4, color: col.light, marginBottom: 10, opacity: 0.7 }}>SQL VERDICT</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(16px,3vw,22px)", lineHeight: 1.3, color: col.main }}>
                  <TypewriterText text={result.verdict} speed={22} onDone={() => setVerdictDone(true)} />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="result-section" style={{ border: "1px solid #1e1e2e", borderTop: "none", padding: "16px 28px", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", animationDelay: "0.2s" }}>
              <span style={{ fontSize: 10, letterSpacing: 3, color: "#444455", marginRight: 4 }}>SKILLS INSIDE:</span>
              {result.skill_tags?.map((t, i) => (
                <span key={i} style={{ border: `1px solid ${col.main}`, color: col.main, fontFamily: "'DM Mono',monospace", fontSize: 11, padding: "4px 10px", letterSpacing: 0.5 }}>{t}</span>
              ))}
            </div>

            {/* Try another */}
            {verdictDone && (
              <div className="result-section" style={{ textAlign: "center", marginTop: 28, animationDelay: "0.25s" }}>
                <button
                  onClick={() => setActiveEp(null)}
                  style={{ background: "none", border: `1px solid #222230`, color: "#888899", fontFamily: "'Space Mono',monospace", fontSize: 12, padding: "12px 28px", cursor: "pointer", letterSpacing: 2 }}
                >TRY ANOTHER EPISODE →</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
