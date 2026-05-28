import React, { useState, useEffect, useRef } from 'react';
import Editor from "@monaco-editor/react";

function App() {
  const [code, setCode] = useState("print('Hello Rycl!')");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(true);
  const pyodideRef = useRef(null);

  useEffect(() => {
    const initPyodide = async () => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
      script.onload = async () => {
        const pyodide = await window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/" });
        pyodideRef.current = pyodide;
        setLoading(false);
      };
      document.body.appendChild(script);
    };
    initPyodide();
  }, []);

  const runCode = async () => {
    if (!pyodideRef.current) return;
    try {
      const result = await pyodideRef.current.runPythonAsync(code);
      setOutput(result !== undefined ? String(result) : "Process finished.");
    } catch (err) {
      setOutput(String(err));
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCode(e.target.result);
      reader.readAsText(file);
    }
  };

  return (
    <div className="h-screen flex flex-col p-4 gap-4">
      <header className="flex justify-between items-center">
        <h1 className="font-bold text-blue-400"><i className="fas fa-code"></i> Rycl Editor</h1>
        <div className="flex gap-2">
          <input type="file" id="file" className="hidden" onChange={handleUpload} />
          <label htmlFor="file" className="bg-purple-600 px-3 py-1 rounded cursor-pointer text-sm">Upload</label>
          <button onClick={() => {
            const blob = new Blob([code], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = 'code.py'; a.click();
          }} className="bg-gray-700 px-3 py-1 rounded text-sm">DL</button>
          <button onClick={runCode} className="bg-green-600 px-4 py-1 rounded text-sm font-bold" disabled={loading}>
            {loading ? "..." : "Run"}
          </button>
        </div>
      </header>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Editor theme="vs-dark" language="python" value={code} onChange={setCode} options={{minimap: {enabled: false}}} />
        <pre className="bg-black p-4 rounded border border-gray-800 overflow-auto text-green-400">{output}</pre>
      </div>
    </div>
  );
}

export default App;

