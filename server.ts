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
      const parsed = JSON.parse(content);
      return {
        purchaseOrders: Array.isArray(parsed.purchaseOrders) ? parsed.purchaseOrders : [],
        contactMessages: Array.isArray(parsed.contactMessages) ? parsed.contactMessages : [],
        feedbacks: Array.isArray(parsed.feedbacks) ? parsed.feedbacks : [],
        codeIpBindings: parsed.codeIpBindings && typeof parsed.codeIpBindings === 'object' ? parsed.codeIpBindings : {},
        codeActivationDetails: parsed.codeActivationDetails && typeof parsed.codeActivationDetails === 'object' ? parsed.codeActivationDetails : {},
      };
    }
  } catch (e) {
    console.warn('Error reading submissions file:', e);
  }
  return { purchaseOrders: [], contactMessages: [], feedbacks: [], codeIpBindings: {}, codeActivationDetails: {} };
}

function saveStoredSubmissions(data: any) {
  try {
    const payload = {
      purchaseOrders: data.purchaseOrders || [],
      contactMessages: data.contactMessages || [],
      feedbacks: data.feedbacks || [],
      codeIpBindings: data.codeIpBindings || {},
      codeActivationDetails: data.codeActivationDetails || {},
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');
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

function getClientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }
  const cfIp = req.headers['cf-connecting-ip'];
  if (typeof cfIp === 'string' && cfIp.trim()) {
    return cfIp.trim();
  }
  return req.socket?.remoteAddress || req.ip || '127.0.0.1';
}

function getDeviceInfo(req: express.Request): string {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  if (ua.includes('android')) return 'هاتف أندرويد (Android)';
  if (ua.includes('iphone')) return 'هاتف آيفون (iPhone)';
  if (ua.includes('ipad')) return 'جهاز آيباد (iPad)';
  if (ua.includes('windows')) return 'كمبيوتر (Windows)';
  if (ua.includes('macintosh') || ua.includes('mac os')) return 'كمبيوتر (Mac)';
  if (ua.includes('linux')) return 'كمبيوتر (Linux)';
  if (ua.includes('mobile')) return 'هاتف محمول';
  return 'متصفح ويب';
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
    gistUrl: config.gistUrl || 'https://gist.githubusercontent.com/mohazard555/b98509446eaf8132fc819cff8f3f7956/raw/toysgame.json',
    gistToken: config.gistToken || '',
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
    const rawOrder = req.body;
    if (!rawOrder || !rawOrder.id) {
      return res.status(400).json({ success: false, message: 'Invalid order data' });
    }

    const clientIp = getClientIp(req);
    const deviceInfo = getDeviceInfo(req);
    const storedGist = getStoredGistConfig();

    // Auto-capture token from header if sent
    const headerToken = req.headers['x-gist-token'] as string;
    if (headerToken && headerToken.trim().length > 5 && !storedGist.gistToken) {
      saveStoredGistConfig({ gistToken: headerToken.trim() });
    }

    const order = {
      ...rawOrder,
      clientIp: rawOrder.clientIp || clientIp,
      deviceInfo: rawOrder.deviceInfo || deviceInfo,
      gistUrl: storedGist.gistUrl,
      createdAt: rawOrder.createdAt || new Date().toLocaleString('ar-EG'),
      serverReceivedAt: new Date().toISOString(),
    };

    const submissions = getStoredSubmissions();
    submissions.purchaseOrders = [order, ...(submissions.purchaseOrders || [])].filter(
      (item, index, self) => index === self.findIndex((t: any) => t.id === item.id)
    );
    saveStoredSubmissions(submissions);

    const activeGist = getStoredGistConfig();
    const gistToken = ((req.headers['x-gist-token'] as string) || req.body.gistToken || activeGist.gistToken || '').trim();
    const gistUrl = ((req.headers['x-gist-url'] as string) || req.body.gistUrl || activeGist.gistUrl || '').trim();

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
    const rawMessage = req.body;
    if (!rawMessage || !rawMessage.id) {
      return res.status(400).json({ success: false, message: 'Invalid message data' });
    }

    const clientIp = getClientIp(req);
    const deviceInfo = getDeviceInfo(req);
    const storedGist = getStoredGistConfig();

    const headerToken = req.headers['x-gist-token'] as string;
    if (headerToken && headerToken.trim().length > 5 && !storedGist.gistToken) {
      saveStoredGistConfig({ gistToken: headerToken.trim() });
    }

    const message = {
      ...rawMessage,
      clientIp: rawMessage.clientIp || clientIp,
      deviceInfo: rawMessage.deviceInfo || deviceInfo,
      gistUrl: storedGist.gistUrl,
      createdAt: rawMessage.createdAt || new Date().toLocaleString('ar-EG'),
      serverReceivedAt: new Date().toISOString(),
    };

    const submissions = getStoredSubmissions();
    submissions.contactMessages = [message, ...(submissions.contactMessages || [])].filter(
      (item, index, self) => index === self.findIndex((t: any) => t.id === item.id)
    );
    saveStoredSubmissions(submissions);

    const activeGist = getStoredGistConfig();
    const gistToken = ((req.headers['x-gist-token'] as string) || req.body.gistToken || activeGist.gistToken || '').trim();
    const gistUrl = ((req.headers['x-gist-url'] as string) || req.body.gistUrl || activeGist.gistUrl || '').trim();

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
    const rawFeedback = req.body;
    if (!rawFeedback || !rawFeedback.id) {
      return res.status(400).json({ success: false, message: 'Invalid feedback data' });
    }

    const clientIp = getClientIp(req);
    const deviceInfo = getDeviceInfo(req);
    const storedGist = getStoredGistConfig();

    const headerToken = req.headers['x-gist-token'] as string;
    if (headerToken && headerToken.trim().length > 5 && !storedGist.gistToken) {
      saveStoredGistConfig({ gistToken: headerToken.trim() });
    }

    const feedback = {
      ...rawFeedback,
      clientIp: rawFeedback.clientIp || clientIp,
      deviceInfo: rawFeedback.deviceInfo || deviceInfo,
      gistUrl: storedGist.gistUrl,
      createdAt: rawFeedback.createdAt || new Date().toLocaleString('ar-EG'),
      serverReceivedAt: new Date().toISOString(),
    };

    const submissions = getStoredSubmissions();
    submissions.feedbacks = [feedback, ...(submissions.feedbacks || [])].filter(
      (item, index, self) => index === self.findIndex((t: any) => t.id === item.id)
    );
    saveStoredSubmissions(submissions);

    const activeGist = getStoredGistConfig();
    const gistToken = ((req.headers['x-gist-token'] as string) || req.body.gistToken || activeGist.gistToken || '').trim();
    const gistUrl = ((req.headers['x-gist-url'] as string) || req.body.gistUrl || activeGist.gistUrl || '').trim();

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

// VIP Code Activation Endpoint with Strict IP & Device Binding
app.post('/api/activate-vip', async (req, res) => {
  try {
    const { code, deviceFingerprint, customerName } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'يرجى إدخال كود التفعيل' });
    }

    const cleanCode = code.trim().toUpperCase();
    const clientIp = getClientIp(req);
    const deviceInfo = getDeviceInfo(req);
    const submissions = getStoredSubmissions();

    submissions.codeIpBindings = submissions.codeIpBindings || {};
    submissions.codeActivationDetails = submissions.codeActivationDetails || {};

    const boundIp = submissions.codeIpBindings[cleanCode];
    const details = submissions.codeActivationDetails[cleanCode];

    // Check if code is already bound to a different IP
    if (boundIp && boundIp !== clientIp) {
      // If bound to a different IP and not matching fingerprint, strictly block
      const boundFingerprint = details?.deviceFingerprint;
      if (!boundFingerprint || boundFingerprint !== deviceFingerprint) {
        return res.status(403).json({
          success: false,
          reason: 'IP_MISMATCH',
          boundIp,
          activatedAt: details?.activatedAt,
          message: `⚠️ تنبيه أمني مشدد: كود التفعيل (${cleanCode}) مفعّل مسبقاً ومقترن بهاتف وجهاز آخر (IP: ${boundIp}). يمنع منعاً باتاً استخدامه على أكثر من جهاز لمنع التلاعب وتداول الأكواد.`,
        });
      }
    }

    // Bind or reaffirm this code to the current IP and device
    const nowAr = new Date().toLocaleString('ar-EG');
    submissions.codeIpBindings[cleanCode] = clientIp;
    submissions.codeActivationDetails[cleanCode] = {
      ip: clientIp,
      deviceInfo,
      activatedAt: details?.activatedAt || nowAr,
      lastSeenAt: nowAr,
      customerName: customerName || details?.customerName,
      deviceFingerprint: deviceFingerprint || details?.deviceFingerprint,
    };

    // Also update any matching purchase orders
    if (Array.isArray(submissions.purchaseOrders)) {
      submissions.purchaseOrders = submissions.purchaseOrders.map((po: any) => {
        if (po.activationCode?.toUpperCase() === cleanCode) {
          return {
            ...po,
            clientIp: po.clientIp || clientIp,
            deviceInfo: po.deviceInfo || deviceInfo,
            activatedAt: po.activatedAt || nowAr,
          };
        }
        return po;
      });
    }

    saveStoredSubmissions(submissions);

    // Sync with Gist immediately so all devices/instances are updated
    const activeGist = getStoredGistConfig();
    const gistToken = ((req.headers['x-gist-token'] as string) || req.body.gistToken || activeGist.gistToken || '').trim();
    const gistUrl = ((req.headers['x-gist-url'] as string) || req.body.gistUrl || activeGist.gistUrl || '').trim();

    if (gistToken && gistUrl) {
      syncToGistHelper(gistUrl, gistToken, submissions).catch((err) => {
        console.warn('Gist sync on code activation warning:', err.message);
      });
    }

    res.json({
      success: true,
      message: `🎉 تهانينا! تم تفعيل كود VIP بنجاح وتم ربطه بهذا الهاتف (IP: ${clientIp}) مدى الحياة.`,
      code: cleanCode,
      clientIp,
      deviceInfo,
      activatedAt: nowAr,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin unbind endpoint
app.post('/api/unbind-code', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'الكود مطلوب' });
    }
    const cleanCode = code.trim().toUpperCase();
    const submissions = getStoredSubmissions();

    if (submissions.codeIpBindings && submissions.codeIpBindings[cleanCode]) {
      delete submissions.codeIpBindings[cleanCode];
    }
    if (submissions.codeActivationDetails && submissions.codeActivationDetails[cleanCode]) {
      delete submissions.codeActivationDetails[cleanCode];
    }

    saveStoredSubmissions(submissions);

    const activeGist = getStoredGistConfig();
    const gistToken = ((req.headers['x-gist-token'] as string) || req.body.gistToken || activeGist.gistToken || '').trim();
    const gistUrl = ((req.headers['x-gist-url'] as string) || req.body.gistUrl || activeGist.gistUrl || '').trim();

    if (gistToken && gistUrl) {
      syncToGistHelper(gistUrl, gistToken, submissions).catch((err) => {
        console.warn('Gist sync on unbind warning:', err.message);
      });
    }

    res.json({
      success: true,
      message: `تم فك ارتباط الـ IP للكود (${cleanCode}) بنجاح، وأصبح جاهزاً ومتاحاً للربط بجهاز جديد.`,
      code: cleanCode,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Full state synchronization endpoint
app.post('/api/sync-all', async (req, res) => {
  try {
    const { purchaseOrders, contactMessages, feedbacks, codeIpBindings, codeActivationDetails, gistToken, gistUrl, replace } = req.body;
    const submissions = getStoredSubmissions();

    if (Array.isArray(purchaseOrders)) {
      if (replace) {
        submissions.purchaseOrders = purchaseOrders;
      } else {
        submissions.purchaseOrders = [
          ...purchaseOrders,
          ...(submissions.purchaseOrders || []),
        ].filter((item: any, index: number, self: any[]) => index === self.findIndex((t: any) => t.id === item.id));
      }
    }
    if (Array.isArray(contactMessages)) {
      if (replace) {
        submissions.contactMessages = contactMessages;
      } else {
        submissions.contactMessages = [
          ...contactMessages,
          ...(submissions.contactMessages || []),
        ].filter((item: any, index: number, self: any[]) => index === self.findIndex((t: any) => t.id === item.id));
      }
    }
    if (Array.isArray(feedbacks)) {
      if (replace) {
        submissions.feedbacks = feedbacks;
      } else {
        submissions.feedbacks = [
          ...feedbacks,
          ...(submissions.feedbacks || []),
        ].filter((item: any, index: number, self: any[]) => index === self.findIndex((t: any) => t.id === item.id));
      }
    }
    if (codeIpBindings && typeof codeIpBindings === 'object') {
      if (replace) {
        submissions.codeIpBindings = codeIpBindings;
      } else {
        submissions.codeIpBindings = {
          ...(submissions.codeIpBindings || {}),
          ...codeIpBindings,
        };
      }
    }
    if (codeActivationDetails && typeof codeActivationDetails === 'object') {
      if (replace) {
        submissions.codeActivationDetails = codeActivationDetails;
      } else {
        submissions.codeActivationDetails = {
          ...(submissions.codeActivationDetails || {}),
          ...codeActivationDetails,
        };
      }
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

// Update single order status or details
app.patch('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const submissions = getStoredSubmissions();
    let found = false;

    submissions.purchaseOrders = (submissions.purchaseOrders || []).map((ord: any) => {
      if (ord.id === id) {
        found = true;
        return { ...ord, ...updates, updatedAt: new Date().toISOString() };
      }
      return ord;
    });

    if (!found) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    saveStoredSubmissions(submissions);

    const activeGist = getStoredGistConfig();
    if (activeGist.gistToken && activeGist.gistUrl) {
      syncToGistHelper(activeGist.gistUrl, activeGist.gistToken, submissions).catch(() => {});
    }

    res.json({ success: true, purchaseOrders: submissions.purchaseOrders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete single order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const submissions = getStoredSubmissions();
    submissions.purchaseOrders = (submissions.purchaseOrders || []).filter((ord: any) => ord.id !== id);
    saveStoredSubmissions(submissions);

    const activeGist = getStoredGistConfig();
    if (activeGist.gistToken && activeGist.gistUrl) {
      syncToGistHelper(activeGist.gistUrl, activeGist.gistToken, submissions).catch(() => {});
    }

    res.json({ success: true, purchaseOrders: submissions.purchaseOrders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update single feedback status
app.patch('/api/feedbacks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const submissions = getStoredSubmissions();
    let found = false;

    submissions.feedbacks = (submissions.feedbacks || []).map((fb: any) => {
      if (fb.id === id) {
        found = true;
        return { ...fb, status: status || fb.status, updatedAt: new Date().toISOString() };
      }
      return fb;
    });

    if (!found) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    saveStoredSubmissions(submissions);

    const activeGist = getStoredGistConfig();
    if (activeGist.gistToken && activeGist.gistUrl) {
      syncToGistHelper(activeGist.gistUrl, activeGist.gistToken, submissions).catch(() => {});
    }

    res.json({ success: true, feedbacks: submissions.feedbacks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete single feedback
app.delete('/api/feedbacks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const submissions = getStoredSubmissions();
    submissions.feedbacks = (submissions.feedbacks || []).filter((fb: any) => fb.id !== id);
    saveStoredSubmissions(submissions);

    const activeGist = getStoredGistConfig();
    if (activeGist.gistToken && activeGist.gistUrl) {
      syncToGistHelper(activeGist.gistUrl, activeGist.gistToken, submissions).catch(() => {});
    }

    res.json({ success: true, feedbacks: submissions.feedbacks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update single contact message status
app.patch('/api/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const submissions = getStoredSubmissions();
    let found = false;

    submissions.contactMessages = (submissions.contactMessages || []).map((msg: any) => {
      if (msg.id === id) {
        found = true;
        return { ...msg, status: status || msg.status, updatedAt: new Date().toISOString() };
      }
      return msg;
    });

    if (!found) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    saveStoredSubmissions(submissions);

    const activeGist = getStoredGistConfig();
    if (activeGist.gistToken && activeGist.gistUrl) {
      syncToGistHelper(activeGist.gistUrl, activeGist.gistToken, submissions).catch(() => {});
    }

    res.json({ success: true, contactMessages: submissions.contactMessages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete single contact message
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const submissions = getStoredSubmissions();
    submissions.contactMessages = (submissions.contactMessages || []).filter((msg: any) => msg.id !== id);
    saveStoredSubmissions(submissions);

    const activeGist = getStoredGistConfig();
    if (activeGist.gistToken && activeGist.gistUrl) {
      syncToGistHelper(activeGist.gistUrl, activeGist.gistToken, submissions).catch(() => {});
    }

    res.json({ success: true, contactMessages: submissions.contactMessages });
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
    codeIpBindings: {
      ...((currentSettings as any).codeIpBindings || {}),
      ...(localData.codeIpBindings || {}),
    },
    codeActivationDetails: {
      ...((currentSettings as any).codeActivationDetails || {}),
      ...(localData.codeActivationDetails || {}),
    },
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
    codeIpBindings: merged.codeIpBindings,
    codeActivationDetails: merged.codeActivationDetails,
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

    // Periodic 60-second (1 minute) background sync to GitHub Gist
    setInterval(async () => {
      try {
        const config = getStoredGistConfig();
        if (config.gistToken && config.gistUrl) {
          const submissions = getStoredSubmissions();
          const hasAny =
            (submissions.purchaseOrders?.length || 0) > 0 ||
            (submissions.contactMessages?.length || 0) > 0 ||
            (submissions.feedbacks?.length || 0) > 0;
          if (hasAny) {
            await syncToGistHelper(config.gistUrl, config.gistToken, submissions);
          }
        }
      } catch (e: any) {
        // silent background sync
      }
    }, 60000);
  });
}

startServer();
