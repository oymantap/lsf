import React, { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";

function App() {
  const [files, setFiles] = useState([
    { name: 'main.py', content: "print('Hello Rycl!')", language: 'python' }
  ]);
  const [activeFile, setActiveFile] = useState(0);
  const [output, setOutput] = useState("");
  const [pyodide, setPyodide] = useState(null);

  useEffect(() => {
    // Inject Pyodide script secara manual biar Vite gak pusing
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
    script.onload = async () => {
      const p = await window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/" });
      setPyodide(p);
    };
    document.body.appendChild(script);
  }, []);

  const runCode = async () => {
    if (!pyodide) {
      setOutput("Pyodide loading...");
      return;
    }
    try {
      const out = await pyodide.runPythonAsync(files[activeFile].content);
      setOutput(String(out));
    } catch (err) {
      setOutput(String(err));
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white font-sans overflow-hidden">
      <div className="flex items-center justify-between p-2 bg-gray-950 border-b border-gray-700">
        <div className="font-bold text-blue-500"><i className="fas fa-terminal"></i> LSF Editor</div>
        <button onClick={runCode} className="bg-green-600 px-4 py-1 rounded text-sm hover:bg-green-700">
          <i className="fas fa-play mr-2"></i>Run
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <Editor
            theme="vs-dark"
            language={files[activeFile].language}
            value={files[activeFile].content}
            onChange={(val) => {
              const newFiles = [...files];
              newFiles[activeFile].content = val;
              setFiles(newFiles);
            }}
            options={{ fontSize: 14, minimap: { enabled: false } }}
          />
        </div>
        <div className="w-1/3 p-4 bg-black border-l border-gray-700 overflow-y-auto">
          <div className="text-xs text-gray-500 mb-2 uppercase">Output</div>
          <pre className="text-green-400 font-mono text-sm">{output}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;

