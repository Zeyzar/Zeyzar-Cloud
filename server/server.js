import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const USERNAME = process.env.OWNER_USERNAME;
const PASSWORD = process.env.OWNER_PASSWORD;
const COOKIE_SECURE = process.env.COOKIE_SECURE !== 'false';
const SESSION_TTL = 12 * 60 * 60 * 1000;
const sessions = new Map();
const attempts = new Map();
const MIME = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.ico':'image/x-icon', '.woff2':'font/woff2', '.json':'application/json; charset=utf-8' };

function safeEqualText(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
function send(res, status, data, headers = {}) {
  res.writeHead(status, { 'content-type':'application/json; charset=utf-8', 'cache-control':'no-store', ...headers });
  res.end(JSON.stringify(data));
}
function cookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').map(v => v.trim().split(/=(.*)/s)).filter(v => v.length === 2));
}
async function body(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 8192) throw new Error('Request body too large');
  }
  return raw ? JSON.parse(raw) : {};
}
function clientKey(req) { return req.socket.remoteAddress || 'unknown'; }
function cookie(value, maxAge) {
  return `zeyzar_session=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${COOKIE_SECURE ? '; Secure' : ''}`;
}
function getSession(req) {
  const id = cookies(req).zeyzar_session;
  const session = id && sessions.get(id);
  if (!session || session.expiresAt < Date.now()) {
    if (id) sessions.delete(id);
    return null;
  }
  session.expiresAt = Date.now() + SESSION_TTL;
  return session;
}
async function handleApi(req, res, url) {
  if (req.method === 'GET' && url.pathname === '/api/health') return send(res, 200, { ok:true, service:'zeyzar-cloud', mode:'self-hosted' });
  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    if (!USERNAME || !PASSWORD || PASSWORD.length < 12) return send(res, 503, { error:'Owner access is not configured. Set OWNER_USERNAME and a 12+ character OWNER_PASSWORD.' });
    const key = clientKey(req), now = Date.now(), state = attempts.get(key) || { count:0, until:0 };
    if (state.until > now) return send(res, 429, { error:'Too many attempts. Try again in a few minutes.' });
    let input;
    try { input = await body(req); } catch { return send(res, 400, { error:'Invalid request.' }); }
    const submittedUser = String(input.username || '');
    const submittedPass = String(input.password || '');
    const userOk = submittedUser.length === USERNAME.length && timingSafeEqual(Buffer.from(submittedUser), Buffer.from(USERNAME));
    const passOk = submittedPass.length === PASSWORD.length && timingSafeEqual(Buffer.from(submittedPass), Buffer.from(PASSWORD));
    if (!userOk || !passOk) {
      state.count += 1;
      if (state.count >= 5) { state.count = 0; state.until = now + 5 * 60 * 1000; }
      attempts.set(key, state);
      return send(res, 401, { error:'Username or password is incorrect.' });
    }
    attempts.delete(key);
    const id = randomBytes(32).toString('base64url');
    sessions.set(id, { username:USERNAME, expiresAt:now + SESSION_TTL });
    return send(res, 200, { ok:true, user:{ username:USERNAME } }, { 'set-cookie':cookie(id, SESSION_TTL / 1000) });
  }
  if (req.method === 'GET' && url.pathname === '/api/auth/me') {
    const session = getSession(req);
    return session ? send(res, 200, { authenticated:true, user:{ username:session.username } }) : send(res, 401, { authenticated:false });
  }
  if (req.method === 'POST' && url.pathname === '/api/auth/logout') {
    const id = cookies(req).zeyzar_session;
    if (id) sessions.delete(id);
    return send(res, 200, { ok:true }, { 'set-cookie':cookie('', 0) });
  }
  const session = getSession(req);
  if (!session) return send(res, 401, { error:'Authentication required.' });
  return send(res, 404, { error:'API route not found.' });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname.startsWith('/api/')) return handleApi(req, res, url).catch(() => send(res, 500, { error:'Internal server error.' }));
  if (!existsSync(DIST)) return send(res, 503, { error:'Frontend is not built. Run npm run build first.' });
  let requested = decodeURIComponent(url.pathname);
  let file = path.resolve(DIST, `.${requested}`);
  if (!file.startsWith(DIST + path.sep) && file !== path.join(DIST, 'index.html')) return send(res, 403, { error:'Forbidden.' });
  if (!existsSync(file) || !statSync(file).isFile()) file = path.join(DIST, 'index.html');
  res.writeHead(200, { 'content-type':MIME[path.extname(file)] || 'application/octet-stream', 'x-content-type-options':'nosniff', 'referrer-policy':'strict-origin-when-cross-origin' });
  createReadStream(file).pipe(res);
});

setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions) if (session.expiresAt < now) sessions.delete(id);
}, 15 * 60 * 1000).unref();

server.listen(PORT, HOST, () => {
  console.log(`ZEYZAR CLOUD self-hosted server listening on http://${HOST}:${PORT}`);
  if (!USERNAME || !PASSWORD || PASSWORD.length < 12) console.warn('Owner login is disabled until OWNER_USERNAME and a 12+ character OWNER_PASSWORD are configured.');
});
