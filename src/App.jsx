import React, { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";

function App() {
  const [files, setFiles] = useState([{ name: 'main.py', content: "print('Python Ready')", lang: 'python' }, { name: 'index.html', content: "<h1>Hello Rycl!</h1>", lang: 'html' }]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [pyOutput, setPyOutput] = useState("");
  const [showModal, setShowModal] = useState(null); // 'preview' atau 'console'
  const [pyodide, setPyodide] = useState(null);

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
    s.onload = async () => {
      const p = await window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/", stdout: (t) => setPyOutput(prev => prev + t + "\n") });
      setPyodide(p);
    };
    document.body.appendChild(s);
  }, []);

  const runPy = async () => {
    setPyOutput("");
    setShowModal('console');
    await pyodide.runPythonAsync(files[activeIdx].content);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white font-sans">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-gray-900 border-b border-gray-800">
        <button onClick={() => document.getElementById('fi').click()} className="text-xs bg-blue-600 px-3 py-1 rounded">Upload</button>
        <input type="file" id="fi" className="hidden" onChange={(e) => {
            const f = e.target.files[0]; const r = new FileReader();
            r.onload = (e) => setFiles([...files, { name: f.name, content: e.target.result, lang: f.name.endsWith('.py') ? 'python' : 'html' }]);
            r.readAsText(f);
        }} />
        <div className="flex-grow"></div>
        {files[activeIdx].lang === 'python' ? 
          <button onClick={runPy} className="bg-green-600 px-4 py-1 rounded text-xs font-bold">RUN PYTHON</button> :
          <button onClick={() => setShowModal('preview')} className="bg-purple-600 px-4 py-1 rounded text-xs font-bold">PREVIEW WEB</button>
        }
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor theme="vs-dark" language={files[activeIdx].lang} value={files[activeIdx].content} onChange={(v) => { const f = [...files]; f[activeIdx].content = v; setFiles(f); }} />
      </div>

      {/* Modal Fullscreen */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold uppercase">{showModal === 'console' ? 'Python Console' : 'Web Preview'}</h2>
            <button onClick={() => setShowModal(null)} className="bg-red-600 px-3 py-1 rounded text-xs font-bold">CLOSE</button>
          </div>
          <div className="flex-1 bg-black border border-gray-800 rounded p-4 overflow-auto">
            {showModal === 'console' ? 
              <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">{pyOutput || "Running..."}</pre> : 
              <iframe title="prev" srcDoc={files[activeIdx].content} className="w-full h-full bg-white" />
            }
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

