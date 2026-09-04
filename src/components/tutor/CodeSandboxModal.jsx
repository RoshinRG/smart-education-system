import React, { useState } from 'react';
import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';

const PRESETS = {
  js_fib: {
    title: 'Fibonacci Sequence (JS)',
    code: `// Calculate Fibonacci Numbers\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nfor (let i = 0; i < 10; i++) {\n  console.log(\`Fibonacci(\${i}) = \${fibonacci(i)}\`);\n}`,
  },
  js_quicksort: {
    title: 'QuickSort Algorithm (JS)',
    code: `// QuickSort Implementation\nfunction quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[arr.length - 1];\n  const left = [];\n  const right = [];\n  for (let i = 0; i < arr.length - 1; i++) {\n    if (arr[i] < pivot) left.push(arr[i]);\n    else right.push(arr[i]);\n  }\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}\n\nconst numbers = [34, 7, 23, 32, 5, 62];\nconsole.log("Original Array:", numbers);\nconsole.log("Sorted Array:  ", quickSort(numbers));`,
  },
  py_basics: {
    title: 'List Comprehension (Python syntax demo)',
    code: `# Python List Comprehension simulation\nnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nevens = [n for n in numbers if n % 2 == 0]\nsquares = [n**2 for n in numbers]\nprint(f"Evens: {evens}")\nprint(f"Squares: {squares}")`,
  },
};

export default function CodeSandboxModal({ onClose }) {
  const [code, setCode] = useState(PRESETS.js_fib.code);
  const [outputLogs, setOutputLogs] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleRunCode = () => {
    setIsExecuting(true);
    const logs = [];

    // Custom console wrapper to capture console.log outputs
    const customConsole = {
      log: (...args) => {
        logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      },
      error: (...args) => {
        logs.push('[Error] ' + args.join(' '));
      },
      warn: (...args) => {
        logs.push('[Warning] ' + args.join(' '));
      },
    };

    try {
      // Safely evaluate JS code using Function constructor with custom console
      const runFn = new Function('console', 'print', code);
      runFn(customConsole, customConsole.log);
      
      if (logs.length === 0) {
        logs.push('✅ Code executed successfully with no printed output.');
      }
      setOutputLogs(logs);
    } catch (err) {
      setOutputLogs([`❌ Runtime Error: ${err.message}`]);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="code-sandbox-card">
      <div className="sandbox-header mb-3">
        <div>
          <h3 className="card-title">💻 AI Live Code Sandbox</h3>
          <p className="card-subtitle">Test and execute code snippets directly in your browser</p>
        </div>
        <div className="sandbox-presets">
          <label className="text-sm font-semibold text-subtle mr-2">Presets:</label>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setCode(PRESETS.js_fib.code)}
          >
            Fibonacci
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setCode(PRESETS.js_quicksort.code)}
          >
            QuickSort
          </button>
        </div>
      </div>

      <div className="sandbox-body">
        {/* Code Editor */}
        <div className="editor-container">
          <div className="editor-top-bar">
            <span className="editor-lang-tag">JavaScript / ES6</span>
            <button
              className="btn btn-ghost btn-sm text-xs"
              onClick={() => setCode('')}
            >
              Clear Editor
            </button>
          </div>
          <textarea
            className="code-editor-textarea"
            rows="12"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Type or paste code here..."
            spellCheck="false"
          />
        </div>

        {/* Controls */}
        <div className="sandbox-actions mt-3 mb-3">
          <Button variant="primary" onClick={handleRunCode} loading={isExecuting}>
            ▶️ Run Code
          </Button>
          <Button variant="secondary" onClick={() => setOutputLogs([])}>
            🧹 Clear Console
          </Button>
        </div>

        {/* Console Log Output */}
        <div className="console-container">
          <div className="console-header">
            <span>🖥️ Console Log Output</span>
            <span className="console-status">{outputLogs.length} line(s)</span>
          </div>
          <div className="console-terminal">
            {outputLogs.length === 0 ? (
              <span className="text-muted italic">Click "▶️ Run Code" to execute code and view output here...</span>
            ) : (
              outputLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`console-line ${log.startsWith('❌') ? 'console-err' : log.startsWith('[Warning]') ? 'console-warn' : ''}`}
                >
                  <span className="console-prompt">&gt;</span> {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
