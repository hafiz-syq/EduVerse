// Dev server API EduVerse (Node). Meniru ingress Function: DB dan storage tiruan,
// identitas dev yang bisa diganti, sehingga frontend dan aturan XP/arena teruji
// sebelum backend cloud tersedia. Folder dev/ tidak ikut paket publikasi.
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { application } from '../functions/src/application.mjs';
import { typedResponse } from '../functions/src/core.mjs';
import { createFakeDb } from './fake-db.mjs';
import { parseMigrations } from './schema.mjs';

const HOST = '127.0.0.1';
const PORT = Number(process.env.DEV_API_PORT || 8000);
const PROJECT = join(import.meta.dirname, '..');
const STATE_FILE = join(PROJECT, '.dev', 'local-db.json');
const ASSET_DIR = join(PROJECT, '.dev', 'assets');
const SESSION_COOKIE = '__Host-ev_session';
const DEV_SESSION_COOKIE = 'ev_dev_session';
const DEV_ACCOUNT_COOKIE = 'ev_dev_account';

const ACCOUNTS = {
  'learner-a': { user_id: 'dev-learner-a', name: 'Rangga' },
  'learner-b': { user_id: 'dev-learner-b', name: 'Wisnu' },
  admin: { user_id: 'dev-admin', name: 'Hafiz' },
};

const cookieOf = (request, name) => {
  for (const part of (request.headers.get('cookie') ?? '').split(';')) {
    const index = part.indexOf('=');
    if (index > 0 && part.slice(0, index).trim() === name) return decodeURIComponent(part.slice(index + 1).trim());
  }
  return null;
};

function contextUser(ctx) {
  const key = ctx.request.headers.get('x-dev-account') ?? cookieOf(ctx.request, DEV_ACCOUNT_COOKIE);
  const account = key ? ACCOUNTS[key] : null;
  return account ? { ...account, picture: '' } : null;
}

function loadSeedRows() {
  if (process.argv.includes('--fresh') || !existsSync(STATE_FILE)) return {};
  try {
    return JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

const schema = parseMigrations(join(PROJECT, 'migrations'));
const db = createFakeDb(schema, loadSeedRows());
let pending = null;
function flush(tables, sync = false) {
  pending = tables;
  if (sync) {
    mkdirSync(dirname(STATE_FILE), { recursive: true });
    writeFileSync(STATE_FILE, JSON.stringify(tables));
    pending = null;
    return;
  }
  clearTimeout(flush.timer);
  flush.timer = setTimeout(() => flush(pending, true), 400);
}
process.on('exit', () => { if (pending) flush(pending, true); });
if (!process.argv.includes('--no-save')) db.__attach(flush);

const storage = {
  async createSignedUrl(path) { return { signedUrl: `/dev-assets/${path}` }; },
  async createSignedUploadUrl(path) { return { signedUrl: `/dev-assets/${path}?put=1`, path }; },
};

const env = {
  APP_SESSION_SECRET: process.env.APP_SESSION_SECRET || 'dev-only-insecure-secret',
  APP_ADMIN_IDENTITIES: 'qoder:dev-admin',
  APP_GOOGLE_CLIENT_ID: process.env.APP_GOOGLE_CLIENT_ID || '',
  APP_GOOGLE_CLIENT_SECRET: process.env.APP_GOOGLE_CLIENT_SECRET || '',
  APP_GITHUB_CLIENT_ID: process.env.APP_GITHUB_CLIENT_ID || '',
  APP_GITHUB_CLIENT_SECRET: process.env.APP_GITHUB_CLIENT_SECRET || '',
  APP_PUBLIC_URL: process.env.APP_PUBLIC_URL || '',
};

const handle = application({ db, storage, env, contextUser });

async function toWebRequest(req) {
  const host = req.headers.host ?? `${HOST}:${PORT}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) value.forEach((item) => headers.append(key, item));
    else headers.set(key, value);
  }
  // Browser mengirim cookie/name sesi tanpa atribut Secure di http lokal; dipetakan
  // kembali ke nama produksi supaya kode identitas tidak punya cabang khusus dev.
  const cookie = headers.get('cookie');
  if (cookie?.includes(`${DEV_SESSION_COOKIE}=`)) headers.set('cookie', cookie.replace(DEV_SESSION_COOKIE, SESSION_COOKIE));
  const origin = headers.get('origin');
  if (origin) {
    try {
      headers.set('origin', new URL(origin).protocol + '//' + host);
    } catch { /* origin rusak dibiarkan; pemeriksaan asal akan menolaknya */ }
  }
  const method = req.method ?? 'GET';
  const chunks = [];
  if (method !== 'GET' && method !== 'HEAD') for await (const chunk of req) chunks.push(chunk);
  return new Request(`http://${host}${req.url}`, {
    method,
    headers,
    body: chunks.length ? Buffer.concat(chunks) : undefined,
  });
}

function assetFile(pathname) {
  const relative = decodeURIComponent(pathname.replace('/dev-assets/', ''));
  const target = resolve(ASSET_DIR, relative);
  return target === ASSET_DIR || target.startsWith(ASSET_DIR + sep) ? target : null;
}

async function serveAsset(request, response, pathname) {
  const target = assetFile(pathname);
  if (!target) return response.writeHead(400).end('path di luar folder aset dev');
  if (request.method === 'PUT') {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, Buffer.from(await request.arrayBuffer()));
    return response.writeHead(200, { 'content-type': 'application/json' }).end('{"ok":true}');
  }
  if (!existsSync(target)) return response.writeHead(404, { 'content-type': 'text/plain' }).end('aset belum diunggah');
  const body = readFileSync(target);
  const type = target.endsWith('.svg') ? 'image/svg+xml' : target.endsWith('.png') ? 'image/png' : target.endsWith('.webp') ? 'image/webp' : 'application/octet-stream';
  return response.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' }).end(body);
}

function devEndpoint(request, response, pathname) {
  const account = request.headers.get('x-dev-account') ?? cookieOf(request, DEV_ACCOUNT_COOKIE) ?? 'anon';
  if (pathname === '/__dev/accounts') {
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
    response.end(JSON.stringify({ current: account, accounts: ['anon', ...Object.keys(ACCOUNTS)] }));
    return true;
  }
  if (pathname.startsWith('/__dev/switch')) {
    const as = new URL(request.url, `http://${request.headers.host}`).searchParams.get('as') ?? 'anon';
    const value = as === 'anon' || Object.hasOwn(ACCOUNTS, as) ? as : 'anon';
    response.writeHead(302, { location: '/', 'set-cookie': `${DEV_ACCOUNT_COOKIE}=${value}; Path=/; SameSite=Lax; Max-Age=${30 * 24 * 3600}` });
    response.end();
    return true;
  }
  if (pathname === '/__dev/reset' && request.method === 'POST') {
    db.__tables.clear();
    flush(db.__dump(), true);
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
    response.end(JSON.stringify({ ok: true, note: 'data lokal dibersihkan; seed dibuat ulang pada permintaan berikutnya' }));
    return true;
  }
  return false;
}

async function writeResponse(res, response) {
  const headers = Object.fromEntries(response.headers.entries());
  // Prefiks __Host- menuntut HTTPS; di http lokal namanya dipetakan dan Secure dilepas.
  const cookies = (response.headers.getSetCookie?.() ?? []).map((value) =>
    value.replace(SESSION_COOKIE, DEV_SESSION_COOKIE).replace(/;\s*Secure/i, ''));
  // setHeader() setelah writeHead() melempar ERR_HTTP_HEADERS_SENT dan mematikan proses,
  // jadi cookie harus masuk sebelum header ditulis — routes logout dan OAuth selalu membawanya.
  if (cookies.length) headers['set-cookie'] = cookies;
  else delete headers['set-cookie'];
  res.writeHead(response.status, headers);
  res.end(Buffer.from(await response.arrayBuffer()));
}

const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host ?? HOST}`).pathname;
  const requestId = `dev-${Date.now().toString(36)}`;
  try {
    if (pathname.startsWith('/dev-assets/')) return await serveAsset(req, res, pathname);
    const request = await toWebRequest(req);
    if (devEndpoint(request, res, pathname)) return;
    await writeResponse(res, await handle({ request, requestId }));
  } catch (error) {
    // Sama seperti index.ts: galat bertipe memakai ampul JSON yang sama.
    const failure = typedResponse(error, requestId) ?? new Response(
      JSON.stringify({ ok: false, error: 'dev_server_error', request_id: requestId, detail: String(error?.stack ?? error) }),
      { status: 500, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } }
    );
    await writeResponse(res, failure);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`API EduVerse lokal: http://${HOST}:${PORT}/api/health`);
  console.log(`Ganti identitas dev: http://${HOST}:${PORT}/__dev/switch?as=learner-b (learner-a, learner-b, admin, anon)`);
  console.log(`Reset data lokal:   POST http://${HOST}:${PORT}/__dev/reset`);
});
