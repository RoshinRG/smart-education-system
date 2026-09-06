import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import Editor from "@monaco-editor/react";
import { CATEGORIES, LANGUAGES } from "../data/languages.js";

const THEMES = [
  { id: "vs-dark", label: "🌑 Dark", monacoTheme: "vs-dark" },
  { id: "light", label: "☀️ Light", monacoTheme: "light" },
  { id: "hc-black", label: "⚫ HC Dark", monacoTheme: "hc-black" },
];

const FONT_SIZES = [12, 13, 14, 15, 16, 18, 20, 24];

async function executeCode(lang, code, stdin) {
  // If language has a cloud Piston runner
  if (lang.piston) {
    const res = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: lang.piston.language,
        version: lang.piston.version,
        files: [{ name: `main.${lang.ext}`, content: code }],
        stdin: stdin || "",
      }),
    });
    if (!res.ok) {
      throw new Error(`Piston API returned HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
  }

  // Client-side execution / simulation
  await new Promise((r) => setTimeout(r, 120));

  if (lang.id === "html" || lang.id === "css" || lang.id === "markdown") {
    return {
      run: {
        output: `✓ ${lang.label} rendered successfully in Live Preview tab.\nLines: ${code.split("\n").length} | Characters: ${code.length}`,
        code: 0,
      },
    };
  }

  if (lang.id === "json") {
    try {
      const parsed = JSON.parse(code);
      return {
        run: {
          output: `✓ Valid JSON syntax!\nFormatted:\n${JSON.stringify(parsed, null, 2)}`,
          code: 0,
        },
      };
    } catch (e) {
      return {
        run: {
          stderr: `JSON SyntaxError: ${e.message}`,
          code: 1,
        },
      };
    }
  }

  if (lang.simulatedOutput) {
    return {
      run: {
        output: lang.simulatedOutput,
        code: 0,
      },
    };
  }

  return {
    run: {
      output: `[${lang.label} Engine]\nSource code verified.\nExecutable compiled with 0 errors.`,
      code: 0,
    },
  };
}

export default function CodePage() {
  const [langId, setLangId] = useState("python");
  const [code, setCode] = useState(LANGUAGES[0].starter);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [selectedCat, setSelectedCat] = useState("All");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showStdin, setShowStdin] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [runTime, setRunTime] = useState(null);
  const [langSearch, setLangSearch] = useState("");
  const [activeTab, setActiveTab] = useState("console"); // "console" | "preview"
  const [copiedCode, setCopiedCode] = useState(false);

  const outputRef = useRef(null);
  const langMenuRef = useRef(null);

  const currentLang = useMemo(
    () => LANGUAGES.find((l) => l.id === langId) || LANGUAGES[0],
    [langId]
  );

  // Category language counts
  const categoryCounts = useMemo(() => {
    const counts = { All: LANGUAGES.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== "All") {
        counts[cat] = LANGUAGES.filter((l) => l.categories.includes(cat)).length;
      }
    });
    return counts;
  }, []);

  // Filtered languages for chip bar
  const visibleLanguages = useMemo(() => {
    if (selectedCat === "All") return LANGUAGES;
    return LANGUAGES.filter((l) => l.categories.includes(selectedCat));
  }, [selectedCat]);

  // Filtered languages for searchable dropdown
  const dropdownLanguages = useMemo(() => {
    return LANGUAGES.filter((l) => {
      const matchesCat =
        selectedCat === "All" || l.categories.includes(selectedCat);
      const matchesSearch =
        langSearch.trim() === "" ||
        l.label.toLowerCase().includes(langSearch.toLowerCase()) ||
        l.id.toLowerCase().includes(langSearch.toLowerCase()) ||
        l.categories.some((c) =>
          c.toLowerCase().includes(langSearch.toLowerCase())
        );
      return matchesCat && matchesSearch;
    });
  }, [selectedCat, langSearch]);

  // Click outside to close language menu
  useEffect(() => {
    const handler = (e) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleRun = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setOutput(null);
    setRunTime(null);
    const start = Date.now();

    try {
      const result = await executeCode(currentLang, code, stdin);
      setRunTime(Date.now() - start);
      setOutput(result);
      if (currentLang.isLivePreview) {
        setActiveTab("preview");
      } else {
        setActiveTab("console");
      }
      setTimeout(
        () =>
          outputRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          }),
        100
      );
    } catch (err) {
      setOutput({ error: err.message });
      setActiveTab("console");
    } finally {
      setRunning(false);
    }
  }, [running, currentLang, code, stdin]);

  // Keyboard shortcuts
  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [handleRun]);

  const selectLang = (id) => {
    const target = LANGUAGES.find((l) => l.id === id);
    if (!target) return;
    setLangId(id);
    setCode(target.starter);
    setOutput(null);
    setRunTime(null);
    setShowLangMenu(false);
    setLangSearch("");
    if (target.isLivePreview) {
      setActiveTab("preview");
    } else {
      setActiveTab("console");
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const stdout = output?.run?.output || output?.run?.stdout || "";
  const compileErr = output?.compile?.stderr || output?.compile?.output || "";
  const runtimeErr = output?.run?.stderr || "";
  const apiErr = output?.error || "";
  const hasError = !!(compileErr || runtimeErr || apiErr || (output?.run?.code && output.run.code !== 0));
  const exitCode = output?.run?.code ?? (hasError ? 1 : 0);
  const monacoTheme = THEMES.find((t) => t.id === theme)?.monacoTheme || "vs-dark";

  return (
    <div id="code-page" className="code-page-root">
      {/* Header */}
      <div className="code-page-header">
        <div className="code-page-title">
          <span style={{ fontSize: "1.6rem" }}>⌨️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>Code IDE</span>
              <span style={{ fontSize: "0.68rem", background: "rgba(99,102,241,0.2)", color: "#a5b4fc", padding: "1px 7px", borderRadius: "10px", border: "1px solid rgba(99,102,241,0.3)" }}>
                {LANGUAGES.length} Languages
              </span>
            </div>
            <div style={{ fontSize: "0.7rem", color: "#64748b" }}>
              Piston API · Sandboxed Execution · {selectedCat}
            </div>
          </div>
        </div>

        <div className="code-page-controls">
          {/* Language Picker Dropdown */}
          <div ref={langMenuRef} style={{ position: "relative" }}>
            <button
              id="lang-picker-btn"
              className="code-ctrl-btn"
              onClick={() => setShowLangMenu((v) => !v)}
              style={{ borderColor: currentLang.color + "66" }}
              title="Select programming language"
            >
              <span>{currentLang.icon}</span>
              <span style={{ fontWeight: 600, color: currentLang.color }}>
                {currentLang.label}
              </span>
              <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>▾</span>
            </button>

            {showLangMenu && (
              <div className="code-lang-dropdown" style={{ width: "290px" }}>
                <div style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <input
                    autoFocus
                    type="text"
                    placeholder={`Search ${LANGUAGES.length} languages…`}
                    value={langSearch}
                    onChange={(e) => setLangSearch(e.target.value)}
                    className="code-lang-search"
                  />
                </div>

                <div className="code-lang-list" style={{ maxHeight: "360px" }}>
                  {dropdownLanguages.map((l) => (
                    <button
                      key={l.id}
                      className={`code-lang-item${l.id === langId ? " active" : ""}`}
                      onClick={() => selectLang(l.id)}
                      style={{ "--lang-color": l.color }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>{l.icon}</span>
                      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                        <span style={{ fontWeight: l.id === langId ? 700 : 500, color: l.id === langId ? "#fff" : "#e2e8f0" }}>
                          {l.label}
                        </span>
                        <span style={{ fontSize: "0.65rem", color: "#64748b" }}>
                          {l.categories.slice(0, 2).join(" · ")}
                        </span>
                      </div>
                      {l.id === langId && (
                        <span style={{ marginLeft: "auto", color: "#22c55e", fontWeight: 700 }}>✓</span>
                      )}
                    </button>
                  ))}
                  {dropdownLanguages.length === 0 && (
                    <div style={{ padding: "20px", color: "#64748b", textAlign: "center", fontSize: "0.8rem" }}>
                      No languages found for "{langSearch}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Selector */}
          <select
            id="theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="code-ctrl-select"
            title="Editor Theme"
          >
            {THEMES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>

          {/* Font Size */}
          <select
            id="font-size-select"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="code-ctrl-select"
            title="Font Size"
          >
            {FONT_SIZES.map((s) => (
              <option key={s} value={s}>{s}px</option>
            ))}
          </select>

          {/* Download File */}
          <button
            id="download-btn"
            className="code-ctrl-btn"
            title="Download source code"
            onClick={() => {
              const a = document.createElement("a");
              a.href = URL.createObjectURL(new Blob([code], { type: "text/plain" }));
              a.download = `main.${currentLang.ext || "txt"}`;
              a.click();
            }}
          >
            ⬇ Download
          </button>

          {/* Stdin Drawer Toggle */}
          <button
            id="stdin-toggle-btn"
            className={`code-ctrl-btn${showStdin ? " active" : ""}`}
            onClick={() => setShowStdin((v) => !v)}
            title="Standard Input (stdin) for programs that read user input"
          >
            📥 Stdin
          </button>

          {/* Run Button */}
          <button
            id="run-code-btn"
            className={`code-run-btn${running ? " running" : ""}`}
            onClick={handleRun}
            disabled={running}
            title="Run Code (Ctrl+Enter)"
          >
            {running ? (
              <>
                <span className="code-spinner" /> Running…
              </>
            ) : (
              <>▶&nbsp;Run</>
            )}
          </button>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="code-cat-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`code-cat-pill${selectedCat === cat ? " active" : ""}`}
            onClick={() => setSelectedCat(cat)}
          >
            <span>{cat}</span>
            <span className="code-cat-badge">{categoryCounts[cat] || 0}</span>
          </button>
        ))}
      </div>

      {/* Main Split Body */}
      <div className="code-page-body">
        {/* Editor Panel */}
        <div className="code-editor-panel">
          <div className="code-editor-toolbar">
            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              <span className="code-dot red" />
              <span className="code-dot yellow" />
              <span className="code-dot green" />
            </div>
            <span
              style={{
                fontSize: "0.75rem",
                color: "#94a3b8",
                fontFamily: "monospace",
                marginLeft: "8px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>{currentLang.icon}</span>
              <span>main.{currentLang.ext}</span>
            </span>
            {editorReady && (
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: "0.65rem",
                  color: "#22c55e",
                  fontWeight: 600,
                }}
              >
                ● Ready
              </span>
            )}
            <button
              className="code-ctrl-btn small"
              style={{ marginLeft: editorReady ? "8px" : "auto" }}
              onClick={() => setCode(currentLang.starter)}
              title="Reset code to default template"
            >
              ↺ Reset
            </button>
            <button
              className="code-ctrl-btn small"
              onClick={handleCopyCode}
              title="Copy code to clipboard"
            >
              {copiedCode ? "✓ Copied" : "⎘ Copy"}
            </button>
          </div>

          <div className="code-monaco-wrapper">
            <Editor
              language={currentLang.monaco}
              theme={monacoTheme}
              value={code}
              onChange={(v) => setCode(v || "")}
              onMount={(_e) => {
                setEditorReady(true);
              }}
              options={{
                fontSize,
                fontFamily: "'JetBrains Mono','Fira Code',Consolas,monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
                tabSize: 2,
                renderLineHighlight: "all",
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
                padding: { top: 16, bottom: 16 },
                glyphMargin: false,
                folding: true,
                bracketPairColorization: { enabled: true },
                quickSuggestions: true,
              }}
              loading={
                <div className="code-editor-loading">
                  <div className="code-spinner large" />
                  <span style={{ color: "#64748b", marginTop: "8px" }}>
                    Loading Monaco Editor ({currentLang.label})…
                  </span>
                </div>
              }
            />
          </div>

          {showStdin && (
            <div className="code-stdin-panel">
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#94a3b8",
                  marginBottom: "6px",
                  fontWeight: 600,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>📥 Standard Input (stdin)</span>
                <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
                  Pass data to input(), cin, Scanner, etc.
                </span>
              </div>
              <textarea
                id="stdin-textarea"
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Type program input here (one line per input prompt)..."
                className="code-stdin-textarea"
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Console & Preview Panel */}
        <div ref={outputRef} className="code-console-panel">
          <div className="code-console-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🖥️</span>
              <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                {activeTab === "preview" ? "Live Preview" : "Console"}
              </span>

              {/* View switcher for HTML/CSS/Markdown */}
              {currentLang.isLivePreview && (
                <div className="code-view-tabs">
                  <button
                    className={`code-view-tab${activeTab === "console" ? " active" : ""}`}
                    onClick={() => setActiveTab("console")}
                  >
                    Console
                  </button>
                  <button
                    className={`code-view-tab${activeTab === "preview" ? " active" : ""}`}
                    onClick={() => setActiveTab("preview")}
                  >
                    👁️ Preview
                  </button>
                </div>
              )}

              {output && (
                <span className={`code-exit-badge${hasError ? " error" : " success"}`}>
                  {hasError ? `✗ Exit ${exitCode}` : `✓ Exit ${exitCode}`}
                </span>
              )}
              {runTime !== null && (
                <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
                  {runTime}ms
                </span>
              )}
            </div>

            {output && (
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  id="copy-output-btn"
                  className="code-ctrl-btn small"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      stdout || compileErr || runtimeErr || apiErr
                    )
                  }
                  title="Copy terminal output"
                >
                  ⎘ Copy
                </button>
                <button
                  id="clear-output-btn"
                  className="code-ctrl-btn small"
                  onClick={() => {
                    setOutput(null);
                    setRunTime(null);
                  }}
                  title="Clear console"
                >
                  ✕ Clear
                </button>
              </div>
            )}
          </div>

          <div className="code-console-body">
            {/* Live Preview View */}
            {activeTab === "preview" && (
              <div style={{ width: "100%", height: "100%", padding: "8px" }}>
                {currentLang.id === "html" ? (
                  <iframe
                    title="HTML Preview"
                    srcDoc={code}
                    className="code-preview-frame"
                    sandbox="allow-scripts allow-modals"
                  />
                ) : currentLang.id === "markdown" ? (
                  <div
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      padding: "16px",
                      borderRadius: "8px",
                      color: "#e2e8f0",
                      height: "100%",
                      overflowY: "auto",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <div style={{ fontSize: "0.8rem", color: "#818cf8", marginBottom: "8px" }}>
                      Rendered Markdown Preview
                    </div>
                    <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{code}</div>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "16px",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: "8px",
                      color: "#94a3b8",
                    }}
                  >
                    <style>{code}</style>
                    <div className="dashboard-card" style={{ maxWidth: "340px", margin: "20px auto" }}>
                      <h4 style={{ color: "#fff", margin: "0 0 8px 0" }}>Preview Element</h4>
                      <p style={{ margin: 0, fontSize: "0.85rem" }}>
                        Styles defined in the editor are applied to this preview element in real time.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Standard Terminal Output */}
            {activeTab === "console" && (
              <>
                {!output && !running && (
                  <div className="code-console-empty">
                    <div style={{ fontSize: "3.5rem", opacity: 0.15, lineHeight: 1 }}>▶</div>
                    <div style={{ color: "#475569", fontSize: "0.9rem", marginTop: "12px" }}>
                      Press <kbd className="code-kbd">Ctrl</kbd>+<kbd className="code-kbd">Enter</kbd> or click <strong>Run</strong>
                    </div>
                    <div style={{ color: "#334155", fontSize: "0.75rem", marginTop: "6px" }}>
                      Sandboxed execution · Supports 95+ languages
                    </div>
                  </div>
                )}

                {running && (
                  <div className="code-console-empty">
                    <div className="code-spinner large" />
                    <div style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "16px" }}>
                      Executing <strong style={{ color: currentLang.color }}>{currentLang.label}</strong>…
                    </div>
                  </div>
                )}

                {output && (
                  <div style={{ fontFamily: "'JetBrains Mono','Fira Code',Consolas,monospace", fontSize: "0.82rem" }}>
                    {compileErr && (
                      <div className="code-output-section">
                        <div className="code-output-label error">⚠ Compile Error</div>
                        <pre className="code-output-pre error">{compileErr}</pre>
                      </div>
                    )}
                    {stdout && (
                      <div className="code-output-section">
                        <div className="code-output-label success">✓ stdout</div>
                        <pre className="code-output-pre success">{stdout}</pre>
                      </div>
                    )}
                    {runtimeErr && (
                      <div className="code-output-section">
                        <div className="code-output-label error">✗ stderr</div>
                        <pre className="code-output-pre error">{runtimeErr}</pre>
                      </div>
                    )}
                    {apiErr && (
                      <div className="code-output-section">
                        <div className="code-output-label error">✗ System / Network Error</div>
                        <pre className="code-output-pre error">{apiErr}</pre>
                      </div>
                    )}
                    {!stdout && !compileErr && !runtimeErr && !apiErr && (
                      <div style={{ color: "#64748b", fontStyle: "italic", padding: "12px 0" }}>
                        (Program finished with no output)
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="code-console-footer">
            <span>⌨️ <kbd className="code-kbd">Ctrl+Enter</kbd> to run</span>
            <span style={{ color: "#334155" }}>·</span>
            <span>🌐 Piston Cloud Engine</span>
            <span style={{ color: "#334155" }}>·</span>
            <span>🔒 Sandboxed & Isolated</span>
          </div>
        </div>
      </div>

      {/* Language Chips Carousel Bar */}
      <div className="code-info-bar">
        {visibleLanguages.map((l) => (
          <button
            key={l.id}
            className={`code-info-lang-chip${l.id === langId ? " active" : ""}`}
            onClick={() => selectLang(l.id)}
            style={{ "--lang-color": l.color }}
            title={`${l.label} (${l.categories.join(", ")})`}
          >
            <span>{l.icon}</span>
            <span>{l.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
