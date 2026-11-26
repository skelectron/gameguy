# GameGuy

A static learning site about game development. The main track is the **BRUTAL** C# framework, with further tracks on C#, engine/framework development, game design, pixel art and other engines (Godot, Unity, GameMaker).

## Structure

```
assets/css/style.css     site styles (light/dark, pixel theme)
assets/js/lessons.js     curriculum: tracks + lesson order (drives nav, sidebar, prev/next)
assets/js/main.js        site shell: header, sidebar, progress, code blocks, pixel illustrations
content/<track>/*.html   lesson SOURCE fragments (front matter + <article>)
tools/build.mjs          wraps content fragments into full pages
<track>/*.html           GENERATED pages (commit these; Vercel serves them)
index.html               homepage (hand-written)
vercel.json              clean URLs + caching
```

## Editing

1. Edit or add `content/<track>/<slug>.html`.
2. If it is a new lesson, add `["slug", "Title"]` to the right track in `assets/js/lessons.js`.
3. Run `node tools/build.mjs`.

Code blocks go in `<script type="text/x-code" data-lang="csharp" data-file="Name.cs">…</script>`. No HTML escaping is needed. They are highlighted with Prism.

## Local preview

```
npx serve .
```

## Deploy

Upload this folder to Vercel as the `gameguy` project. It is a static site with no build step (pages are pre-generated); `content/` and `tools/` are excluded via `.vercelignore`.

BRUTAL is © Ahwoo Limited (https://github.com/ahwootech/BRUTAL). GameGuy is an independent learning site.
