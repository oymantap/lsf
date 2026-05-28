import React, { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";

function App() {
  const [files, setFiles] = useState([{ name: 'main.py', content: "print('Python Ready')", lang: 'python' }, { name: 'index.html', content: "<h1>Hello Rycl!</h1>", lang: 'html' }]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [pyOutput, setPyOutput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
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

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => setFiles([...files, { name: file.name, content: e.target.result, lang: file.name.endsWith('.py') ? 'python' : 'html' }]);
    reader.readAsText(file);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white font-sans overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-gray-900 border-b border-gray-800">
        <button onClick={() => document.getElementById('fi').click()} className="text-xs bg-blue-600 px-3 py-1 rounded">Upload</button>
        <input type="file" id="fi" className="hidden" onChange={handleUpload} />
        <button onClick={() => { const b = new Blob([files[activeIdx].content]); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = files[activeIdx].name; a.click(); }} className="text-xs bg-gray-700 px-3 py-1 rounded">DL</button>
        <div className="flex-grow"></div>
        {files[activeIdx].lang === 'python' ? (
          <button onClick={() => { setPyOutput(""); pyodide.runPythonAsync(files[activeIdx].content); }} className="bg-green-600 px-4 py-1 rounded text-xs font-bold">RUN PY</button>
        ) : (
          <button onClick={() => setShowPreview(true)} className="bg-purple-600 px-4 py-1 rounded text-xs font-bold">PREVIEW WEB</button>
        )}
      </div>

      {/* Editor & Console */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex bg-gray-900 border-b border-gray-800 overflow-x-auto">
          {files.map((f, i) => <button key={i} onClick={() => setActiveIdx(i)} className={`px-4 py-1 text-xs ${activeIdx === i ? 'bg-gray-800 text-blue-400' : 'text-gray-500'}`}>{f.name}</button>)}
        </div>
        <div className="flex-1">
          <Editor theme="vs-dark" language={files[activeIdx].lang} value={files[activeIdx].content} onChange={(v) => { const f = [...files]; f[activeIdx].content = v; setFiles(f); }} />
        </div>
        {files[activeIdx].lang === 'python' && <pre className="h-32 bg-black border-t border-gray-800 p-2 text-green-400 text-xs font-mono overflow-auto">{pyOutput}</pre>}
      </div>

      {/* Fullscreen Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex justify-between items-center p-2 bg-gray-100 border-b border-gray-300">
            <span className="text-black text-sm font-bold">PREVIEW: {files[activeIdx].name}</span>
            <button onClick={() => setShowPreview(false)} className="bg-red-600 px-3 py-1 rounded text-white text-xs font-bold"><i className="fas fa-times"></i> CLOSE</button>
          </div>
          <iframe title="prev" srcDoc={files[activeIdx].content} className="flex-1 w-full" />
        </div>
      )}
    </div>
  );
}

export default App;

