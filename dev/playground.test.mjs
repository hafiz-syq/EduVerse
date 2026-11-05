// Tes murni Node untuk mesin playground: escaping payload, penerjemah pesan sandbox,
// penilai tugas, dan penyimpanan draf. Tidak menyentuh DOM maupun jaringan.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import vm from 'node:vm';

import {
  PROYEK_AWAL,
  amanJSON,
  bangunDokumenWeb,
  bangunKodeWorker,
  buildPayload,
  tafsirkanBerita,
  tafsirkanCek,
} from '../lib/playground/runner.ts';
import { TUGAS, cariTugas, nilaiCekWeb, nilaiOutput } from '../lib/playground/tasks.ts';
import { KUNCI_DRAF, bacaDraf, benihDariKode, simpanDraf, simpananMemori } from '../lib/playground/draft.ts';

const ambilScript = (dokumen) => {
  const mulai = dokumen.indexOf('<script>') + '<script>'.length;
  const akhir = dokumen.lastIndexOf('</script>');
  return dokumen.slice(mulai, akhir);
};

test('payload tidak bisa keluar dari tag script tempat ia disisipkan', () => {
  const jahat = '</script><script>alert(1)</script><img src=x onerror=alert(2)>';
  const payload = buildPayload({ ...PROYEK_AWAL, js: jahat }, [], null, 1);
  const dokumen = bangunDokumenWeb(PROYEK_AWAL, payload);
  const jumlahTutup = dokumen.match(/<\/script>/g) ?? [];
  assert.equal(jumlahTutup.length, 1, 'hanya satu penutup script milik kami');
  assert.ok(!dokumen.includes('<img src=x'), 'markup dari dalam kode tidak ikut terbentuk');
});

test('sumber worker dan skrip pratinjau adalah JavaScript yang sah', () => {
  const payload = buildPayload(PROYEK_AWAL, [{ selector: '#judul', text: 'Halo' }], '#tombol', 2);
  assert.doesNotThrow(() => new Function(bangunKodeWorker(payload)));
  assert.doesNotThrow(() => new Function(ambilScript(bangunDokumenWeb(PROYEK_AWAL, payload))));
});

test('payload yang disisipkan bisa dibaca kembali persis oleh sandbox', () => {
  const payload = buildPayload({ html: '<p>a</p>', css: 'p{color:red}', js: 'print("1<2")' }, [{ selector: '#x' }], null, 3);
  const sumber = bangunKodeWorker(payload);
  const json = sumber.slice(sumber.indexOf('__ev_jalankan(') + '__ev_jalankan('.length, sumber.lastIndexOf(');'));
  assert.deepEqual(JSON.parse(json), payload);
  assert.ok(amanJSON(payload).includes('\\u003c'), 'tanda < dikodekan sebagai escape Unicode');
});

test('setiap berita sandbox membawa nomor run dari payload', () => {
  // Konteks vm meniru WorkerGlobalScope: self === globalThis, tanpa window dan tanpa document.
  const sandbox = { berita: [] };
  const ctx = vm.createContext(sandbox);
  vm.runInContext('globalThis.self = globalThis; self.postMessage = (m) => berita.push(m);', ctx);
  vm.runInContext(bangunKodeWorker(buildPayload({ html: '', css: '', js: 'print("hai")' }, [], null, 7)), ctx);
  assert.deepEqual(
    sandbox.berita.map((m) => [m.kind, m.run, m.text]),
    [
      ['out', 7, 'hai'],
      ['done', 7, undefined],
    ],
    'kirim menandai run sebelum pesan meninggalkan sandbox',
  );
});

test('pesan asing dan pesan selesai tidak menjadi baris konsol', () => {
  assert.equal(tafsirkanBerita({ source: 'ekstensi-lain', kind: 'out', text: 'x' }), null);
  assert.equal(tafsirkanBerita(undefined), null);
  assert.equal(tafsirkanBerita({ source: 'eduverse-sandbox', kind: 'done' }), null);
  assert.deepEqual(tafsirkanBerita({ source: 'eduverse-sandbox', kind: 'out', level: 'warn', text: 'hati-hati' }), {
    kind: 'warn',
    text: 'hati-hati',
  });
  assert.deepEqual(tafsirkanBerita({ source: 'eduverse-sandbox', kind: 'fail', text: 'ReferenceError: z' }), {
    kind: 'error',
    text: 'ReferenceError: z',
  });
});

test('hasil penilaian frame dibaca sebagai cek, bukan sebagai konsol', () => {
  const berita = { source: 'eduverse-sandbox', kind: 'check', selector: '#judul', ok: true, detail: '#judul terisi' };
  assert.deepEqual(tafsirkanCek(berita), { selector: '#judul', ok: true, detail: '#judul terisi' });
  assert.equal(tafsirkanCek({ source: 'eduverse-sandbox', kind: 'out', text: 'halo' }), null);
  assert.equal(tafsirkanBerita(berita), null);
});

test('penilai output membandingkan baris log secara urut dan persis', () => {
  const harapan = ['1', '4', '9'];
  assert.equal(nilaiOutput(harapan, [{ kind: 'log', text: '1' }, { kind: 'log', text: '4' }, { kind: 'log', text: '9' }]).lulus, true);
  assert.equal(nilaiOutput(harapan, [{ kind: 'log', text: '1' }, { kind: 'log', text: '9' }, { kind: 'log', text: '4' }]).lulus, false, 'urutannya dihitung');
  assert.equal(nilaiOutput(harapan, [{ kind: 'log', text: '1' }, { kind: 'log', text: '4' }, { kind: 'log', text: '9' }, { kind: 'log', text: '16' }]).lulus, false, 'kelebihan baris itu salah');
  assert.equal(
    nilaiOutput(harapan, [{ kind: 'log', text: '1' }, { kind: 'warn', text: 'ingatan' }, { kind: 'log', text: '4' }, { kind: 'log', text: '9' }]).lulus,
    true,
    'warning tidak dihitung sebagai output',
  );
  assert.equal(nilaiOutput([], [{ kind: 'log', text: 'a' }]).lulus, false, 'tanpa harapan tidak pernah dinyatakan lulus');
});

test('penilai web menuntut seluruh kondisi dinilai dan lulus', () => {
  const lulus = [{ ok: true, detail: 'a' }, { ok: true, detail: 'b' }];
  assert.equal(nilaiCekWeb(2, lulus).lulus, true);
  assert.equal(nilaiCekWeb(2, [{ ok: true, detail: 'a' }]).lulus, false, 'kondisi belum lengkap');
  assert.equal(nilaiCekWeb(2, [...lulus, { ok: false, detail: 'c' }]).lulus, false);
  assert.equal(nilaiCekWeb(0, []).lulus, false);
});

test('draf tersimpan dan dibaca ulang, rusak dianggap tidak ada', () => {
  const simpan = simpananMemori();
  assert.equal(bacaDraf(simpan), null);
  simpanDraf(simpan, { mode: 'web', project: PROYEK_AWAL, tugasId: 'judul', pembaruan: 1 });
  const dipulihkan = bacaDraf(simpan);
  assert.equal(dipulihkan.mode, 'web');
  assert.equal(dipulihkan.tugasId, 'judul');
  assert.equal(dipulihkan.project.html, PROYEK_AWAL.html);
  simpan.setItem(KUNCI_DRAF, '{bukan json');
  assert.equal(bacaDraf(simpan), null);
  simpan.setItem(KUNCI_DRAF, JSON.stringify({ mode: 'sihir', project: PROYEK_AWAL }));
  assert.equal(bacaDraf(simpan), null);
});

test('blok kode Materi dipetakan ke mode yang benar', () => {
  assert.equal(benihDariKode('const a = 1;', 'js').mode, 'js');
  assert.equal(benihDariKode('<h1>Halo</h1>').mode, 'web');
  assert.equal(benihDariKode('#kotak { color: red; }', 'css').project.css.includes('color'), true);
  assert.equal(benihDariKode('const a = 1;').project.html, '');
});

test('setiap latihan punya mode, materi awal, dan kriteria penilaiannya sendiri', () => {
  for (const tugas of TUGAS) {
    assert.ok(cariTugas(tugas.id), `${tugas.id} bisa ditemukan`);
    assert.ok(typeof tugas.mulai.js === 'string', `${tugas.id} punya kode awal`);
    assert.ok(tugas.petunjuk.length > 0, `${tugas.id} punya petunjuk`);
    if (tugas.mode === 'js') {
      assert.equal(tugas.cek.length, 0, `${tugas.id} mode JS tidak menilai DOM`);
      assert.ok(tugas.harapan.length > 0, `${tugas.id} mode JS butuh harapan output`);
    } else {
      assert.equal(tugas.harapan.length, 0, `${tugas.id} mode Web menilai DOM, bukan konsol`);
      assert.ok(tugas.cek.length > 0, `${tugas.id} mode Web butuh kondisi`);
      assert.ok(tugas.cek.every((c) => typeof c.selector === 'string' && c.selector.length > 0));
    }
  }
});
