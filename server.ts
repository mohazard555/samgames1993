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
const GIST_CONFIG_FILE = path.join(DATA_DIR, 'gist_config.json');

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

function getStoredGistConfig(): { gistToken: string; gistUrl: string } {
  try {
    if (fs.existsSync(GIST_CONFIG_FILE)) {
      const content = fs.readFileSync(GIST_CONFIG_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.warn('Error reading gist config:', e);
  }
  return {
    gistToken: process.env.GIST_TOKEN || '',
    gistUrl: process.env.GIST_URL || 'https://gist.githubusercontent.com/mohazard555/b98509446eaf8132fc819cff8f3f7956/raw/toysgame.json',
  };
}

function saveStoredGistConfig(config: { gistToken?: string; gistUrl?: string }) {
  try {
    const current = getStoredGistConfig();
    const updated = {
      gistToken: config.gistToken !== undefined ? config.gistToken : current.gistToken,
      gistUrl: config.gistUrl !== undefined ? config.gistUrl : current.gistUrl,
    };
    fs.writeFileSync(GIST_CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return updated;
  } catch (e) {
    console.warn('Error writing gist config:', e);
    return config;
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

// Gist Configuration Endpoints
app.get('/api/gist-config', (req, res) => {
  const config = getStoredGistConfig();
  res.json({
    gistUrl: config.gistUrl || '',
    hasToken: Boolean(config.gistToken && config.gistToken.length > 5),
  });
});

app.post('/api/gist-config', (req, res) => {
  const { gistToken, gistUrl } = req.body;
  const updated = saveStoredGistConfig({ gistToken, gistUrl });
  res.json({ success: true, message: 'تم حفظ إعدادات الربط السحابي على الخادم بنجاح' });
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

    // Auto-sync to GitHub Gist using request or server stored config
    const storedGist = getStoredGistConfig();
    const gistToken = req.headers['x-gist-token'] || req.body.gistToken || storedGist.gistToken;
    const gistUrl = req.headers['x-gist-url'] || req.body.gistUrl || storedGist.gistUrl;
    if (gistToken && gistUrl) {
      syncToGistHelper(gistUrl, gistToken as string, submissions).catch((syncErr) =>
        console.warn('Background Gist sync on order failed:', syncErr)
      );
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

    const storedGist = getStoredGistConfig();
    const gistToken = req.headers['x-gist-token'] || req.body.gistToken || storedGist.gistToken;
    const gistUrl = req.headers['x-gist-url'] || req.body.gistUrl || storedGist.gistUrl;
    if (gistToken && gistUrl) {
      syncToGistHelper(gistUrl, gistToken as string, submissions).catch((syncErr) =>
        console.warn('Background Gist sync on message failed:', syncErr)
      );
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

    const storedGist = getStoredGistConfig();
    const gistToken = req.headers['x-gist-token'] || req.body.gistToken || storedGist.gistToken;
    const gistUrl = req.headers['x-gist-url'] || req.body.gistUrl || storedGist.gistUrl;
    if (gistToken && gistUrl) {
      syncToGistHelper(gistUrl, gistToken as string, submissions).catch((syncErr) =>
        console.warn('Background Gist sync on feedback failed:', syncErr)
      );
    }

    res.json({ success: true, feedback, feedbacks: submissions.feedbacks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Full state synchronization endpoint
app.post('/api/sync-all', async (req, res) => {
  try {
    const { purchaseOrders, contactMessages, feedbacks, gistToken, gistUrl } = req.body;
    const submissions = getStoredSubmissions();

    if (Array.isArray(purchaseOrders)) {
      submissions.purchaseOrders = [
        ...purchaseOrders,
        ...(submissions.purchaseOrders || []),
      ].filter((item: any, index: number, self: any[]) => index === self.findIndex((t: any) => t.id === item.id));
    }
    if (Array.isArray(contactMessages)) {
      submissions.contactMessages = [
        ...contactMessages,
        ...(submissions.contactMessages || []),
      ].filter((item: any, index: number, self: any[]) => index === self.findIndex((t: any) => t.id === item.id));
    }
    if (Array.isArray(feedbacks)) {
      submissions.feedbacks = [
        ...feedbacks,
        ...(submissions.feedbacks || []),
      ].filter((item: any, index: number, self: any[]) => index === self.findIndex((t: any) => t.id === item.id));
    }

    saveStoredSubmissions(submissions);

    if (gistToken || gistUrl) {
      saveStoredGistConfig({ gistToken, gistUrl });
    }

    const storedGist = getStoredGistConfig();
    const activeToken = gistToken || storedGist.gistToken;
    const activeUrl = gistUrl || storedGist.gistUrl;

    if (activeToken && activeUrl) {
      syncToGistHelper(activeUrl, activeToken, submissions).catch((e) =>
        console.warn('Background sync-all Gist error:', e)
      );
    }

    res.json({ success: true, ...submissions });
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
