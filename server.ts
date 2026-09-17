import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Ensure data directory exists for persistent submissions storage
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'submissions.json');

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.warn('Could not create data directory:', e);
  }
}

function getStoredSubmissions() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.warn('Error reading submissions file:', e);
  }
  return { purchaseOrders: [], contactMessages: [], feedbacks: [] };
}

function saveStoredSubmissions(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Error writing submissions file:', e);
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/data', (req, res) => {
  const submissions = getStoredSubmissions();
  res.json({ success: true, ...submissions });
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;
    if (!order || !order.id) {
      return res.status(400).json({ success: false, message: 'Invalid order data' });
    }
    const submissions = getStoredSubmissions();
    submissions.purchaseOrders = [order, ...(submissions.purchaseOrders || [])].filter(
      (item, index, self) => index === self.findIndex((t: any) => t.id === item.id)
    );
    saveStoredSubmissions(submissions);

    // If Gist token is provided in headers or body, auto-sync to GitHub Gist
    const gistToken = req.headers['x-gist-token'] || req.body.gistToken;
    const gistUrl = req.headers['x-gist-url'] || req.body.gistUrl;
    if (gistToken && gistUrl) {
      try {
        await syncToGistHelper(gistUrl, gistToken as string, submissions);
      } catch (syncErr) {
        console.warn('Background Gist sync on order failed:', syncErr);
      }
    }

    res.json({ success: true, order, purchaseOrders: submissions.purchaseOrders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const message = req.body;
    if (!message || !message.id) {
      return res.status(400).json({ success: false, message: 'Invalid message data' });
    }
    const submissions = getStoredSubmissions();
    submissions.contactMessages = [message, ...(submissions.contactMessages || [])].filter(
      (item, index, self) => index === self.findIndex((t: any) => t.id === item.id)
    );
    saveStoredSubmissions(submissions);

    const gistToken = req.headers['x-gist-token'] || req.body.gistToken;
    const gistUrl = req.headers['x-gist-url'] || req.body.gistUrl;
    if (gistToken && gistUrl) {
      try {
        await syncToGistHelper(gistUrl, gistToken as string, submissions);
      } catch (syncErr) {
        console.warn('Background Gist sync on message failed:', syncErr);
      }
    }

    res.json({ success: true, message, contactMessages: submissions.contactMessages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/feedbacks', async (req, res) => {
  try {
    const feedback = req.body;
    if (!feedback || !feedback.id) {
      return res.status(400).json({ success: false, message: 'Invalid feedback data' });
    }
    const submissions = getStoredSubmissions();
    submissions.feedbacks = [feedback, ...(submissions.feedbacks || [])].filter(
      (item, index, self) => index === self.findIndex((t: any) => t.id === item.id)
    );
    saveStoredSubmissions(submissions);

    const gistToken = req.headers['x-gist-token'] || req.body.gistToken;
    const gistUrl = req.headers['x-gist-url'] || req.body.gistUrl;
    if (gistToken && gistUrl) {
      try {
        await syncToGistHelper(gistUrl, gistToken as string, submissions);
      } catch (syncErr) {
        console.warn('Background Gist sync on feedback failed:', syncErr);
      }
    }

    res.json({ success: true, feedback, feedbacks: submissions.feedbacks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

async function syncToGistHelper(url: string, token: string, localData: any) {
  const cleanUrl = url.trim();
  const gistIdMatch = cleanUrl.match(/([a-f0-9]{32})/i);
  const gistId = gistIdMatch ? gistIdMatch[1] : 'b98509446eaf8132fc819cff8f3f7956';
  const fileMatch = cleanUrl.match(/\/([^\/?#]+\.json)/i);
  const filename = fileMatch ? fileMatch[1] : 'toysgame.json';

  // Fetch current gist content first to merge
  const getRes = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  let currentSettings = {};
  if (getRes.ok) {
    const gistData = await getRes.json();
    const targetFile = gistData.files?.[filename] || Object.values(gistData.files || {})[0];
    if (targetFile && targetFile.content) {
      try {
        currentSettings = JSON.parse(targetFile.content);
      } catch {}
    }
  }

  const merged = {
    ...currentSettings,
    purchaseOrders: [
      ...(localData.purchaseOrders || []),
      ...((currentSettings as any).purchaseOrders || []),
    ].filter((item: any, index: number, self: any[]) => index === self.findIndex((t: any) => t.id === item.id)),
    contactMessages: [
      ...(localData.contactMessages || []),
      ...((currentSettings as any).contactMessages || []),
    ].filter((item: any, index: number, self: any[]) => index === self.findIndex((t: any) => t.id === item.id)),
    feedbacks: [
      ...(localData.feedbacks || []),
      ...((currentSettings as any).feedbacks || []),
    ].filter((item: any, index: number, self: any[]) => index === self.findIndex((t: any) => t.id === item.id)),
  };

  await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: {
        [filename]: {
          content: JSON.stringify(merged, null, 2),
        },
      },
    }),
  });
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
