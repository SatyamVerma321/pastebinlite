import { useState } from "react";

function App() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState(300);
  const [maxViews, setMaxViews] = useState(5);
  const [result, setResult] = useState(null);
  const [pasteId, setPasteId] = useState("");
  const [loadedPaste, setLoadedPaste] = useState(null);
  const [error, setError] = useState("");

  const createPaste = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content,
          ttl_seconds: Number(ttl),
          max_views: Number(maxViews)
        })
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError("❌ Failed to create paste. Is backend running?");
    }
  };

  const fetchPaste = async () => {
    setError("");
    try {
      const res = await fetch(`http://localhost:8080/api/pastes/${pasteId}`);

      if (!res.ok) {
        throw new Error("Paste not found or expired");
      }

      const data = await res.json();
      setLoadedPaste(data);
    } catch (e) {
      setError("❌ Paste not found or expired");
      setLoadedPaste(null);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>📋 Pastebin Lite</h1>

      {/* CREATE */}
      <h2>Create Paste</h2>
      <textarea
        rows="6"
        style={{ width: "100%" }}
        placeholder="Enter your text..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div style={{ marginTop: 10 }}>
        TTL (seconds):{" "}
        <input
          type="number"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
        />
        &nbsp;&nbsp; Max Views:{" "}
        <input
          type="number"
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value)}
        />
      </div>

      <button onClick={createPaste} style={{ marginTop: 10 }}>
        Create Paste
      </button>

      {result && (
        <div style={{ marginTop: 15 }}>
          ✅ Paste created:
          <br />
          <b>ID:</b> {result.id}
          <br />
          <b>URL:</b>{" "}
          <a href={result.url} target="_blank" rel="noreferrer">
            {result.url}
          </a>
        </div>
      )}

      <hr />

      {/* FETCH */}
      <h2>View Paste</h2>
      <input
        placeholder="Enter Paste ID"
        value={pasteId}
        onChange={(e) => setPasteId(e.target.value)}
      />
      <button onClick={fetchPaste} style={{ marginLeft: 10 }}>
        Load
      </button>

      {loadedPaste && (
        <div style={{ marginTop: 15 }}>
          <pre style={{ background: "#f4f4f4", padding: 15 }}>
            {loadedPaste.content}
          </pre>
          <p>
            ⏳ Expires At: {loadedPaste.expiresAt || "Never"}
            <br />
            👀 Remaining Views:{" "}
            {loadedPaste.remainingViews === null
              ? "Unlimited"
              : loadedPaste.remainingViews}
          </p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
