import React, { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";

function App() {
  const [files, setFiles] = useState([
    { name: 'main.py', content: "print('Python Runner Aktif')", lang: 'python' },
    { name: 'index.html', content: "<h1>Web Preview</h1>", lang: 'html' }
  ]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [pyOutput, setPyOutput] = useState("");
  const [pyodide, setPyodide] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
    script.onload = async () => {
      const p = await window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/", stdout: (t) => setPyOutput(prev => prev + t + "\n") });
      setPyodide(p);
    };
    document.body.appendChild(script);
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => setFiles([...files, { name: file.name, content: e.target.result, lang: file.name.endsWith('.py') ? 'python' : 'html' }]);
    reader.readAsText(file);
  };

  const downloadFile = () => {
    const blob = new Blob([files[activeIdx].content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = files[activeIdx].name; a.click();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      {/* Toolbar */}
      <div className="flex gap-2 p-2 border-b border-gray-800 bg-gray-900">
        <button onClick={() => document.getElementById('fileInput').click()} className="text-xs bg-blue-600 px-3 py-1 rounded">Upload</button>
        <input type="file" id="fileInput" className="hidden" onChange={handleUpload} />
        <button onClick={downloadFile} className="text-xs bg-gray-700 px-3 py-1 rounded">Download</button>
        {files[activeIdx].lang === 'python' ? 
          <button onClick={() => { setPyOutput(""); pyodide.runPythonAsync(files[activeIdx].content); }} className="text-xs bg-green-600 px-3 py-1 rounded">Run Python</button> :
          <div className="text-xs text-yellow-500 py-1">Web Mode (Auto-Preview)</div>
        }
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 overflow-x-auto">
        {files.map((f, i) => (
          <button key={i} onClick={() => setActiveIdx(i)} className={`px-4 py-1 text-xs ${activeIdx === i ? 'bg-gray-800' : ''}`}>{f.name}</button>
        ))}
      </div>

      {/* Split View */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1">
          <Editor theme="vs-dark" language={files[activeIdx].lang} value={files[activeIdx].content} onChange={(v) => {
            const f = [...files]; f[activeIdx].content = v; setFiles(f);
          }} />
        </div>
        <div className="w-full md:w-1/2 border-l border-gray-800 bg-black p-2 overflow-auto">
          {files[activeIdx].lang === 'python' ? <pre className="text-green-400 text-xs">{pyOutput}</pre> : 
          <iframe title="preview" srcDoc={files[activeIdx].content} className="w-full h-full bg-white text-black" />}
        </div>
      </div>
    </div>
  );
}

export default App;

