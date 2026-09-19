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
      const parsed = JSON.parse(content);
      return {
        gistToken: parsed.gistToken || process.env.GIST_TOKEN || '',
        gistUrl: parsed.gistUrl || process.env.GIST_URL || 'https://gist.githubusercontent.com/mohazard555/b98509446eaf8132fc819cff8f3f7956/raw/toysgame.json',
      };
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
      gistToken: (config.gistToken !== undefined && config.gistToken.trim()) ? config.gistToken.trim() : current.gistToken,
      gistUrl: (config.gistUrl !== undefined && config.gistUrl.trim()) ? config.gistUrl.trim() : current.gistUrl,
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
  const submissions = getStoredSubmissions();
  const pendingCount =
    (submissions.purchaseOrders?.length || 0) +
    (submissions.contactMessages?.length || 0) +
    (submissions.feedbacks?.length || 0);

  res.json({
    gistUrl: config.gistUrl || '',
    hasToken: Boolean(config.gistToken && config.gistToken.length > 5),
    pendingSubmissionsCount: pendingCount,
  });
});

app.post('/api/gist-config', async (req, res) => {
  const { gistToken, gistUrl } = req.body;
  const updated = saveStoredGistConfig({ gistToken, gistUrl });

  // If token is now active, immediately sync any stored local submissions to Gist!
  if (updated.gistToken && updated.gistUrl) {
    const submissions = getStoredSubmissions();
    const hasAnySubmissions =
      (submissions.purchaseOrders && submissions.purchaseOrders.length > 0) ||
      (submissions.contactMessages && submissions.contactMessages.length > 0) ||
      (submissions.feedbacks && submissions.feedbacks.length > 0);

    if (hasAnySubmissions) {
      syncToGistHelper(updated.gistUrl, updated.gistToken, submissions)
        .then(() => console.log('Successfully flushed stored submissions to Gist on token registration!'))
        .catch((err) => console.warn('Flush submissions on token registration failed:', err.message));
    }
  }

  res.json({
    success: true,
    hasToken: Boolean(updated.gistToken && updated.gistToken.length > 5),
    message: 'تم حفظ وتفعيل إعدادات المزامنة السحابية على الخادم بنجاح',
  });
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

    // Auto-sync to GitHub Gist using request headers, body or server stored config
    const storedGist = getStoredGistConfig();
    const gistToken = ((req.headers['x-gist-token'] as string) || req.body.gistToken || storedGist.gistToken || '').trim();
    const gistUrl = ((req.headers['x-gist-url'] as string) || req.body.gistUrl || storedGist.gistUrl || '').trim();

    let syncedToGist = false;
    let gistError: string | null = null;

    if (gistToken && gistUrl) {
      try {
        await syncToGistHelper(gistUrl, gistToken, submissions);
        syncedToGist = true;
      } catch (syncErr: any) {
        gistError = syncErr.message;
        console.warn('Gist sync on order failed:', syncErr.message);
      }
    }

    res.json({
      success: true,
      order,
      syncedToGist,
      gistError,
      purchaseOrders: submissions.purchaseOrders,
    });
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
    const gistToken = ((req.headers['x-gist-token'] as string) || req.body.gistToken || storedGist.gistToken || '').trim();
    const gistUrl = ((req.headers['x-gist-url'] as string) || req.body.gistUrl || storedGist.gistUrl || '').trim();

    let syncedToGist = false;
    let gistError: string | null = null;

    if (gistToken && gistUrl) {
      try {
        await syncToGistHelper(gistUrl, gistToken, submissions);
        syncedToGist = true;
      } catch (syncErr: any) {
        gistError = syncErr.message;
        console.warn('Gist sync on message failed:', syncErr.message);
      }
    }

    res.json({
      success: true,
      message,
      syncedToGist,
      gistError,
      contactMessages: submissions.contactMessages,
    });
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
    const gistToken = ((req.headers['x-gist-token'] as string) || req.body.gistToken || storedGist.gistToken || '').trim();
    const gistUrl = ((req.headers['x-gist-url'] as string) || req.body.gistUrl || storedGist.gistUrl || '').trim();

    let syncedToGist = false;
    let gistError: string | null = null;

    if (gistToken && gistUrl) {
      try {
        await syncToGistHelper(gistUrl, gistToken, submissions);
        syncedToGist = true;
      } catch (syncErr: any) {
        gistError = syncErr.message;
        console.warn('Gist sync on feedback failed:', syncErr.message);
      }
    }

    res.json({
      success: true,
      feedback,
      syncedToGist,
      gistError,
      feedbacks: submissions.feedbacks,
    });
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
    const activeToken = (gistToken || storedGist.gistToken || '').trim();
    const activeUrl = (gistUrl || storedGist.gistUrl || '').trim();

    let syncedToGist = false;
    if (activeToken && activeUrl) {
      try {
        await syncToGistHelper(activeUrl, activeToken, submissions);
        syncedToGist = true;
      } catch (e: any) {
        console.warn('Background sync-all Gist error:', e.message);
      }
    }

    res.json({ success: true, syncedToGist, ...submissions });
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

  const authHeader = token.startsWith('ghp_') || token.startsWith('github_pat_')
    ? `Bearer ${token}`
    : `token ${token}`;

  const requestHeaders = {
    Authorization: authHeader,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'ToysGame-Sync-Server/1.0',
  };

  // 1. Fetch current gist content first to safely merge
  let currentSettings: any = {};
  try {
    const getRes = await fetch(`https://api.github.com/gists/${gistId}?_t=${Date.now()}`, {
      headers: requestHeaders,
    });

    if (getRes.ok) {
      const gistData = await getRes.json();
      const targetFile = gistData.files?.[filename] || Object.values(gistData.files || {})[0] as any;
      if (targetFile) {
        if (targetFile.content && !targetFile.truncated) {
          try {
            currentSettings = JSON.parse(targetFile.content);
          } catch {}
        } else if (targetFile.raw_url) {
          const rawRes = await fetch(targetFile.raw_url, { headers: { 'User-Agent': 'ToysGame-Sync-Server/1.0' } });
          if (rawRes.ok) {
            currentSettings = await rawRes.json();
          }
        }
      }
    }
  } catch (err: any) {
    console.warn('GitHub API fetch failed in helper, trying raw fallback:', err.message);
  }

  // Fallback to public raw if still empty
  if (!currentSettings || Object.keys(currentSettings).length === 0) {
    try {
      const rawRes = await fetch(`https://gist.githubusercontent.com/mohazard555/${gistId}/raw/${filename}?_t=${Date.now()}`, {
        headers: { 'User-Agent': 'ToysGame-Sync-Server/1.0' },
      });
      if (rawRes.ok) {
        currentSettings = await rawRes.json();
      }
    } catch {}
  }

  // Safety safeguard: never wipe existing Gist config if we have existing keys
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

  const patchRes = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      ...requestHeaders,
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

  if (!patchRes.ok) {
    const errorBody = await patchRes.text();
    throw new Error(`GitHub Gist API error ${patchRes.status}: ${errorBody}`);
  }

  // Update server local file to reflect current merged state
  saveStoredSubmissions({
    purchaseOrders: merged.purchaseOrders,
    contactMessages: merged.contactMessages,
    feedbacks: merged.feedbacks,
  });

  console.log(`✓ Gist synced successfully: ${merged.purchaseOrders.length} orders, ${merged.contactMessages.length} messages, ${merged.feedbacks.length} feedbacks.`);
  return merged;
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
