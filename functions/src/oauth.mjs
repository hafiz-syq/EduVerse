// Masuk dengan identitas milik pengguna sendiri (email) lewat Google atau GitHub.
// Function yang menukar code ke token, jadi rahasia klien tidak pernah menyentuh browser.

import { applicationPath, cookieValue, fail, randomToken } from './core.mjs';

const STATE_COOKIE = 'ev_oauth';
const STATE_TTL = 600;

const PROVIDERS = {
  google: {
    authorize: 'https://accounts.google.com/o/oauth2/v2/auth',
    token: 'https://oauth2.googleapis.com/token',
    profile: 'https://www.googleapis.com/oauth2/v3/userinfo',
    scope: 'openid email profile',
    clientId: 'APP_GOOGLE_CLIENT_ID',
    clientSecret: 'APP_GOOGLE_CLIENT_SECRET',
    label: 'Google',
  },
  github: {
    authorize: 'https://github.com/login/oauth/authorize',
    token: 'https://github.com/login/oauth/access_token',
    profile: 'https://api.github.com/user',
    emails: 'https://api.github.com/user/emails',
    scope: 'read:user user:email',
    clientId: 'APP_GITHUB_CLIENT_ID',
    clientSecret: 'APP_GITHUB_CLIENT_SECRET',
    label: 'GitHub',
  },
};

export const providerKeys = Object.keys(PROVIDERS);

const stateCookie = (token, maxAge, secure) =>
  `${STATE_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;

// Setiap cookie wajib jadi header Set-Cookie sendiri. Digabung dengan ", " akan
// terurai sebagai satu cookie saja: Max-Age cookie sesi menelan cookie berikutnya,
// sesi berubah jadi cookie-per-session, dan state lama tidak pernah dihapus.
const redirect = (location, cookies) => {
  const headers = new Headers({ location });
  for (const cookie of Array.isArray(cookies) ? cookies : [cookies]) headers.append('set-cookie', cookie);
  return new Response(null, { status: 302, headers });
};

async function readProfile(url, token) {
  const response = await fetch(url, { headers: { authorization: `Bearer ${token}`, accept: 'application/json', 'user-agent': 'EduVerse' } });
  if (!response.ok) fail('provider_unavailable', 502, `Profil ${url} menolak dibaca.`);
  return response.json();
}

async function exchange(config, { code, redirectUri, secret }) {
  const response = await fetch(config.token, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: config.clientId,
      client_secret: secret,
      redirect_uri: redirectUri,
    }).toString(),
  });
  if (!response.ok) fail('provider_unavailable', 502, ` penukar token menolak (${response.status}).`);
  const payload = await response.json().catch(() => null);
  if (!payload?.access_token) fail('provider_unavailable', 502, 'Token akses tidak diterima dari penyedia.');
  return payload.access_token;
}

export function createOAuth({ env, identity }) {
  const configFor = (key) => {
    const config = PROVIDERS[key];
    if (!config) fail('unknown_provider', 400);
    const clientId = env[config.clientId];
    const clientSecret = env[config.clientSecret];
    if (!clientId || !clientSecret) fail('provider_unavailable', 503, `${config.label} belum dikonfigurasi di Site Settings.`);
    return { ...config, clientId, clientSecret };
  };

  const callbackUrl = (request) => {
    const url = new URL(request.url);
    const path = applicationPath(url.pathname);
    const mounted = url.pathname.slice(0, url.pathname.length - path.length);
    if (!env.APP_PUBLIC_URL) return `${url.origin}${mounted}/api/auth/callback`;
    const base = new URL(env.APP_PUBLIC_URL);
    return `${base.origin}${base.pathname.replace(/\/$/, '')}${mounted}/api/auth/callback`;
  };

  function start(key, request) {
    const config = configFor(key);
    const state = randomToken();
    const redirectUri = callbackUrl(request);
    const target = new URL(config.authorize);
    target.searchParams.set('client_id', config.clientId);
    target.searchParams.set('redirect_uri', redirectUri);
    target.searchParams.set('response_type', 'code');
    target.searchParams.set('scope', config.scope);
    target.searchParams.set('state', state);
    if (key === 'google') target.searchParams.set('prompt', 'select_account');
    const secure = new URL(request.url).protocol === 'https:';
    return redirect(target.toString(), stateCookie(state, STATE_TTL, secure));
  }

  async function finish(key, request, query) {
    const config = configFor(key);
    const state = query.get('state');
    const code = query.get('code');
    if (!state || state !== cookieValue(request, STATE_COOKIE)) fail('state_mismatch', 400, 'Permintaan masuk tidak cocok. Coba lagi.');
    if (!code) fail('code_missing', 400, 'Kode otorisasi tidak dikirim penyedia.');
    const accessToken = await exchange(config, { code, redirectUri: callbackUrl(request), secret: config.clientSecret });
    const profile = await readProfile(config.profile, accessToken);
    let email = (profile.email || '').toLowerCase();
    if (key === 'github') {
      if (!email) {
        const list = await fetch(config.emails, { headers: { authorization: `Bearer ${accessToken}`, accept: 'application/json', 'user-agent': 'EduVerse' } })
          .then((response) => (response.ok ? response.json() : []))
          .catch(() => []);
        email = String((Array.isArray(list) ? list.find((item) => item.primary) || list[0]?.email : '') || '').toLowerCase();
      }
      if (!email) fail('email_missing', 400, 'Akun GitHub Anda tidak expose alamat email. Izinkan akses email lalu masuk ulang.');
    }
    if (!email) fail('email_missing', 400, 'Penyedia tidak mengirim alamat email.');
    const user = await identity.upsert({
      identity: `${key}:${email}`,
      email,
      name: profile.name || profile.login || email.split('@')[0],
      picture: profile.picture || profile.avatar_url || '',
    });
    const session = await identity.startSession(user);
    const secure = new URL(request.url).protocol === 'https:';
    // Sesi baru selalu dibuka di dasbor: `/` kini halaman publik yang menggeser
    // pengguna bersesi ke sana, jadi mengarahkan ke `/` hanya menambah satu lompatan.
    return redirect('/dashboard', [session.cookie, stateCookie('', 0, secure)]);
  }

  return { finish, start };
}
