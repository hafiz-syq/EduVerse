// Slot iklan mandiri. Yang disajikan hanya konfigurasi dari Panel Pemilik; tidak ada
// request pihak ketiga di sini, sehingga tetap aman dan tetap tampil saat luring.

import { fail, text, clampInt, rateLimit, isUuid } from './core.mjs';

const KINDS = ['banner', 'card', 'native'];
const SLOT_KEYS = ['top-banner', 'sidebar', 'in-feed', 'module-footer'];

export function createAds({ store, storage }) {
  async function decorate(slot) {
    if (!slot.image_path || !storage) return { ...slot, image_url: '' };
    try {
      const signed = await storage.createSignedUrl(slot.image_path);
      return { ...slot, image_url: typeof signed?.signedUrl === 'string' ? signed.signedUrl : '' };
    } catch {
      return { ...slot, image_url: '' };
    }
  }

  async function list(slotKey) {
    const slots = await store.all('ad_slots', 'id,slot_key,kind,title,sponsor,image_path,target_url,enabled,priority,starts_at,ends_at', { column: 'priority', ascending: true }, 30);
    const now = Date.now();
    const usable = slots
      .filter((s) => s.enabled && (!s.starts_at || new Date(s.starts_at).getTime() <= now) && (!s.ends_at || new Date(s.ends_at).getTime() > now))
      .filter((s) => !slotKey || s.slot_key === slotKey);
    const out = [];
    for (const slot of usable) out.push(await decorate(slot));
    return { slots: out, consent_required: out.some((s) => Boolean(s.target_url)) };
  }

  async function event(user, body) {
    if (!SLOT_KEYS.includes(body?.slot_key) || !['view', 'click'].includes(body?.kind)) fail('invalid_input', 400);
    const principal = user?.id ?? 'anon';
    const limit = await rateLimit(store, { action: 'ad_event', principal, limit: 120, windowSeconds: 86400 });
    if (!limit.allowed) return { ok: true, counted: false };
    await store.insert('ad_events', { id: crypto.randomUUID(), slot_key: body.slot_key, kind: body.kind, day: new Date().toISOString().slice(0, 10), user_id: user?.id ?? '', occurred_at: new Date().toISOString() });
    return { ok: true, counted: true };
  }

  async function metrics() {
    const events = await store.list('ad_events', 'slot_key,kind,day', [['day', new Date().toISOString().slice(0, 10)]], undefined, 400);
    const totals = new Map();
    for (const item of events) {
      const row = totals.get(item.slot_key) ?? { views: 0, clicks: 0 };
      if (item.kind === 'view') row.views += 1;
      else row.clicks += 1;
      totals.set(item.slot_key, row);
    }
    const slots = await store.all('ad_slots', 'id,slot_key,title,sponsor,enabled,target_url', { column: 'priority', ascending: true }, 30);
    return {
      day: new Date().toISOString().slice(0, 10),
      slots: slots.map((s) => ({ ...s, ...(totals.get(s.slot_key) ?? { views: 0, clicks: 0 }) })),
    };
  }

  async function save(admin, body) {
    if (!SLOT_KEYS.includes(body?.slot_key)) fail('invalid_input', 400);
    if (!KINDS.includes(body?.kind ?? 'banner')) fail('invalid_input', 400);
    if (!text(body?.title ?? '', 3, 120)) fail('invalid_input', 400);
    if (typeof body?.target_url !== 'string' || (body.target_url && !/^https:\/\//.test(body.target_url))) fail('invalid_input', 400);
    if (!clampInt(body?.priority ?? 1, 1, 20)) fail('invalid_input', 400);
    const row = {
      slot_key: body.slot_key,
      kind: body.kind ?? 'banner',
      title: body.title.trim(),
      sponsor: typeof body.sponsor === 'string' ? body.sponsor.slice(0, 40) : 'Iklan',
      image_path: typeof body.image_path === 'string' ? body.image_path.slice(0, 300) : '',
      target_url: body.target_url ?? '',
      enabled: body.enabled !== false,
      priority: body.priority ?? 1,
      starts_at: text(body?.starts_at, 10, 40) ? new Date(body.starts_at).toISOString() : null,
      ends_at: text(body?.ends_at, 10, 40) ? new Date(body.ends_at).toISOString() : null,
    };
    if (isUuid(body?.id)) {
      const existing = await store.one('ad_slots', 'id,slot_key', [['id', body.id]]);
      if (!existing) fail('not_found', 404);
      await store.patch('ad_slots', row, [['id', existing.id]], 'id');
      return { id: existing.id, ...row };
    }
    // Kunci slot tetap empat nama yang sama, jadi penyimpanan tanpa id memperbarui baris yang ada.
    const byKey = await store.one('ad_slots', 'id', [['slot_key', body.slot_key]]);
    if (byKey) {
      await store.patch('ad_slots', row, [['id', byKey.id]], 'id');
      return { id: byKey.id, ...row };
    }
    const id = crypto.randomUUID();
    await store.insert('ad_slots', { id, ...row, created_at: new Date().toISOString() });
    return { id, ...row };
  }

  async function signImage(admin, body) {
    if (!storage) fail('storage_not_configured', 503);
    const path = `ads/${crypto.randomUUID()}.png`;
    const signed = await storage.createSignedUploadUrl(path, { upsert: false });
    return { path, ...signed };
  }

  return { event, list, metrics, save, signImage, SLOT_KEYS };
}
