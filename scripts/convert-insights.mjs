// Converts the six "Profectus Blogs" Word docs into src/content/insights/*.md
// and copies the post images into src/assets/insights/.
//
//   node scripts/convert-insights.mjs
//
// Source: blog-source/ (gitignored). docs/*.docx, images/<category>/NNN-slug.png.
// mammoth reads the docx. The writers typed lists and tables as markdown text
// inside single Word paragraphs ("- **A.** text - **B.** text",
// "| a | b | |---|---| | 1 | 2 |"), so those paragraphs are split back into
// real markdown here. Nothing is retyped. Anything unexpected stops the run.
import mammoth from 'mammoth';
import { readdir, readFile, writeFile, mkdir, copyFile, rm } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'blog-source');
const OUT_MD = path.join(ROOT, 'src/content/insights');
const OUT_IMG = path.join(ROOT, 'src/assets/insights');
// No dates in the docs: every post goes out on the launch date.
const PUB_DATE = process.env.INSIGHTS_DATE || '2026-11-19';

const fail = (msg) => { console.error('STOP: ' + msg); process.exit(1); };
const decode = (s) => s
  .replace(/<[^>]+>/g, '')
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

// ---- images: number -> { category, slug, file }
const images = new Map();
for (const cat of (await readdir(path.join(SRC, 'images'), { withFileTypes: true })).filter((d) => d.isDirectory())) {
  for (const f of await readdir(path.join(SRC, 'images', cat.name))) {
    const m = f.match(/^(\d{3})-([a-z0-9-]+)\.png$/);
    if (!m) continue;
    const n = Number(m[1]);
    if (images.has(n)) fail(`two images for ${n}`);
    images.set(n, { category: cat.name, slug: m[2], file: path.join(SRC, 'images', cat.name, f), name: f });
  }
}

// ---- docs -> blocks
const blocks = [];
const docs = (await readdir(path.join(SRC, 'docs'))).filter((f) => f.endsWith('.docx'));
for (const d of docs) {
  const { value: html, messages } = await mammoth.convertToHtml({ path: path.join(SRC, 'docs', d) });
  const warn = messages.filter((m) => m.type !== 'info');
  if (warn.length) console.warn(d, warn.map((m) => m.message));
  for (const [, tag, inner] of html.matchAll(/<(h1|h2|h3|p)>(.*?)<\/\1>/gs)) {
    // Some headings carry the next paragraph after a line break
    // ("An example\nTake an example..."): first line is the heading, the rest
    // are paragraphs.
    const [first, ...more] = decode(inner.replace(/<br\s*\/?>/g, '\n')).split('\n').map((l) => l.trim());
    if (first) blocks.push({ tag, text: first, doc: d });
    for (const l of more) if (l) blocks.push({ tag: 'p', text: l, doc: d, split: true });
  }
}

// ---- split into posts
const posts = [];
for (const b of blocks) {
  if (b.tag === 'h1') {
    const m = b.text.match(/^(\d+)\.\s+(.+)$/);
    if (!m) fail(`h1 without a number: ${b.text}`);
    posts.push({ number: Number(m[1]), title: m[2].trim(), doc: b.doc, raw: [] });
  } else {
    if (!posts.length) fail(`text before the first post: ${b.text}`);
    posts.at(-1).raw.push(b);
  }
}

// ---- paragraph -> markdown
function splitBullets(t) {
  // "- a - b - c": items are separated by " - ". Prose in the docs never uses
  // " - " (checked), so this is safe; the report lists every split.
  const items = t.replace(/^- /, '').split(/ - (?=\S)/);
  return items.map((i) => `- ${i.trim()}`).join('\n');
}
function splitNumbered(t) {
  // "1. a 2. b 3. c": split only at the next expected number. Some lists put
  // one item per paragraph instead ("2. b"), so a list can start at any number.
  const start = Number(t.match(/^(\d+)\./)[1]);
  const items = [];
  let rest = t.replace(/^\d+\.\s+/, ''), k = start + 1;
  for (;;) {
    const at = rest.search(new RegExp(`\\s${k}\\.\\s+`));
    if (at < 0) { items.push(rest.trim()); break; }
    items.push(rest.slice(0, at).trim());
    rest = rest.slice(at).replace(new RegExp(`^\\s${k}\\.\\s+`), '');
    k++;
  }
  return { start, end: k - 1, md: items.map((i, n) => `${start + n}. ${i}`).join('\n') };
}
function splitTable(t, where) {
  const sep = t.match(/\|(\s*:?-{3,}:?\s*\|)+/);
  if (!sep) fail(`table without a separator row in ${where}: ${t.slice(0, 80)}`);
  const cols = sep[0].split('|').length - 2;
  const cells = t.trim().replace(/^\|/, '').replace(/\|$/, '').split('|');
  // Row i occupies cells [i*(cols+1) .. +cols); the cell after each row is the
  // blank between "|" and "|" where the rows were joined.
  const rows = [];
  for (let i = 0; i < cells.length; i += cols + 1) {
    const row = cells.slice(i, i + cols).map((c) => c.trim());
    if (row.length !== cols) fail(`ragged table in ${where}: ${t.slice(0, 80)}`);
    const gap = cells[i + cols];
    if (gap !== undefined && gap.trim() !== '') fail(`table row join not blank in ${where}: "${gap}"`);
    rows.push(row);
  }
  if (!rows[1].every((c) => /^:?-{3,}:?$/.test(c))) fail(`table separator not second row in ${where}`);
  return rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
}

const report = { bullets: [], numbered: [], tables: [], emdash: 0 };
const all = new Map();
for (const p of posts) {
  if (all.has(p.number)) fail(`post ${p.number} appears twice`);
  const where = `post ${p.number}`;
  const [by, meta, ...body] = p.raw;
  if (!by || by.text !== 'By The Profectus Team') fail(`${where}: first line is not the byline: ${by?.text}`);
  if (!meta || !meta.text.startsWith('Meta description:')) fail(`${where}: second line is not the meta description`);
  const description = meta.text.replace(/^Meta description:\s*/, '').trim();
  if (body.some((b) => /^(By The Profectus Team|Meta description:)/.test(b.text))) fail(`${where}: extra byline/meta line`);

  const out = [];   // markdown blocks; a numbered item continuing a list joins it
  let lastEnd = 0, lastTable = false;
  const tableStarts = [];
  for (const b of body) {
    const t = b.text;
    if (b.tag === 'h2') { out.push(`## ${t}`); lastEnd = 0; lastTable = false; continue; }
    if (b.tag === 'h3') { out.push(`### ${t}`); lastEnd = 0; lastTable = false; continue; }
    if (/^\d+\.\s/.test(t)) {
      const l = splitNumbered(t);
      if (l.start === 1) out.push(l.md);
      else if (l.start === lastEnd + 1) out[out.length - 1] += '\n' + l.md;
      else fail(`${where}: numbered paragraph ${l.start} does not continue a list: ${t.slice(0, 80)}`);
      lastEnd = l.end;
      report.numbered.push([p.number, l.md]);
      continue;
    }
    lastEnd = 0;
    if (t.startsWith('- ')) { lastTable = false; const o = splitBullets(t); report.bullets.push([p.number, o]); out.push(o); continue; }
    if (t.startsWith('|')) {
      // Either a whole table flattened into one paragraph, or one row per
      // paragraph (consecutive rows join into one table).
      // A flattened table holds its separator row (|---|) after other cells;
      // a lone row is either cells only or the separator alone.
      const isSep = /^\|(\s*:?-{3,}:?\s*\|)+$/.test(t.trim());
      const oneLine = !isSep && /\|\s*:?-{3,}:?\s*\|/.test(t);
      if (oneLine) { const o = splitTable(t, where); report.tables.push([p.number, o]); out.push(o); lastTable = false; }
      else if (lastTable) out[out.length - 1] += '\n' + t.trim();
      else { out.push(t.trim()); lastTable = true; tableStarts.push(out.length - 1); }
      continue;
    }
    lastTable = false;
    if (/^#|^>/.test(t)) fail(`${where}: unhandled markdown paragraph: ${t.slice(0, 80)}`);
    out.push(t);
  }
  for (const i of tableStarts) {
    const rows = out[i].split('\n');
    if (rows.length < 3 || !/^\|(\s*:?-{3,}:?\s*\|)+$/.test(rows[1])) fail(`${where}: row-per-paragraph table has no separator row`);
    report.tables.push([p.number, out[i]]);
  }
  const md = out.join('\n\n');

  const img = images.get(p.number);
  if (!img) fail(`${where}: no image`);
  all.set(p.number, { ...p, description, md, img });
}
for (let n = 1; n <= 100; n++) if (!all.has(n)) fail(`post ${n} missing`);
if (all.size !== 100 || images.size !== 100) fail(`expected 100 posts and 100 images, got ${all.size} and ${images.size}`);

// Em dashes: "Replace every em dash in post copy." The docs have none today;
// any that appear in a later version become a comma (or a colon before a list).
const noDash = (s) => {
  const n = (s.match(/[—–]/g) || []).length;
  report.emdash += n;
  return s.replace(/\s*—\s*/g, ', ').replace(/\s+–\s+/g, ', ').replace(/(\d)–(\d)/g, '$1-$2');
};

await rm(OUT_MD, { recursive: true, force: true });
await rm(OUT_IMG, { recursive: true, force: true });
await mkdir(OUT_MD, { recursive: true });
await mkdir(OUT_IMG, { recursive: true });
const q = (s) => JSON.stringify(s);   // JSON strings are valid YAML
for (const p of [...all.values()].sort((a, b) => a.number - b.number)) {
  await copyFile(p.img.file, path.join(OUT_IMG, p.img.name));
  const fm = [
    '---',
    `title: ${q(noDash(p.title))}`,
    `description: ${q(noDash(p.description))}`,
    `category: ${q(p.img.category)}`,
    `number: ${p.number}`,
    `image: ${q(`../../assets/insights/${p.img.name}`)}`,
    `author: "The Profectus Team"`,
    `pubDate: ${PUB_DATE}`,
    '---',
  ].join('\n');
  await writeFile(path.join(OUT_MD, `${p.img.slug}.md`), `${fm}\n\n${noDash(p.md)}\n`);
}

console.log(`Wrote ${all.size} posts and ${images.size} images.`);
console.log(`Bullet lists: ${report.bullets.length}, numbered lists: ${report.numbered.length}, tables: ${report.tables.length}, em/en dashes replaced: ${report.emdash}`);
if (process.argv.includes('--report')) {
  await writeFile(path.join(SRC, 'conversion-report.json'), JSON.stringify(report, null, 2));
  console.log('Details: blog-source/conversion-report.json');
}
