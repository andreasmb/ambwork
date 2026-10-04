"""Build the static site into _site/.

Reads projects/*.md (YAML front matter + Markdown description), renders
src/index.html, and writes resized WebP copies of every project image.

    pip install -r requirements.txt
    python build.py            # build into _site/
    python build.py --serve    # build, then serve at http://localhost:8000
"""

import datetime
import shutil
import sys
from pathlib import Path

import markdown
import yaml
from jinja2 import Environment, FileSystemLoader
from PIL import Image

ROOT = Path(__file__).parent
OUT = ROOT / "_site"
IMAGE_WIDTHS = (800, 1600)  # column is 960px wide, so 1600 covers 2x screens
STATIC = ["favicon.png", "CNAME", "fonts", "imgs/down-arrow.png"]


def load_projects():
    projects = []
    for path in sorted((ROOT / "projects").glob("*.md")):
        _, front_matter, body = path.read_text().split("---", 2)
        project = yaml.safe_load(front_matter)
        project["slug"] = path.stem.split("-", 1)[1]
        project["description"] = markdown.markdown(body.strip())
        project["meta"] = markdown.markdown(project.get("meta", ""))
        project["images"] = [build_image(img, project["title"], n)
                             for n, img in enumerate(project.get("images", []), 1)]
        project["videos"] = [build_video(video) for video in project.get("videos", [])]
        projects.append(project)
    return projects


def build_video(video):
    """Copy the MP4 and turn its poster frame into a WebP."""
    (OUT / "videos").mkdir(exist_ok=True)
    shutil.copy2(ROOT / video["src"], OUT / video["src"])
    poster = build_image(video["poster"], video["title"], 0)
    return {**video, "poster": poster["src"], "width": poster["width"], "height": poster["height"]}


def build_image(entry, title, n):
    """Write WebP versions of one image and return what the template needs."""
    if isinstance(entry, str):
        entry = {"src": entry}
    src = ROOT / entry["src"]
    with Image.open(src) as img:
        img = img.convert("RGBA" if img.mode in ("RGBA", "P") else "RGB")
        widths = [w for w in IMAGE_WIDTHS if w < img.width] + [min(img.width, IMAGE_WIDTHS[-1])]
        srcset = []
        for width in widths:
            name = f"imgs/{src.stem}-{width}.webp"
            height = round(img.height * width / img.width)
            img.resize((width, height), Image.LANCZOS).save(OUT / name, quality=82, method=6)
            srcset.append(f"{name} {width}w")
    return {
        "src": name,
        "srcset": ", ".join(srcset),
        "width": width,
        "height": height,
        "alt": entry.get("alt", f"{title}, image {n}"),
    }


def build():
    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / "imgs").mkdir(parents=True)
    for item in STATIC:
        src, dest = ROOT / item, OUT / item
        if src.is_dir():
            shutil.copytree(src, dest)
        else:
            shutil.copy2(src, dest)

    env = Environment(loader=FileSystemLoader(ROOT / "src"), autoescape=True)
    html = env.get_template("index.html").render(
        projects=load_projects(),
        year=datetime.date.today().year,
        css=(ROOT / "src/style.css").read_text(),
        js=(ROOT / "src/main.js").read_text(),
    )
    (OUT / "index.html").write_text(html)
    print(f"Built {OUT}")


if __name__ == "__main__":
    build()
    if "--serve" in sys.argv:
        from serve import serve
        serve()
