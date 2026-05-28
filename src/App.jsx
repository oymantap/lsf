import React, { useState } from 'react';

export default function App() {
  const [query, setQuery] = useState('');
  const [lyrics, setLyrics] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    setLyrics(null);
    
    try {
      // Nembak ke backend Node.js Serverless kita sendiri
      const res = await fetch(`/api/search?title=${encodeURIComponent(query)}`);
      const data = await res.json();
      setLyrics(data);
    } catch (err) {
      setLyrics({ error: "Gagal mengambil lirik." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen flex flex-col items-center p-6 max-w-md mx-auto">
      <header class="text-center my-6">
        <h1 class="text-3xl font-extrabold text-cyan-400 tracking-tight">VibeLyrics 🎧</h1>
        <p class="text-xs text-slate-400 mt-1">React + Node.js Serverless on Vercel</p>
      </header>

      <form onSubmit={handleSearch} class="w-full flex gap-2 mb-6">
        <input 
          type="text" 
          placeholder="Ketik judul lagu / musisi..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          class="flex-1 px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-400 text-sm"
        />
        <button type="submit" class="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm transition">
          Cari
        </button>
      </form>

      {loading && <p class="text-cyan-400 animate-pulse text-sm">Mencari lirik di backend...</p>}

      {lyrics && (
        <div class="w-full bg-slate-800/60 backdrop-blur rounded-xl p-5 border border-slate-700/50 shadow-xl max-h-[60vh] overflow-y-auto">
          {lyrics.error ? (
            <p class="text-red-400 text-center text-sm">{lyrics.error}</p>
          ) : (
            <>
              <h2 class="text-lg font-bold text-cyan-300 text-center">{lyrics.title}</h2>
              <p class="text-xs text-slate-400 text-center mb-4">by {lyrics.artist}</p>
              <pre class="whitespace-pre-line text-sm text-center font-sans text-slate-200 leading-relaxed tracking-wide">
                {lyrics.content}
              </pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}

