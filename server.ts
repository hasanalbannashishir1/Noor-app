import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Proxy for Hadith Books
  app.get("/api/books", async (req, res) => {
    try {
      const { apiKey } = req.query;
      const params = new URLSearchParams();
      if (apiKey) params.append('apiKey', apiKey as string);
      
      const url = `https://www.hadithapi.com/public/api/books?${params.toString()}`;
      console.log(`Proxying to: ${url}`);
      const response = await fetch(url);
      const data = await response.json();
      console.log(`Books response:`, data);
      res.json(data);
    } catch (error) {
      console.error("Proxy error (books):", error);
      res.status(500).json({ error: "Failed to fetch books from Hadith API" });
    }
  });

  // API Proxy for Hadith API to bypass CORS
  app.get("/api/hadiths", async (req, res) => {
    try {
      const { apiKey, book, paginate, page, search } = req.query;
      const params = new URLSearchParams();
      if (apiKey) params.append('apiKey', apiKey as string);
      if (book) params.append('book', book as string);
      if (paginate) params.append('paginate', paginate as string);
      if (page) params.append('page', page as string);
      if (search) params.append('search', search as string);

      const url = `https://www.hadithapi.com/public/api/hadiths?${params.toString()}`;
      console.log(`Proxying to: ${url}`);
      
      const response = await fetch(url);
      const data = await response.json();
      console.log(`Hadiths response for ${book}: status=${data.status}, keys=${Object.keys(data).join(', ')}`);
      if (data.hadiths) {
        console.log(`Hadiths keys: ${Object.keys(data.hadiths).join(', ')}`);
        if (data.hadiths.data) {
          console.log(`Hadiths data count: ${data.hadiths.data.length}`);
        }
      }
      if (data.status !== 200) {
        console.warn(`API Warning: ${data.message || 'Unknown error'}`);
      }
      res.json(data);
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({ error: "Failed to fetch from Hadith API" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
