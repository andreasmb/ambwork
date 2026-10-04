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
videos:                                     # optional Wistia embeds
  - id: g7d5793wsw
    title: Promotional video
    ratio: 56.25                            # height / width * 100
meta: >-
  With Sarah Nahm and the Lever team. [Link](https://www.lever.co)
---
Project description, in Markdown.
```

Put image files in `imgs/` at full size. The build makes resized WebP copies.

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
