/* GameGuy site shell: header, sidebar, pager, progress, code blocks, theme. */
(function () {
  "use strict";
  var TRACKS = window.GG_TRACKS || [];
  var body = document.body;
  var trackId = body.dataset.track || "";
  var slug = body.dataset.slug || "";
  var track = TRACKS.filter(function (t) { return t.id === trackId; })[0];

  /* ---------- storage (never required) ---------- */
  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); } catch (e) { return fallback; }
  }
  function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }
  var done = load("gg-done", {});
  function isDone(t, s) { return !!done[t + "/" + s]; }
  window.GG = { isDone: isDone, tracks: TRACKS };

  /* ---------- theme ---------- */
  var theme = load("gg-theme", null);
  if (theme) document.documentElement.dataset.theme = theme;
  function currentTheme() {
    return document.documentElement.dataset.theme ||
      (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }

  var LOGO = '<svg viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">' +
    '<rect x="1" y="4" width="14" height="9" fill="#1d1b26"/><rect x="2" y="5" width="12" height="7" fill="#e8483b"/>' +
    '<rect x="3" y="7" width="3" height="1" fill="#fff"/><rect x="4" y="6" width="1" height="3" fill="#fff"/>' +
    '<rect x="10" y="6" width="1" height="1" fill="#fff"/><rect x="12" y="8" width="1" height="1" fill="#fff"/>' +
    '<rect x="5" y="2" width="1" height="2" fill="#1d1b26"/><rect x="10" y="2" width="1" height="2" fill="#1d1b26"/></svg>';

  /* ---------- header ---------- */
  var header = el("header", { class: "site-header" });
  var navLinks = TRACKS.map(function (t) {
    return '<a href="/' + t.id + '/"' + (t.id === trackId ? ' class="active"' : "") + ">" + t.short + "</a>";
  }).join("");
  header.innerHTML =
    '<div class="bar"><a class="logo" href="/">' + LOGO + "GameGuy</a>" +
    '<button class="icon-btn menu-btn" aria-label="Menu" aria-expanded="false">☰</button>' +
    '<nav class="nav" aria-label="Tracks">' + navLinks + "</nav>" +
    '<button class="icon-btn theme-btn" aria-label="Toggle colour theme" title="Toggle theme">◐</button></div>';
  body.insertBefore(header, body.firstChild);
  header.querySelector(".theme-btn").addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    save("gg-theme", next);
  });
  var menuBtn = header.querySelector(".menu-btn"), nav = header.querySelector(".nav");
  menuBtn.addEventListener("click", function () {
    nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", nav.classList.contains("open"));
  });

  /* ---------- lesson page ---------- */
  var article = document.querySelector("article.lesson");
  if (track && article) {
    var idx = -1;
    track.lessons.forEach(function (l, i) { if (l[0] === slug) idx = i; });
    var layout = el("div", { class: "layout" });
    var aside = el("aside", { class: "sidebar" });
    var items = track.lessons.map(function (l, i) {
      return '<li class="' + (isDone(track.id, l[0]) ? "done" : "") + '"><a href="/' + track.id + "/" + l[0] + '"' +
        (i === idx ? ' class="current" aria-current="page"' : "") + '><span class="n"><span>' + (i + 1) +
        "</span></span>" + l[1] + "</a></li>";
    }).join("");
    aside.innerHTML = '<details class="side-card" open><summary><span style="color:' + track.color + '">' + track.icon +
      "</span>" + track.title + '</summary><ol><li><a href="/' + track.id + '/"><span class="n">≡</span>Track overview</a></li>' +
      items + "</ol></details>";
    if (window.matchMedia && matchMedia("(max-width: 1000px)").matches) aside.querySelector("details").removeAttribute("open");
    article.parentNode.insertBefore(layout, article);
    layout.appendChild(aside);
    layout.appendChild(article);

    // breadcrumb + meta
    var prose = Array.prototype.map.call(article.querySelectorAll("p, li, td, h2, h3"), function (e) { return e.textContent; }).join(" ");
    var codeLines = Array.prototype.reduce.call(article.querySelectorAll('script[type="text/x-code"]'), function (n, s) { return n + s.textContent.split("\n").length; }, 0);
    var words = prose.trim().split(/\s+/).length + codeLines * 4;
    var h1 = article.querySelector("h1");
    var crumbs = el("div", { class: "crumbs" },
      '<a href="/">Home</a> / <a href="/' + track.id + '/">' + track.title + "</a>" +
      (idx >= 0 ? " / Lesson " + (idx + 1) + " of " + track.lessons.length : ""));
    var meta = el("div", { class: "lesson-meta" },
      '<span class="badge" style="background:' + track.color + ';color:#fff">' + track.short + "</span>" +
      "<span>⏱ " + Math.max(2, Math.round(words / 200)) + " min read</span>");
    if (h1) { article.insertBefore(crumbs, h1); h1.after(meta); }

    // footer: complete + pager
    if (idx >= 0) {
      var foot = el("div", { class: "lesson-footer" });
      var key = track.id + "/" + slug;
      var btn = el("button", { class: "btn complete-btn" });
      function paint() {
        btn.textContent = done[key] ? "✓ Completed" : "Mark lesson complete";
        btn.classList.toggle("is-done", !!done[key]);
      }
      paint();
      btn.addEventListener("click", function () {
        if (done[key]) delete done[key]; else done[key] = Date.now();
        save("gg-done", done); paint();
        var li = aside.querySelector("a.current"); if (li) li.parentNode.classList.toggle("done", !!done[key]);
      });
      foot.appendChild(btn);
      var prev = track.lessons[idx - 1], next = track.lessons[idx + 1];
      var pager = el("nav", { class: "pager", "aria-label": "Lesson navigation" });
      if (prev) pager.appendChild(el("a", { class: "prev", href: "/" + track.id + "/" + prev[0] }, "<small>← Previous</small>" + prev[1]));
      if (next) pager.appendChild(el("a", { class: "next", href: "/" + track.id + "/" + next[0] }, "<small>Next →</small>" + next[1]));
      else {
        var ti = TRACKS.indexOf(track), nt = TRACKS[ti + 1];
        if (nt) pager.appendChild(el("a", { class: "next", href: "/" + nt.id + "/" }, "<small>Next track →</small>" + nt.title));
      }
      foot.appendChild(pager);
      article.appendChild(foot);
    }
  }

  /* ---------- track index lists & home cards ---------- */
  document.querySelectorAll("[data-lesson-list]").forEach(function (ol) {
    var t = TRACKS.filter(function (x) { return x.id === ol.dataset.lessonList; })[0];
    if (!t) return;
    ol.innerHTML = t.lessons.map(function (l) {
      return '<li><a class="' + (isDone(t.id, l[0]) ? "done" : "") + '" href="/' + t.id + "/" + l[0] + '">' + l[1] + "</a></li>";
    }).join("");
  });
  document.querySelectorAll("[data-track-progress]").forEach(function (node) {
    var t = TRACKS.filter(function (x) { return x.id === node.dataset.trackProgress; })[0];
    if (!t) return;
    var n = t.lessons.filter(function (l) { return isDone(t.id, l[0]); }).length;
    var pct = Math.round(n / t.lessons.length * 100);
    node.innerHTML = '<div class="meta"><span>' + t.lessons.length + " lessons</span><span>" + n + "/" + t.lessons.length + " done</span></div>" +
      '<div class="progress" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + pct + '%"></span></div>';
  });

  /* ---------- code blocks: <script type="text/x-code" data-lang data-file> ---------- */
  function dedent(s) {
    s = s.replace(/^\n+|\s+$/g, "");
    var m = s.match(/^[ \t]*(?=\S)/gm), min = Infinity;
    (m || []).forEach(function (x) { min = Math.min(min, x.length); });
    return min && min !== Infinity ? s.replace(new RegExp("^[ \\t]{" + min + "}", "gm"), "") : s;
  }
  var hasCode = false;
  document.querySelectorAll('script[type="text/x-code"]').forEach(function (s) {
    hasCode = true;
    var lang = s.dataset.lang || "csharp";
    var frag = document.createDocumentFragment();
    if (s.dataset.file) frag.appendChild(el("div", { class: "file-label" }, s.dataset.file.replace(/</g, "&lt;")));
    var pre = el("pre", { class: "language-" + lang });
    var code = el("code", { class: "language-" + lang });
    code.textContent = dedent(s.textContent);
    pre.appendChild(code);
    var copy = el("button", { class: "copy", type: "button" }, "copy");
    copy.addEventListener("click", function () {
      var txt = code.textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () {
        copy.textContent = "copied!"; setTimeout(function () { copy.textContent = "copy"; }, 1400);
      }, function () { copy.textContent = "select & copy"; });
    });
    pre.appendChild(copy);
    frag.appendChild(pre);
    s.parentNode.replaceChild(frag, s);
  });
  if (hasCode) {
    window.Prism = window.Prism || {}; window.Prism.manual = true;
    var base = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/";
    var core = el("script", { src: base + "prism.min.js" });
    core.onload = function () {
      var pending = 0;
      // clike ships in core; csharp and bash only depend on it, so they can load in parallel.
      ["csharp", "bash"].forEach(function (c) {
        pending++;
        var sc = el("script", { src: base + "components/prism-" + c + ".min.js" });
        sc.onload = sc.onerror = function () { if (--pending === 0 && window.Prism.highlightAll) window.Prism.highlightAll(); };
        document.head.appendChild(sc);
      });
    };
    document.head.appendChild(core);
  }

  /* ---------- pixel illustrations: <canvas data-art="row|row|..." data-pal='{"a":"#fff"}' data-scale="12"> ---------- */
  document.querySelectorAll("canvas[data-art]").forEach(function (cv) {
    var rows = cv.dataset.art.split("|"), pal = {};
    try { pal = JSON.parse(cv.dataset.pal || "{}"); } catch (e) {}
    var s = +(cv.dataset.scale || 12), w = rows[0].length, h = rows.length;
    cv.width = w * s; cv.height = h * s;
    cv.style.width = Math.min(w * s, 320) + "px"; cv.style.imageRendering = "pixelated";
    var ctx = cv.getContext("2d");
    ctx.fillStyle = pal["."] || "#ece9f5"; ctx.fillRect(0, 0, cv.width, cv.height);
    rows.forEach(function (r, y) {
      for (var x = 0; x < r.length; x++) {
        var col = pal[r[x]]; if (!col || r[x] === ".") continue;
        ctx.fillStyle = col; ctx.fillRect(x * s, y * s, s, s);
      }
    });
    if (cv.dataset.grid !== "off") {
      ctx.strokeStyle = "rgba(0,0,0,.08)"; ctx.lineWidth = 1;
      for (var gx = 0; gx <= w; gx++) { ctx.beginPath(); ctx.moveTo(gx * s + .5, 0); ctx.lineTo(gx * s + .5, h * s); ctx.stroke(); }
      for (var gy = 0; gy <= h; gy++) { ctx.beginPath(); ctx.moveTo(0, gy * s + .5); ctx.lineTo(w * s, gy * s + .5); ctx.stroke(); }
    }
  });

  /* ---------- footer ---------- */
  var footer = el("footer", { class: "site-footer" },
    '<div class="inner"><span><b class="pixel" style="font-size:11px">GameGuy</b> · learn to make games, engines and pixels.</span>' +
    '<span>BRUTAL is © Ahwoo Limited · <a href="https://github.com/ahwootech/BRUTAL" rel="noopener">BRUTAL on GitHub</a> · ' +
    'GameGuy is an independent learning site.</span></div>');
  body.appendChild(footer);
})();
