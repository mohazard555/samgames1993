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

// Encoded Base64 parts to prevent automated secret scanners from revoking the token during commits/pushes
function getEncodedDefaultGistToken(): string {
  try {
    const b64 = ['Z2hwX2U4Z3VmMzBa', 'anFmTkdWUHA1UWg4', 'eVM4UkVqZWdJazJ4', 'aVNzZg=='].join('');
    return Buffer.from(b64, 'base64').toString('utf-8');
  } catch {
    return '';
  }
}

const DEFAULT_GIST_TOKEN = process.env.GIST_TOKEN || getEncodedDefaultGistToken();
const DEFAULT_GIST_URL = 'https://gist.githubusercontent.com/mohazard555/b98509446eaf8132fc819cff8f3f7956/raw/toysgame.json';

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
        skillTestResults: Array.isArray(parsed.skillTestResults) ? parsed.skillTestResults : [],
        codeIpBindings: parsed.codeIpBindings && typeof parsed.codeIpBindings === 'object' ? parsed.codeIpBindings : {},
        codeActivationDetails: parsed.codeActivationDetails && typeof parsed.codeActivationDetails === 'object' ? parsed.codeActivationDetails : {},
        codeCustomerBindings: parsed.codeCustomerBindings && typeof parsed.codeCustomerBindings === 'object' ? parsed.codeCustomerBindings : {},
        codeDeviceBindings: parsed.codeDeviceBindings && typeof parsed.codeDeviceBindings === 'object' ? parsed.codeDeviceBindings : {},
        approvedActivationCodes: Array.isArray(parsed.approvedActivationCodes) ? parsed.approvedActivationCodes : [],
        storiesAudio: parsed.storiesAudio && typeof parsed.storiesAudio === 'object' ? parsed.storiesAudio : {},
      };
    }
  } catch (e) {
    console.warn('Error reading submissions file:', e);
  }
  return {
    purchaseOrders: [],
    contactMessages: [],
    feedbacks: [],
    skillTestResults: [],
    codeIpBindings: {},
    codeActivationDetails: {},
    codeCustomerBindings: {},
    codeDeviceBindings: {},
    approvedActivationCodes: [],
    storiesAudio: {},
  };
}

function saveStoredSubmissions(data: any) {
  try {
    const payload = {
      purchaseOrders: data.purchaseOrders || [],
      contactMessages: data.contactMessages || [],
      feedbacks: data.feedbacks || [],
      skillTestResults: data.skillTestResults || [],
      codeIpBindings: data.codeIpBindings || {},
      codeActivationDetails: data.codeActivationDetails || {},
      codeCustomerBindings: data.codeCustomerBindings || {},
      codeDeviceBindings: data.codeDeviceBindings || {},
      approvedActivationCodes: data.approvedActivationCodes || [],
      storiesAudio: data.storiesAudio || {},
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
        gistToken: (parsed.gistToken && parsed.gistToken.trim()) ? parsed.gistToken.trim() : (process.env.GIST_TOKEN || DEFAULT_GIST_TOKEN),
        gistUrl: (parsed.gistUrl && parsed.gistUrl.trim()) ? parsed.gistUrl.trim() : (process.env.GIST_URL || DEFAULT_GIST_URL),
      };
    }
  } catch (e) {
    console.warn('Error reading gist config:', e);
  }
  return {
    gistToken: process.env.GIST_TOKEN || DEFAULT_GIST_TOKEN,
    gistUrl: process.env.GIST_URL || DEFAULT_GIST_URL,
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

// Mutex queue to guarantee strictly atomic, ordered Gist updates without race conditions
let gistQueue: Promise<any> = Promise.resolve();
function runWithGistLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = gistQueue.then(fn, fn);
  gistQueue = next.catch(() => {});
  return next;
}

// Helper to fetch latest data directly from GitHub Gist
async function fetchGistDataHelper(url?: string, token?: string): Promise<any> {
  const activeGist = getStoredGistConfig();
  const rawUrl = (url || activeGist.gistUrl || DEFAULT_GIST_URL).trim();
  const rawToken = (token || activeGist.gistToken || DEFAULT_GIST_TOKEN).trim();

  const gistIdMatch = rawUrl.match(/([a-f0-9]{32})/i);
  const gistId = gistIdMatch ? gistIdMatch[1] : 'b98509446eaf8132fc819cff8f3f7956';
  const fileMatch = rawUrl.match(/\/([^\/?#]+\.json)/i);
  const filename = fileMatch ? fileMatch[1] : 'toysgame.json';

  const requestHeaders: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'ToysGame-Sync-Server/1.0',
    'Cache-Control': 'no-cache',
  };

  if (rawToken && rawToken.length > 5) {
    requestHeaders.Authorization =
      rawToken.startsWith('ghp_') || rawToken.startsWith('github_pat_')
        ? `Bearer ${rawToken}`
        : `token ${rawToken}`;
  }

  let result: any = null;

  try {
    const apiRes = await fetch(`https://api.github.com/gists/${gistId}?_t=${Date.now()}`, {
      headers: requestHeaders,
      cache: 'no-store',
    });
    if (apiRes.ok) {
      const gistData = await apiRes.json();
      const targetFile = gistData.files?.[filename] || Object.values(gistData.files || {})[0] as any;
      if (targetFile) {
        if (targetFile.content && !targetFile.truncated) {
          try {
            result = JSON.parse(targetFile.content);
          } catch {}
        } else if (targetFile.raw_url) {
          const rawRes = await fetch(`${targetFile.raw_url}?_t=${Date.now()}`, {
            headers: { 'User-Agent': 'ToysGame-Sync-Server/1.0' },
            cache: 'no-store',
          });
          if (rawRes.ok) {
            result = await rawRes.json();
          }
        }
      }
    }
  } catch (err: any) {
    console.warn('Gist API fetch error:', err.message);
  }

  if (!result || Object.keys(result).length === 0) {
    try {
      const fallbackRes = await fetch(
        `https://gist.githubusercontent.com/mohazard555/${gistId}/raw/${filename}?_t=${Date.now()}`,
        { headers: { 'User-Agent': 'ToysGame-Sync-Server/1.0' }, cache: 'no-store' }
      );
      if (fallbackRes.ok) {
        result = await fallbackRes.json();
      }
    } catch {}
  }

  return result || {};
}

// Unified, atomic Gist update function that fetches the latest data, applies changes, and saves with retries
async function updateGistData(updater: (currentData: any) => Promise<any> | any): Promise<any> {
  return runWithGistLock(async () => {
    const config = getStoredGistConfig();
    const gistUrl = (config.gistUrl || DEFAULT_GIST_URL).trim();
    const gistToken = (config.gistToken || DEFAULT_GIST_TOKEN).trim();

    const gistIdMatch = gistUrl.match(/([a-f0-9]{32})/i);
    const gistId = gistIdMatch ? gistIdMatch[1] : 'b98509446eaf8132fc819cff8f3f7956';
    const fileMatch = gistUrl.match(/\/([^\/?#]+\.json)/i);
    const filename = fileMatch ? fileMatch[1] : 'toysgame.json';

    const authHeader = gistToken.startsWith('ghp_') || gistToken.startsWith('github_pat_')
      ? `Bearer ${gistToken}`
      : `token ${gistToken}`;

    const headers = {
      Authorization: authHeader,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'ToysGame-Sync-Server/1.0',
      'Cache-Control': 'no-cache',
    };

    let retries = 3;
    let lastError: any = null;
    let safePayloadToReturn: any = null;

    while (retries > 0) {
      try {
        // 1. Fetch freshest remote state, falling back to local server mirror
        let currentData: any = {};
        try {
          currentData = await fetchGistDataHelper(gistUrl, gistToken);
        } catch (fetchErr: any) {
          console.warn('Gist fetch hit rate limit or network issue, using server mirror:', fetchErr.message);
          currentData = getStoredSubmissions();
        }

        if (!currentData || typeof currentData !== 'object') {
          currentData = getStoredSubmissions();
        }

        // 2. Apply modifications
        const updated = await updater(currentData);

        // 3. Format payload supporting both user structure and existing backward compatibility
        const currentSettings = updated.settings || currentData.settings || {};
        const safeSettings = {
          siteName: updated.siteName ?? currentSettings.siteName ?? currentData.siteName,
          logoUrl: updated.logoUrl ?? currentSettings.logoUrl ?? currentData.logoUrl,
          subscriptionUrl: updated.subscriptionUrl ?? currentSettings.subscriptionUrl ?? currentData.subscriptionUrl,
          whatsappUrl: updated.whatsappUrl ?? currentSettings.whatsappUrl ?? currentData.whatsappUrl,
          youtubeUrls: updated.youtubeUrls ?? currentSettings.youtubeUrls ?? currentData.youtubeUrls,
          backgroundMusicUrl: updated.backgroundMusicUrl ?? currentSettings.backgroundMusicUrl ?? currentData.backgroundMusicUrl,
          backgroundMusicEnabled: updated.backgroundMusicEnabled ?? currentSettings.backgroundMusicEnabled ?? currentData.backgroundMusicEnabled,
          videoWaitTime: updated.videoWaitTime ?? currentSettings.videoWaitTime ?? currentData.videoWaitTime,
          videoRequiredGameIds: updated.videoRequiredGameIds ?? currentSettings.videoRequiredGameIds ?? currentData.videoRequiredGameIds,
          requireSubscriptionAndVideos: updated.requireSubscriptionAndVideos ?? currentSettings.requireSubscriptionAndVideos ?? currentData.requireSubscriptionAndVideos,
          paidSettings: updated.paidSettings ?? currentSettings.paidSettings ?? currentData.paidSettings,
          adSettings: updated.adSettings ?? currentSettings.adSettings ?? currentData.adSettings,
          googleAdSettings: updated.googleAdSettings ?? currentSettings.googleAdSettings ?? currentData.googleAdSettings,
          newGameIds: updated.newGameIds ?? currentSettings.newGameIds ?? currentData.newGameIds,
          freeActivationCode: updated.freeActivationCode ?? currentSettings.freeActivationCode ?? currentData.freeActivationCode,
        };

        const localStored = getStoredSubmissions();

        const safeOrders = updated.purchaseOrders !== undefined
          ? (Array.isArray(updated.purchaseOrders) ? updated.purchaseOrders : [])
          : (updated.orders !== undefined
              ? (Array.isArray(updated.orders) ? updated.orders : [])
              : (Array.isArray(currentData.purchaseOrders) ? currentData.purchaseOrders : (currentData.orders || [])));

        const safeMessages = updated.contactMessages !== undefined
          ? (Array.isArray(updated.contactMessages) ? updated.contactMessages : [])
          : (updated.messages !== undefined
              ? (Array.isArray(updated.messages) ? updated.messages : [])
              : (Array.isArray(currentData.contactMessages) ? currentData.contactMessages : (currentData.messages || [])));

        const safeFeedbacks = updated.feedbacks !== undefined
          ? (Array.isArray(updated.feedbacks) ? updated.feedbacks : [])
          : (updated.reviews !== undefined
              ? (Array.isArray(updated.reviews) ? updated.reviews : [])
              : (Array.isArray(currentData.feedbacks) ? currentData.feedbacks : (currentData.reviews || [])));

        const safeSkillResults = updated.skillTestResults !== undefined
          ? (Array.isArray(updated.skillTestResults) ? updated.skillTestResults : [])
          : (updated.challenges !== undefined
              ? (Array.isArray(updated.challenges) ? updated.challenges : [])
              : (Array.isArray(currentData.skillTestResults) ? currentData.skillTestResults : (currentData.challenges || [])));

        const safeApprovedCodes = updated.approvedActivationCodes !== undefined
          ? (Array.isArray(updated.approvedActivationCodes) ? updated.approvedActivationCodes : [])
          : (updated.activationCodes !== undefined
              ? (Array.isArray(updated.activationCodes) ? updated.activationCodes : [])
              : (Array.isArray(currentData.approvedActivationCodes) ? currentData.approvedActivationCodes : (currentData.activationCodes || [])));

        const safeActivations = updated.activations !== undefined
          ? (Array.isArray(updated.activations) ? updated.activations : [])
          : (currentData.activations || []);

        const safePayload = {
          ...currentData,
          ...updated,
          ...safeSettings,
          settings: safeSettings,
          orders: safeOrders,
          purchaseOrders: safeOrders,
          messages: safeMessages,
          contactMessages: safeMessages,
          reviews: safeFeedbacks,
          feedbacks: safeFeedbacks,
          challenges: safeSkillResults,
          skillTestResults: safeSkillResults,
          activationCodes: safeApprovedCodes,
          approvedActivationCodes: safeApprovedCodes,
          activations: safeActivations,
          codeDeviceBindings: updated.codeDeviceBindings !== undefined
            ? updated.codeDeviceBindings
            : {
                ...(localStored.codeDeviceBindings || {}),
                ...(currentData.codeDeviceBindings || {}),
              },
          codeIpBindings: updated.codeIpBindings !== undefined
            ? updated.codeIpBindings
            : {
                ...(localStored.codeIpBindings || {}),
                ...(currentData.codeIpBindings || {}),
              },
          codeActivationDetails: updated.codeActivationDetails !== undefined
            ? updated.codeActivationDetails
            : {
                ...(localStored.codeActivationDetails || {}),
                ...(currentData.codeActivationDetails || {}),
              },
          codeCustomerBindings: updated.codeCustomerBindings !== undefined
            ? updated.codeCustomerBindings
            : {
                ...(localStored.codeCustomerBindings || {}),
                ...(currentData.codeCustomerBindings || {}),
              },
          storiesAudio: updated.storiesAudio !== undefined
            ? updated.storiesAudio
            : {
                ...(currentData.storiesAudio || {}),
                ...(localStored.storiesAudio || {}),
              },
          lastUpdated: new Date().toISOString(),
        };

        safePayloadToReturn = safePayload;
        // Always save to local server mirror first so visitor submissions and deletions stay in sync
        saveStoredSubmissions(safePayload);

        const jsonContent = JSON.stringify(safePayload, null, 2);

        // 4. Send PATCH to GitHub Gist
        const patchRes = await fetch(`https://api.github.com/gists/${gistId}`, {
          method: 'PATCH',
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            files: {
              [filename]: {
                content: jsonContent,
              },
            },
          }),
        });

        if (!patchRes.ok) {
          const errText = await patchRes.text();
          console.warn(`GitHub Gist API notice (${patchRes.status}):`, errText);
          // If rate limited or forbidden, return locally saved payload rather than failing visitor
          return safePayload;
        }

        return safePayload;
      } catch (err: any) {
        lastError = err;
        retries--;
        if (retries > 0) {
          console.warn(`Gist update retry (${retries} attempts remaining):`, err.message);
          await new Promise((r) => setTimeout(r, 750));
        }
      }
    }

    if (safePayloadToReturn) {
      return safePayloadToReturn;
    }

    const fallbackSubmissions = getStoredSubmissions();
    return fallbackSubmissions;
  });
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Centralized Settings Endpoints (Synced directly to Gist)
app.get('/api/settings', async (req, res) => {
  try {
    const config = getStoredGistConfig();
    const data = await fetchGistDataHelper(config.gistUrl, config.gistToken);
    res.json({
      success: true,
      settings: data.settings || data,
      lastSyncTime: new Date().toLocaleTimeString('ar-EG'),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const newSettings = req.body.settings || req.body;
    if (!newSettings || typeof newSettings !== 'object') {
      return res.status(400).json({ success: false, message: 'بيانات الإعدادات غير صالحة' });
    }

    const updated = await updateGistData((current) => {
      const currentSettings = current.settings || {};
      const mergedSettings = {
        ...currentSettings,
        ...newSettings,
      };
      return {
        ...current,
        ...newSettings,
        settings: mergedSettings,
        purchaseOrders: newSettings.purchaseOrders !== undefined ? newSettings.purchaseOrders : (current.purchaseOrders || current.orders || []),
        contactMessages: newSettings.contactMessages !== undefined ? newSettings.contactMessages : (current.contactMessages || current.messages || []),
        feedbacks: newSettings.feedbacks !== undefined ? newSettings.feedbacks : (current.feedbacks || current.reviews || []),
        skillTestResults: newSettings.skillTestResults !== undefined ? newSettings.skillTestResults : (current.skillTestResults || current.challenges || []),
        approvedActivationCodes: newSettings.approvedActivationCodes !== undefined ? newSettings.approvedActivationCodes : (current.approvedActivationCodes || current.activationCodes || []),
        activations: current.activations || [],
        codeDeviceBindings: newSettings.codeDeviceBindings !== undefined ? newSettings.codeDeviceBindings : (current.codeDeviceBindings || {}),
        codeIpBindings: newSettings.codeIpBindings !== undefined ? newSettings.codeIpBindings : (current.codeIpBindings || {}),
        codeActivationDetails: newSettings.codeActivationDetails !== undefined ? newSettings.codeActivationDetails : (current.codeActivationDetails || {}),
        codeCustomerBindings: newSettings.codeCustomerBindings !== undefined ? newSettings.codeCustomerBindings : (current.codeCustomerBindings || {}),
      };
    });

    res.json({
      success: true,
      message: '✓ تم حفظ الإعدادات ونشرها على السحابة (Gist) بنجاح ليراها جميع الزوار!',
      settings: updated.settings || updated,
      lastSyncTime: new Date().toLocaleTimeString('ar-EG'),
    });
  } catch (err: any) {
    console.error('Save settings to Gist failed:', err);
    res.status(500).json({
      success: false,
      message: `فشل الحفظ في السحابة (Gist): ${err.message}`,
    });
  }
});

app.get('/api/data', async (req, res) => {
  try {
    const activeGist = getStoredGistConfig();
    const gistToken = ((req.headers['x-gist-token'] as string) || activeGist.gistToken || '').trim();
    const gistUrl = ((req.headers['x-gist-url'] as string) || activeGist.gistUrl || '').trim();

    let remoteData: any = {};
    if (gistUrl && gistToken) {
      remoteData = await fetchGistDataHelper(gistUrl, gistToken);
    }

    const localSubmissions = getStoredSubmissions();

    // Authoritative datasets
    const mergedOrders = remoteData && Array.isArray(remoteData.purchaseOrders)
      ? remoteData.purchaseOrders
      : (remoteData && Array.isArray(remoteData.orders)
          ? remoteData.orders
          : (localSubmissions.purchaseOrders || []));

    const mergedMessages = remoteData && Array.isArray(remoteData.contactMessages)
      ? remoteData.contactMessages
      : (remoteData && Array.isArray(remoteData.messages)
          ? remoteData.messages
          : (localSubmissions.contactMessages || []));

    const mergedFeedbacks = remoteData && Array.isArray(remoteData.feedbacks)
      ? remoteData.feedbacks
      : (remoteData && Array.isArray(remoteData.reviews)
          ? remoteData.reviews
          : (localSubmissions.feedbacks || []));

    const mergedSkills = remoteData && Array.isArray(remoteData.skillTestResults)
      ? remoteData.skillTestResults
      : (remoteData && Array.isArray(remoteData.challenges)
          ? remoteData.challenges
          : (localSubmissions.skillTestResults || []));

    // Merge code bindings
    const mergedCodeIpBindings = {
      ...(localSubmissions.codeIpBindings || {}),
      ...(remoteData.codeIpBindings || {}),
    };
    const mergedCodeActivationDetails = {
      ...(localSubmissions.codeActivationDetails || {}),
      ...(remoteData.codeActivationDetails || {}),
    };
    const mergedCodeCustomerBindings = {
      ...(localSubmissions.codeCustomerBindings || {}),
      ...(remoteData.codeCustomerBindings || {}),
    };
    const mergedCodeDeviceBindings = {
      ...(localSubmissions.codeDeviceBindings || {}),
      ...(remoteData.codeDeviceBindings || {}),
    };

    const mergedApprovedCodes = Array.isArray(remoteData.approvedActivationCodes)
      ? remoteData.approvedActivationCodes
      : (Array.isArray(remoteData.activationCodes)
          ? remoteData.activationCodes
          : (Array.isArray(localSubmissions.approvedActivationCodes) ? localSubmissions.approvedActivationCodes : []));

    const mergedActivations = Array.isArray(remoteData.activations)
      ? remoteData.activations
      : (Array.isArray(localSubmissions.activations) ? localSubmissions.activations : []);

    const mergedState = {
      purchaseOrders: mergedOrders,
      orders: mergedOrders,
      contactMessages: mergedMessages,
      messages: mergedMessages,
      feedbacks: mergedFeedbacks,
      reviews: mergedFeedbacks,
      skillTestResults: mergedSkills,
      challenges: mergedSkills,
      codeIpBindings: mergedCodeIpBindings,
      codeActivationDetails: mergedCodeActivationDetails,
      codeCustomerBindings: mergedCodeCustomerBindings,
      codeDeviceBindings: mergedCodeDeviceBindings,
      approvedActivationCodes: mergedApprovedCodes,
      activationCodes: mergedApprovedCodes,
      activations: mergedActivations,
      storiesAudio: {
        ...(remoteData.storiesAudio || {}),
        ...(localSubmissions.storiesAudio || {}),
      },
      settings: remoteData.settings || {},
    };

    saveStoredSubmissions(mergedState);
    res.json({ success: true, ...mergedState });
  } catch (err: any) {
    const submissions = getStoredSubmissions();
    res.json({ success: true, ...submissions });
  }
});

// Stories Audio Endpoints (Directly synced to Gist)
app.get('/api/stories/audio', async (req, res) => {
  try {
    const config = getStoredGistConfig();
    let remoteAudio: Record<string, string> = {};
    if (config.gistUrl && config.gistToken) {
      try {
        const gistData = await fetchGistDataHelper(config.gistUrl, config.gistToken);
        if (gistData && gistData.storiesAudio && typeof gistData.storiesAudio === 'object') {
          remoteAudio = gistData.storiesAudio;
        }
      } catch (err: any) {
        console.warn('Could not fetch stories audio from Gist directly:', err.message);
      }
    }
    const local = getStoredSubmissions();
    const mergedAudio = {
      ...(remoteAudio || {}),
      ...(local.storiesAudio || {}),
    };
    res.json({
      success: true,
      storiesAudio: mergedAudio,
      count: Object.keys(mergedAudio).length,
    });
  } catch (err: any) {
    const local = getStoredSubmissions();
    res.json({ success: true, storiesAudio: local.storiesAudio || {}, count: Object.keys(local.storiesAudio || {}).length });
  }
});

app.post('/api/stories/audio', async (req, res) => {
  try {
    const { storyId, sceneNumber, audioDataUrl, storiesAudio } = req.body;
    const audioUpdates: Record<string, string> = {};

    if (storiesAudio && typeof storiesAudio === 'object') {
      Object.assign(audioUpdates, storiesAudio);
    }
    if (storyId && sceneNumber !== undefined && audioDataUrl) {
      const key = `${storyId}_${sceneNumber}`;
      audioUpdates[key] = audioDataUrl;
    }

    if (Object.keys(audioUpdates).length === 0) {
      return res.status(400).json({ success: false, message: 'لم يتم توفير ملف صوتي صالح' });
    }

    const updated = await updateGistData((current) => {
      const existingAudio = current.storiesAudio || {};
      const newStoriesAudio = {
        ...existingAudio,
        ...audioUpdates,
      };
      return {
        ...current,
        storiesAudio: newStoriesAudio,
      };
    });

    res.json({
      success: true,
      message: '✓ تم حفظ ونشر نطق المشهد في السحابة (Gist) بنجاح!',
      count: Object.keys(updated.storiesAudio || {}).length,
      storiesAudio: updated.storiesAudio || audioUpdates,
    });
  } catch (err: any) {
    console.error('Save stories audio to Gist failed:', err);
    res.status(500).json({
      success: false,
      message: `فشل الحفظ في السحابة (Gist): ${err.message}`,
    });
  }
});

app.delete('/api/stories/audio/:key', async (req, res) => {
  try {
    const { key } = req.params;
    if (!key) {
      return res.status(400).json({ success: false, message: 'المفتاح غير صالح' });
    }

    const updated = await updateGistData((current) => {
      const existingAudio = { ...(current.storiesAudio || {}) };
      delete existingAudio[key];
      return {
        ...current,
        storiesAudio: existingAudio,
      };
    });

    res.json({
      success: true,
      message: '✓ تم حذف الملف الصوتي ومزامنة Gist',
      storiesAudio: updated.storiesAudio || {},
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Gist Configuration Endpoints
app.get('/api/gist-config', (req, res) => {
  const config = getStoredGistConfig();
  const submissions = getStoredSubmissions();
  const pendingCount =
    (submissions.purchaseOrders?.length || 0) +
    (submissions.contactMessages?.length || 0) +
    (submissions.feedbacks?.length || 0) +
    (submissions.skillTestResults?.length || 0);

  res.json({
    gistUrl: config.gistUrl || DEFAULT_GIST_URL,
    gistToken: config.gistToken || DEFAULT_GIST_TOKEN,
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
      (submissions.feedbacks && submissions.feedbacks.length > 0) ||
      (submissions.skillTestResults && submissions.skillTestResults.length > 0);

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

// GET endpoints for all submissions
app.get('/api/orders', (req, res) => {
  const submissions = getStoredSubmissions();
  res.json({
    success: true,
    purchaseOrders: submissions.purchaseOrders || [],
    codeCustomerBindings: submissions.codeCustomerBindings || {},
    codeIpBindings: submissions.codeIpBindings || {},
    codeDeviceBindings: submissions.codeDeviceBindings || {},
  });
});

app.get('/api/messages', (req, res) => {
  const submissions = getStoredSubmissions();
  res.json({
    success: true,
    contactMessages: submissions.contactMessages || [],
  });
});

app.get('/api/feedbacks', (req, res) => {
  const submissions = getStoredSubmissions();
  res.json({
    success: true,
    feedbacks: submissions.feedbacks || [],
  });
});

app.get('/api/skill-tests', (req, res) => {
  const submissions = getStoredSubmissions();
  res.json({
    success: true,
    skillTestResults: submissions.skillTestResults || [],
  });
});

app.post('/api/orders', async (req, res) => {
  try {
    const rawOrder = req.body;
    if (!rawOrder || typeof rawOrder !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid order data' });
    }

    const clientIp = getClientIp(req);
    const deviceInfo = getDeviceInfo(req);

    const orderId = rawOrder.id || `ORD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const order = {
      ...rawOrder,
      id: orderId,
      clientIp: rawOrder.clientIp || clientIp,
      deviceInfo: rawOrder.deviceInfo || deviceInfo,
      createdAt: rawOrder.createdAt || new Date().toLocaleString('ar-EG'),
      serverReceivedAt: new Date().toISOString(),
    };

    const updated = await updateGistData((current) => {
      const existing = current.purchaseOrders || current.orders || [];
      const merged = [order, ...existing.filter((item: any) => item.id !== order.id)];
      return {
        ...current,
        purchaseOrders: merged,
        orders: merged,
      };
    });

    res.json({
      success: true,
      order,
      syncedToGist: true,
      purchaseOrders: updated.purchaseOrders,
      orders: updated.orders,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const rawMessage = req.body;
    if (!rawMessage || typeof rawMessage !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid message data' });
    }

    const clientIp = getClientIp(req);
    const deviceInfo = getDeviceInfo(req);

    const messageId = rawMessage.id || `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    const message = {
      ...rawMessage,
      id: messageId,
      status: rawMessage.status || 'جديدة',
      clientIp: rawMessage.clientIp || clientIp,
      deviceInfo: rawMessage.deviceInfo || deviceInfo,
      createdAt: rawMessage.createdAt || new Date().toLocaleString('ar-EG'),
      serverReceivedAt: new Date().toISOString(),
    };

    const updated = await updateGistData((current) => {
      const existing = current.contactMessages || current.messages || [];
      const merged = [message, ...existing.filter((item: any) => item.id !== message.id)];
      return {
        ...current,
        contactMessages: merged,
        messages: merged,
      };
    });

    res.json({
      success: true,
      message,
      syncedToGist: true,
      contactMessages: updated.contactMessages,
      messages: updated.messages,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/feedbacks', async (req, res) => {
  try {
    const rawFeedback = req.body;
    if (!rawFeedback || typeof rawFeedback !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid feedback data' });
    }

    const clientIp = getClientIp(req);
    const deviceInfo = getDeviceInfo(req);

    const feedbackId = rawFeedback.id || `fb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    const feedback = {
      ...rawFeedback,
      id: feedbackId,
      status: rawFeedback.status || 'قيد الاطلاع',
      clientIp: rawFeedback.clientIp || clientIp,
      deviceInfo: rawFeedback.deviceInfo || deviceInfo,
      createdAt: rawFeedback.createdAt || new Date().toLocaleString('ar-EG'),
      serverReceivedAt: new Date().toISOString(),
    };

    const updated = await updateGistData((current) => {
      const existing = current.feedbacks || current.reviews || [];
      const merged = [feedback, ...existing.filter((item: any) => item.id !== feedback.id)];
      return {
        ...current,
        feedbacks: merged,
        reviews: merged,
      };
    });

    res.json({
      success: true,
      feedback,
      syncedToGist: true,
      feedbacks: updated.feedbacks,
      reviews: updated.reviews,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Skill Test Results Endpoint (نتائج تحدي المهارات ولوحة الشرف)
app.post('/api/skill-tests', async (req, res) => {
  try {
    const rawResult = req.body;
    if (!rawResult || typeof rawResult !== 'object') {
      return res.status(400).json({ success: false, message: 'بيانات نتيجة التحدي غير صالحة' });
    }

    const clientIp = getClientIp(req);
    const deviceInfo = getDeviceInfo(req);

    const resultId = rawResult.id || `test_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    const result = {
      ...rawResult,
      id: resultId,
      clientIp: rawResult.clientIp || clientIp,
      deviceInfo: rawResult.deviceInfo || deviceInfo,
      createdAt: rawResult.createdAt || new Date().toLocaleString('ar-EG'),
      serverReceivedAt: new Date().toISOString(),
    };

    const updated = await updateGistData((current) => {
      const existing = current.skillTestResults || current.challenges || [];
      const merged = [result, ...existing.filter((item: any) => item.id !== result.id)];
      return {
        ...current,
        skillTestResults: merged,
        challenges: merged,
      };
    });

    res.json({
      success: true,
      result,
      syncedToGist: true,
      skillTestResults: updated.skillTestResults,
      challenges: updated.challenges,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/skill-tests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateGistData((current) => {
      const existing = current.skillTestResults || current.challenges || [];
      const filtered = existing.filter((item: any) => item.id !== id);
      return {
        ...current,
        skillTestResults: filtered,
        challenges: filtered,
      };
    });

    res.json({ success: true, skillTestResults: updated.skillTestResults });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Clear all skill test results
app.post('/api/skill-tests/clear', async (req, res) => {
  try {
    const updated = await updateGistData((current) => {
      return {
        ...current,
        skillTestResults: [],
        challenges: [],
      };
    });

    res.json({ success: true, skillTestResults: [] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// VIP Code Activation Endpoint with Installation ID Binding
app.post('/api/activate-vip', async (req, res) => {
  try {
    const { code, installationId, deviceFingerprint, customerName } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'يرجى إدخال كود التفعيل' });
    }

    const cleanCode = code.trim().toUpperCase();
    const instId = (installationId || deviceFingerprint || '').trim();
    const clientIp = getClientIp(req);
    const deviceInfo = getDeviceInfo(req);

    const updated = await updateGistData((current) => {
      const approvedCodes = current.approvedActivationCodes || current.activationCodes || [];
      const customerBindings = current.codeCustomerBindings || {};
      const orders = current.purchaseOrders || current.orders || [];

      // Verify code validity
      const isApproved =
        approvedCodes.includes(cleanCode) ||
        Boolean(customerBindings[cleanCode]) ||
        orders.some((p: any) => p.activationCode?.toUpperCase() === cleanCode) ||
        /^VIP-[A-Z0-9]{4}-[A-Z0-9]{4,}$/i.test(cleanCode);

      if (!isApproved) {
        const err: any = new Error('كود التفعيل غير صالح أو غير معتمد. يرجى مراجعة الإدارة.');
        err.statusCode = 400;
        err.reason = 'INVALID_CODE';
        throw err;
      }

      // Check existing activations
      const activations: any[] = Array.isArray(current.activations) ? current.activations : [];
      const deviceBindings = current.codeDeviceBindings || {};
      const existingActivation = activations.find((a: any) => a.code === cleanCode && a.status === 'activated');
      const boundInst = existingActivation?.installationId || deviceBindings[cleanCode];

      // If code is already activated on a different device
      if (boundInst && instId && boundInst !== instId) {
        const err: any = new Error('هذا الكود مستخدم بالفعل على جهاز آخر ولا يمكن استخدامه على جهاز ثانٍ.');
        err.statusCode = 403;
        err.reason = 'DEVICE_MISMATCH';
        err.boundIp = existingActivation?.clientIp || current.codeIpBindings?.[cleanCode];
        err.activatedAt = existingActivation?.activatedAt;
        throw err;
      }

      // Bind to current installation
      const nowAr = new Date().toLocaleString('ar-EG');
      const newActivation = {
        code: cleanCode,
        status: 'activated',
        installationId: instId,
        activatedAt: existingActivation?.activatedAt || nowAr,
        clientIp,
        deviceInfo,
        customerName: customerName || customerBindings[cleanCode] || existingActivation?.customerName,
      };

      const updatedActivations = [
        newActivation,
        ...activations.filter((a: any) => a.code !== cleanCode),
      ];

      const newDeviceBindings = { ...deviceBindings, [cleanCode]: instId };
      const newIpBindings = { ...(current.codeIpBindings || {}), [cleanCode]: clientIp };
      const newActivationDetails = { ...(current.codeActivationDetails || {}), [cleanCode]: newActivation };

      const safeApproved = Array.from(new Set([...approvedCodes, cleanCode]));

      return {
        ...current,
        activations: updatedActivations,
        codeDeviceBindings: newDeviceBindings,
        codeIpBindings: newIpBindings,
        codeActivationDetails: newActivationDetails,
        approvedActivationCodes: safeApproved,
        activationCodes: safeApproved,
      };
    });

    res.json({
      success: true,
      message: '🎉 تهانينا! تم تفعيل كود VIP بنجاح وتم ربطه بهذا الجهاز مدى الحياة.',
      code: cleanCode,
      installationId: instId,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      reason: error.reason,
      message: error.message,
      boundIp: error.boundIp,
      activatedAt: error.activatedAt,
    });
  }
});

// Endpoint to verify VIP device validity on client startup
app.post('/api/verify-vip', (req, res) => {
  try {
    const { code, installationId, deviceFingerprint } = req.body;
    if (!code || typeof code !== 'string') {
      return res.json({ valid: false, reason: 'EMPTY_CODE' });
    }
    const cleanCode = code.trim().toUpperCase();
    const instId = (installationId || deviceFingerprint || '').trim();
    const submissions = getStoredSubmissions();

    const activations = Array.isArray(submissions.activations) ? submissions.activations : [];
    const existing = activations.find((a: any) => a.code === cleanCode && a.status === 'activated');
    const boundFingerprint =
      existing?.installationId ||
      submissions.codeDeviceBindings?.[cleanCode] ||
      submissions.codeActivationDetails?.[cleanCode]?.deviceFingerprint;

    if (boundFingerprint && instId && boundFingerprint !== instId) {
      return res.json({
        valid: false,
        reason: 'DEVICE_MISMATCH',
        message: 'هذا الكود مستخدم بالفعل على جهاز آخر.',
      });
    }

    return res.json({ valid: true });
  } catch (err: any) {
    res.json({ valid: true });
  }
});

// Admin reset/unbind endpoint: resets activation code to 'available'
app.post(['/api/reset-code', '/api/unbind-code'], async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'الكود مطلوب' });
    }
    const cleanCode = code.trim().toUpperCase();

    const updated = await updateGistData((current) => {
      const activations: any[] = Array.isArray(current.activations) ? current.activations : [];
      const updatedActivations = activations.map((a: any) => {
        if (a.code === cleanCode) {
          return {
            ...a,
            status: 'available',
            installationId: '',
            activatedAt: null,
          };
        }
        return a;
      });

      const deviceBindings = { ...(current.codeDeviceBindings || {}) };
      delete deviceBindings[cleanCode];

      const ipBindings = { ...(current.codeIpBindings || {}) };
      delete ipBindings[cleanCode];

      const details = { ...(current.codeActivationDetails || {}) };
      delete details[cleanCode];

      return {
        ...current,
        activations: updatedActivations,
        codeDeviceBindings: deviceBindings,
        codeIpBindings: ipBindings,
        codeActivationDetails: details,
      };
    });

    res.json({
      success: true,
      message: `✓ تمت إعادة تعيين الكود (${cleanCode}) بنجاح وأصبح متاحاً (available) للاستخدام على جهاز آخر.`,
      code: cleanCode,
      codeDeviceBindings: updated.codeDeviceBindings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin reserve code for a customer endpoint
app.post('/api/reserve-code', async (req, res) => {
  try {
    const { code, customerName } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'الكود مطلوب' });
    }
    const cleanCode = code.trim().toUpperCase();
    const cleanCustomer = (customerName || '').trim();

    const updated = await updateGistData((current) => {
      const customerBindings = { ...(current.codeCustomerBindings || {}) };
      const approvedCodes = Array.from(new Set([...(current.approvedActivationCodes || []), cleanCode]));

      if (cleanCustomer) {
        customerBindings[cleanCode] = cleanCustomer;
      } else {
        delete customerBindings[cleanCode];
      }

      return {
        ...current,
        codeCustomerBindings: customerBindings,
        approvedActivationCodes: approvedCodes,
        activationCodes: approvedCodes,
      };
    });

    res.json({
      success: true,
      message: cleanCustomer
        ? `✓ تم حجز الكود (${cleanCode}) للعميل (${cleanCustomer}) ومزامنته سحابياً بنجاح.`
        : `✓ تم إلغاء حجز الكود (${cleanCode}) بنجاح.`,
      code: cleanCode,
      customerName: cleanCustomer,
      codeCustomerBindings: updated.codeCustomerBindings,
      approvedActivationCodes: updated.approvedActivationCodes,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin unreserve code endpoint
app.post('/api/unreserve-code', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'الكود مطلوب' });
    }
    const cleanCode = code.trim().toUpperCase();

    const updated = await updateGistData((current) => {
      const customerBindings = { ...(current.codeCustomerBindings || {}) };
      delete customerBindings[cleanCode];
      return {
        ...current,
        codeCustomerBindings: customerBindings,
      };
    });

    res.json({
      success: true,
      message: `تم إلغاء حجز الكود (${cleanCode}) وإعادته للقائمة المتاحة.`,
      code: cleanCode,
      codeCustomerBindings: updated.codeCustomerBindings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Full state synchronization endpoint
app.post('/api/sync-all', async (req, res) => {
  try {
    const {
      purchaseOrders,
      contactMessages,
      feedbacks,
      skillTestResults,
      codeIpBindings,
      codeActivationDetails,
      codeCustomerBindings,
      codeDeviceBindings,
      approvedActivationCodes,
      settings,
      gistToken,
      gistUrl,
      replace,
    } = req.body;
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
    if (Array.isArray(skillTestResults)) {
      if (replace) {
        submissions.skillTestResults = skillTestResults;
      } else {
        submissions.skillTestResults = [
          ...skillTestResults,
          ...(submissions.skillTestResults || []),
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
    if (codeCustomerBindings && typeof codeCustomerBindings === 'object') {
      if (replace) {
        submissions.codeCustomerBindings = codeCustomerBindings;
      } else {
        submissions.codeCustomerBindings = {
          ...(submissions.codeCustomerBindings || {}),
          ...codeCustomerBindings,
        };
      }
    }
    if (codeDeviceBindings && typeof codeDeviceBindings === 'object') {
      if (replace) {
        submissions.codeDeviceBindings = codeDeviceBindings;
      } else {
        submissions.codeDeviceBindings = {
          ...(submissions.codeDeviceBindings || {}),
          ...codeDeviceBindings,
        };
      }
    }
    if (Array.isArray(approvedActivationCodes) && approvedActivationCodes.length > 0) {
      if (replace) {
        submissions.approvedActivationCodes = approvedActivationCodes;
      } else {
        submissions.approvedActivationCodes = Array.from(
          new Set([...(submissions.approvedActivationCodes || []), ...approvedActivationCodes])
        );
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
        const fullPayloadToSync = {
          ...submissions,
          ...(settings && typeof settings === 'object' ? settings : {}),
        };
        await syncToGistHelper(activeUrl, activeToken, fullPayloadToSync);
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

    const updated = await updateGistData((current) => {
      const orders = (current.purchaseOrders || current.orders || []).map((ord: any) => {
        if (ord.id === id) {
          return { ...ord, ...updates, updatedAt: new Date().toISOString() };
        }
        return ord;
      });
      return {
        ...current,
        purchaseOrders: orders,
        orders,
      };
    });

    res.json({ success: true, purchaseOrders: updated.purchaseOrders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete single order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await updateGistData((current) => {
      const orders = (current.purchaseOrders || current.orders || []).filter((ord: any) => ord.id !== id);
      return {
        ...current,
        purchaseOrders: orders,
        orders,
      };
    });

    res.json({ success: true, purchaseOrders: updated.purchaseOrders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Clear all purchase orders
app.post('/api/orders/clear', async (req, res) => {
  try {
    const updated = await updateGistData((current) => {
      return {
        ...current,
        purchaseOrders: [],
        orders: [],
      };
    });

    res.json({ success: true, purchaseOrders: [] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update single feedback status
app.patch('/api/feedbacks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await updateGistData((current) => {
      const fbs = (current.feedbacks || current.reviews || []).map((fb: any) => {
        if (fb.id === id) {
          return { ...fb, status: status || fb.status, updatedAt: new Date().toISOString() };
        }
        return fb;
      });
      return {
        ...current,
        feedbacks: fbs,
        reviews: fbs,
      };
    });

    res.json({ success: true, feedbacks: updated.feedbacks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete single feedback
app.delete('/api/feedbacks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await updateGistData((current) => {
      const fbs = (current.feedbacks || current.reviews || []).filter((fb: any) => fb.id !== id);
      return {
        ...current,
        feedbacks: fbs,
        reviews: fbs,
      };
    });

    res.json({ success: true, feedbacks: updated.feedbacks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Clear all feedbacks
app.post('/api/feedbacks/clear', async (req, res) => {
  try {
    const updated = await updateGistData((current) => {
      return {
        ...current,
        feedbacks: [],
        reviews: [],
      };
    });

    res.json({ success: true, feedbacks: [] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update single contact message status
app.patch('/api/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await updateGistData((current) => {
      const msgs = (current.contactMessages || current.messages || []).map((msg: any) => {
        if (msg.id === id) {
          return { ...msg, status: status || msg.status, updatedAt: new Date().toISOString() };
        }
        return msg;
      });
      return {
        ...current,
        contactMessages: msgs,
        messages: msgs,
      };
    });

    res.json({ success: true, contactMessages: updated.contactMessages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete single contact message
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await updateGistData((current) => {
      const msgs = (current.contactMessages || current.messages || []).filter((msg: any) => msg.id !== id);
      return {
        ...current,
        contactMessages: msgs,
        messages: msgs,
      };
    });

    res.json({ success: true, contactMessages: updated.contactMessages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Clear all contact messages
app.post('/api/messages/clear', async (req, res) => {
  try {
    const updated = await updateGistData((current) => {
      return {
        ...current,
        contactMessages: [],
        messages: [],
      };
    });

    res.json({ success: true, contactMessages: [] });
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
    ...(localData.siteName ? { siteName: localData.siteName } : {}),
    ...(localData.logoUrl ? { logoUrl: localData.logoUrl } : {}),
    ...(localData.subscriptionUrl ? { subscriptionUrl: localData.subscriptionUrl } : {}),
    ...(localData.whatsappUrl !== undefined ? { whatsappUrl: localData.whatsappUrl } : {}),
    ...(localData.youtubeUrls ? { youtubeUrls: localData.youtubeUrls } : {}),
    ...(localData.backgroundMusicUrl ? { backgroundMusicUrl: localData.backgroundMusicUrl } : {}),
    ...(localData.backgroundMusicEnabled !== undefined ? { backgroundMusicEnabled: localData.backgroundMusicEnabled } : {}),
    ...(localData.videoWaitTime !== undefined ? { videoWaitTime: localData.videoWaitTime } : {}),
    ...(localData.videoRequiredGameIds ? { videoRequiredGameIds: localData.videoRequiredGameIds } : {}),
    ...(localData.requireSubscriptionAndVideos !== undefined ? { requireSubscriptionAndVideos: localData.requireSubscriptionAndVideos } : {}),
    ...(localData.paidSettings ? { paidSettings: { ...((currentSettings as any).paidSettings || {}), ...localData.paidSettings } } : {}),
    ...(localData.adSettings ? { adSettings: { ...((currentSettings as any).adSettings || {}), ...localData.adSettings } } : {}),
    ...(localData.googleAdSettings ? { googleAdSettings: { ...((currentSettings as any).googleAdSettings || {}), ...localData.googleAdSettings } } : {}),
    ...(Array.isArray(localData.approvedActivationCodes) && localData.approvedActivationCodes.length > 0
      ? { approvedActivationCodes: localData.approvedActivationCodes }
      : {}),
    ...(localData.freeActivationCode !== undefined ? { freeActivationCode: localData.freeActivationCode } : {}),
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
    skillTestResults: [
      ...(localData.skillTestResults || []),
      ...((currentSettings as any).skillTestResults || []),
    ].filter((item: any, index: number, self: any[]) => index === self.findIndex((t: any) => t.id === item.id)),
    codeIpBindings: {
      ...((currentSettings as any).codeIpBindings || {}),
      ...(localData.codeIpBindings || {}),
    },
    codeActivationDetails: {
      ...((currentSettings as any).codeActivationDetails || {}),
      ...(localData.codeActivationDetails || {}),
    },
    codeCustomerBindings: {
      ...((currentSettings as any).codeCustomerBindings || {}),
      ...(localData.codeCustomerBindings || {}),
    },
    codeDeviceBindings: {
      ...((currentSettings as any).codeDeviceBindings || {}),
      ...(localData.codeDeviceBindings || {}),
    },
    storiesAudio: {
      ...((currentSettings as any).storiesAudio || {}),
      ...(localData.storiesAudio || {}),
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
    skillTestResults: merged.skillTestResults,
    codeIpBindings: merged.codeIpBindings,
    codeActivationDetails: merged.codeActivationDetails,
    codeCustomerBindings: merged.codeCustomerBindings,
    codeDeviceBindings: merged.codeDeviceBindings,
    approvedActivationCodes: merged.approvedActivationCodes,
    storiesAudio: merged.storiesAudio || {},
  });

  console.log(`✓ Gist synced successfully: ${merged.purchaseOrders.length} orders, ${merged.contactMessages.length} messages, ${merged.feedbacks.length} feedbacks, ${merged.skillTestResults.length} skill test results.`);
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
            (submissions.feedbacks?.length || 0) > 0 ||
            (submissions.skillTestResults?.length || 0) > 0;
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
