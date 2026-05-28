// Serverless function Node.js
export default async function handler(req, res) {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ error: 'Parameter judul (title) wajib diisi!' });
  }

  try {
    // Simulasi database / fetch API lirik eksternal
    // Di sini kita pakai mock data dulu, kamu bisa ganti pakai fetch() ke API asli
    const mockLyricsDatabase = {
      "bernafas tanpa kelanjutan": {
        title: "Bernafas Tanpa Kelanjutan",
        artist: "SundaScript Band",
        content: "[00:15.00] Di dalam terminal Termux yang sunyi\n[00:22.00] Kucoba compile kode ini\n[00:30.00] Mengharap JavaScript mengerti\n[00:37.00] Apa yang ada di dalam hati..."
      },
      "vibe coding": {
        title: "Vibe Coding Until Morning",
        artist: "The Homescrollers",
        content: "[00:10.00] No formal school, just scrolling around\n[00:18.00] Lost in the code, no other sound\n[00:25.00] PHP, MySQL, or React tonight\n[00:32.00] Everything's gonna be alright."
      }
    };

    const cleanQuery = title.toLowerCase().trim();
    const result = mockLyricsDatabase[cleanQuery] || {
      title: title,
      artist: "Unknown Artist",
      content: `[00:00.00] (Lirik otomatis untuk "${title}")\n\n[00:05.00] Ini adalah response dinamis dari Node.js Backend di Vercel!\n[00:12.00] Kamu bisa mengintegrasikan API lirik asli di file /api/search.js ini.`
    };

    // Return response JSON ke frontend
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Terjadi kesalahan di server backend.' });
  }
}

