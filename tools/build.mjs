// Wraps content fragments into full static pages.
//   node tools/build.mjs
// Reads  content/<track>/<slug>.html  (front matter: title, description)
// Writes <track>/<slug>.html and <track>/index.html (auto-generated if no content/<track>/index.html).
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "assets/js/lessons.js"), "utf8"), sandbox);
const TRACKS = sandbox.window.GG_TRACKS;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

function page({ title, description, track, slug, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · GameGuy</title>
<meta name="description" content="${esc(description)}">
<link rel="icon" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;600&family=Press+Start+2P&display=swap">
<link rel="stylesheet" href="/assets/css/style.css">
<script src="/assets/js/lessons.js" defer></script>
<script src="/assets/js/main.js" defer></script>
</head>
<body data-track="${track}" data-slug="${slug}">
${body.trim()}
</body>
</html>
`;
}

function parse(file) {
  const raw = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  const meta = {};
  if (m) m[1].split("\n").forEach((line) => {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, "$1");
  });
  return { meta, html: m ? raw.slice(m[0].length) : raw };
}

let count = 0, missing = [];
for (const t of TRACKS) {
  const srcDir = path.join(root, "content", t.id);
  const outDir = path.join(root, t.id);
  fs.mkdirSync(outDir, { recursive: true });

  // Track index
  const idxSrc = path.join(srcDir, "index.html");
  let idxBody;
  let idxMeta = { title: t.title, description: t.blurb };
  if (fs.existsSync(idxSrc)) {
    const p = parse(idxSrc);
    idxBody = p.html;
    idxMeta = { ...idxMeta, ...p.meta };
  } else {
    idxBody = `<main class="wrap track-hero">
  <div class="crumbs"><a href="/">Home</a> / ${esc(t.title)}</div>
  <h1><span style="color:${t.color}">${t.icon}</span> ${esc(t.title)}</h1>
  <p class="lead" style="font-size:1.1rem;max-width:64ch">${esc(t.blurb)}</p>
  <div style="max-width:420px;margin:18px 0 28px" data-track-progress="${t.id}"></div>
  <ol class="lesson-list" data-lesson-list="${t.id}"></ol>
</main>`;
  }
  fs.writeFileSync(path.join(outDir, "index.html"), page({ ...idxMeta, track: t.id, slug: "index", body: idxBody }));
  count++;

  for (const [slug, title] of t.lessons) {
    const src = path.join(srcDir, slug + ".html");
    if (!fs.existsSync(src)) { missing.push(`${t.id}/${slug}`); continue; }
    const { meta, html } = parse(src);
    fs.writeFileSync(path.join(outDir, slug + ".html"), page({
      title: meta.title || title, description: meta.description || title, track: t.id, slug, body: html,
    }));
    count++;
  }
}

// 404
const nf = path.join(root, "content", "404.html");
if (fs.existsSync(nf)) {
  const { meta, html } = parse(nf);
  fs.writeFileSync(path.join(root, "404.html"), page({ title: meta.title || "Not found", description: "Page not found", track: "", slug: "", body: html }));
  count++;
}

console.log(`Built ${count} pages.`);
if (missing.length) { console.log("Missing content:\n  " + missing.join("\n  ")); process.exitCode = 1; }
