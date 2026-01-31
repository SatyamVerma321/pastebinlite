import { useEffect, useState } from "react";

export default function App() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState(300);
  const [maxViews, setMaxViews] = useState(5);
  const [result, setResult] = useState(null);
  const [pasteId, setPasteId] = useState("");
  const [loadedPaste, setLoadedPaste] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [theme, setTheme] = useState("dark");

  /* ---------- THEME ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  /* ---------- API ---------- */
  const createPaste = async () => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:8080/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          ttl_seconds: Number(ttl),
          max_views: Number(maxViews),
        }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data);
      setSuccess("Paste created successfully 🚀");
      setContent("");
    } catch {
      setError("❌ Failed to create paste. Backend not running?");
    }
  };

  const fetchPaste = async () => {
    setError("");
    setLoadedPaste(null);
    try {
      const res = await fetch(`http://localhost:8080/api/pastes/${pasteId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLoadedPaste(data);
    } catch {
      setError("❌ Paste not found or expired");
    }
  };

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    setSuccess("Copied to clipboard 📋");
    setTimeout(() => setSuccess(""), 2000);
  };

  const t = theme === "dark" ? dark : light;

  return (
    <div style={{ ...styles.page, background: t.pageBg, color: t.text }}>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={{ ...styles.title, background: t.gradient }}>
              📋 Pastebin Lite
            </h1>
            <p style={{ ...styles.subtitle, color: t.subtext }}>
              Secure • Temporary • Shareable Text
            </p>
          </div>

          <button onClick={toggleTheme} style={{ ...styles.themeBtn, ...t.themeBtn }}>
            {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>

        {/* CREATE CARD */}
        <div style={{ ...styles.card, background: t.cardBg, border: t.border }}>
          <h2 style={styles.cardTitle}>Create Paste</h2>

          <textarea
            style={{ ...styles.textarea, ...t.input }}
            rows={6}
            placeholder="Write or paste your content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div style={styles.row}>
            <div style={styles.field}>
              <label>TTL (seconds)</label>
              <input
                type="number"
                style={{ ...styles.inputBase, ...t.input }}
                value={ttl}
                onChange={(e) => setTtl(e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label>Max Views</label>
              <input
                type="number"
                style={{ ...styles.inputBase, ...t.input }}
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
              />
            </div>
          </div>

          <button
            style={{ ...styles.primaryBtn, background: t.primaryBtn }}
            onClick={createPaste}
          >
            🚀 Create Paste
          </button>

          {result && (
            <div style={{ ...styles.resultBox, background: t.resultBg, border: t.border }}>
              <p>
                <b>ID:</b> {result.id}
              </p>
              <p>
                <b>URL:</b>{" "}
                <a href={result.url} target="_blank" rel="noreferrer">
                  {result.url}
                </a>
              </p>
              <button
                style={{ ...styles.secondaryBtn, color: t.primary, border: `1px solid ${t.primary}` }}
                onClick={() => copyToClipboard(result.url)}
              >
                📋 Copy Link
              </button>
            </div>
          )}
        </div>

        {/* VIEW CARD */}
        <div style={{ ...styles.card, background: t.cardBg, border: t.border }}>
          <h2 style={styles.cardTitle}>View Paste</h2>

          <div style={styles.row}>
            <input
              style={{ ...styles.inputBase, ...t.input, flex: 1 }}
              placeholder="Enter Paste ID"
              value={pasteId}
              onChange={(e) => setPasteId(e.target.value)}
            />
            <button
              style={{ ...styles.primaryBtnSmall, background: t.primaryBtn }}
              onClick={fetchPaste}
            >
              🔍 Load
            </button>
          </div>

          {loadedPaste && (
            <div style={{ ...styles.viewer, border: t.border }}>
              <pre style={{ ...styles.code, background: t.codeBg }}>
                {loadedPaste.content}
              </pre>
              <div style={{ ...styles.meta, background: t.metaBg }}>
                <span>⏳ Expires: {loadedPaste.expiresAt || "Never"}</span>
                <span>
                  👀 Remaining:{" "}
                  {loadedPaste.remainingViews === null
                    ? "Unlimited"
                    : loadedPaste.remainingViews}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* TOASTS */}
        {error && <div style={{ ...styles.errorToast }}>{error}</div>}
        {success && <div style={{ ...styles.successToast }}>{success}</div>}
      </div>
    </div>
  );
}

/* ---------------- THEMES ---------------- */

const dark = {
  pageBg: "linear-gradient(135deg, #0f172a, #020617)",
  text: "#e5e7eb",
  subtext: "#94a3b8",
  cardBg: "rgba(255,255,255,0.05)",
  border: "1px solid #1e293b",
  input: {
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #334155",
  },
  codeBg: "#020617",
  metaBg: "#020617",
  resultBg: "#020617",
  primary: "#38bdf8",
  primaryBtn: "linear-gradient(90deg, #38bdf8, #22c55e)",
  gradient: "linear-gradient(90deg, #38bdf8, #22c55e)",
  themeBtn: {
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #334155",
  },
};

const light = {
  pageBg: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
  text: "#020617",
  subtext: "#475569",
  cardBg: "#ffffff",
  border: "1px solid #e2e8f0",
  input: {
    background: "#ffffff",
    color: "#020617",
    border: "1px solid #cbd5f5",
  },
  codeBg: "#f1f5f9",
  metaBg: "#f8fafc",
  resultBg: "#f8fafc",
  primary: "#2563eb",
  primaryBtn: "linear-gradient(90deg, #3b82f6, #6366f1)",
  gradient: "linear-gradient(90deg, #2563eb, #7c3aed)",
  themeBtn: {
    background: "#ffffff",
    color: "#020617",
    border: "1px solid #cbd5f5",
  },
};

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px 20px",
    transition: "all 0.3s ease",
    fontFamily: "Inter, system-ui, Arial",
  },
  container: {
    maxWidth: 900,
    margin: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    flexWrap: "wrap",
    gap: 16,
  },
  title: {
    fontSize: "2.4rem",
    fontWeight: 700,
    WebkitBackgroundClip: "text",
    color: "transparent",
    margin: 0,
  },
  subtitle: {
    margin: 0,
    fontSize: "0.95rem",
  },
  themeBtn: {
    padding: "10px 16px",
    borderRadius: 999,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  card: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    transition: "all 0.3s ease",
  },
  cardTitle: {
    marginBottom: 12,
    fontSize: "1.4rem",
  },
  textarea: {
    width: "100%",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    resize: "vertical",
    outline: "none",
  },
  row: {
    display: "flex",
    gap: 16,
    marginTop: 14,
    flexWrap: "wrap",
  },
  field: {
    flex: 1,
    minWidth: 140,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    fontSize: 13,
  },
  inputBase: {
    padding: "10px 12px",
    borderRadius: 10,
    fontSize: 14,
    outline: "none",
  },
  primaryBtn: {
    marginTop: 18,
    padding: "12px 18px",
    borderRadius: 12,
    border: "none",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  primaryBtnSmall: {
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryBtn: {
    marginTop: 10,
    padding: "8px 14px",
    borderRadius: 10,
    background: "transparent",
    cursor: "pointer",
    fontWeight: 500,
  },
  resultBox: {
    marginTop: 16,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
  },
  viewer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  code: {
    margin: 0,
    padding: 16,
    fontSize: 14,
    overflowX: "auto",
  },
  meta: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 14px",
    fontSize: 13,
    opacity: 0.8,
  },
  errorToast: {
    position: "fixed",
    bottom: 20,
    right: 20,
    background: "#7f1d1d",
    padding: "12px 16px",
    borderRadius: 12,
    color: "#fecaca",
    fontWeight: 500,
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },
  successToast: {
    position: "fixed",
    bottom: 20,
    right: 20,
    background: "#064e3b",
    padding: "12px 16px",
    borderRadius: 12,
    color: "#a7f3d0",
    fontWeight: 500,
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },
};
