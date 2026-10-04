# ambwork

Portfolio site at [info.ambwork.com](https://info.ambwork.com).

## Editing projects

Each project is a Markdown file in [`projects/`](projects/). The number at the
start of the filename sets the order on the page.

```markdown
---
title: Lever
images:
  - imgs/lever-ui.png
  - src: imgs/lever-system.png
    alt: Lever's design system components   # optional alt text
videos:                                     # optional
  - src: videos/lever-demo.mp4
    poster: videos/lever-demo.jpg           # still shown before it plays
    title: Lever product demo
    loop: true                              # optional: loop instead of resetting
    playbar: true                           # optional: seekable progress bar
    fullscreen: true                        # optional: fullscreen button
    subtitles: videos/lever-demo.vtt        # optional: WebVTT subtitles, on by default
meta: >-
  With Sarah Nahm and the Lever team. [Link](https://www.lever.co)
---
Project description, in Markdown.
```

Put image files in `imgs/` at full size. The build makes resized WebP copies.

Videos play muted when scrolled into view, pause when scrolled away, and
always have a mute toggle. Export them as H.264 MP4, around 720p, e.g.:

```bash
ffmpeg -i input.mov -vf "scale='min(1280,iw)':-2" -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart videos/name.mp4
```

Commit to `main` (editing on github.com works fine) and the site redeploys
in a minute or two.

## Running locally

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python build.py --serve
```

Then open http://localhost:8000.

## Layout

- `src/index.html` – page template (Jinja2)
- `src/style.css`, `src/main.js` – inlined into the page at build time
- `build.py` – builds everything into `_site/`, which GitHub Actions publishes to the `gh-pages` branch
- `serve.py` – local server for `_site/` (supports video seeking, unlike `python -m http.server`)
