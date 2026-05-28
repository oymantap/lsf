import React, { useState } from 'react';
import Editor from "@monaco-editor/react";

function App() {
  const [files, setFiles] = useState([
    { name: 'main.py', content: "print('Hello Rycl!')", language: 'python' },
    { name: 'index.html', content: "<h1>Vibe Coding</h1>", language: 'html' }
  ]);
  const [activeFile, setActiveFile] = useState(0);
  const [output, setOutput] = useState("");

  const updateContent = (val) => {
    const newFiles = [...files];
    newFiles[activeFile].content = val;
    setFiles(newFiles);
  };

  const runCode = async () => {
    if (files[activeFile].language === 'python') {
      const { loadPyodide } = await import("pyodide");
      const pyodide = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/" });
      const out = await pyodide.runPythonAsync(files[activeFile].content);
      setOutput(String(out));
    } else {
      setOutput("Preview mode for HTML not implemented yet.");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white font-sans overflow-hidden">
      {/* Navbar */}
      <div className="flex items-center justify-between p-2 bg-gray-950 border-b border-gray-700">
        <div className="font-bold text-blue-500"><i className="fas fa-terminal"></i> LSF Editor</div>
        <button onClick={runCode} className="bg-green-600 px-4 py-1 rounded text-sm hover:bg-green-700">
          <i className="fas fa-play mr-2"></i>Run
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-950 border-b border-gray-700">
        {files.map((file, idx) => (
          <button 
            key={idx} 
            onClick={() => setActiveFile(idx)}
            className={`px-4 py-2 text-sm ${activeFile === idx ? 'bg-gray-800 border-t-2 border-blue-500' : 'text-gray-500'}`}
          >
            {file.name}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 border-r border-gray-700">
          <Editor
            theme="vs-dark"
            language={files[activeFile].language}
            value={files[activeFile].content}
            onChange={updateContent}
            options={{ fontSize: 14, minimap: { enabled: false } }}
          />
        </div>
        <div className="w-1/3 p-4 bg-black overflow-y-auto">
          <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">Console Output</div>
          <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;

