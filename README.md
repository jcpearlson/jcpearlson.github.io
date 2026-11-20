# jcpearlson.github.io

Source for [joshpearlson.com](https://www.joshpearlson.com), a [Quarto](https://quarto.org) website
styled as a terminal. GitHub Pages serves the rendered `docs/` folder from `main`.

## Building

Install Quarto 1.5.56 (the version CI uses), then from the repository root:

```sh
quarto preview   # live-reloading local server
quarto render    # writes the site to docs/
```

Commit the regenerated `docs/` along with your source changes; that is what gets deployed.
Rendering in `America/New_York` keeps listing dates stable (`TZ=America/New_York quarto render`).

Posts are frozen (`freeze: true` in `articles/posts/_metadata.yml`), so rendering never
re-executes code. After editing a computational post, re-render just that post with its
Python environment available; the new results are saved to `_freeze/`.

## Layout

| Path | Contents |
| --- | --- |
| `_quarto.yml` | Site navigation, search, footer, theme, and render targets |
| `index.qmd`, `about/`, `articles/`, `projects/`, `contact/`, `quotes/`, `404.qmd` | Site pages |
| `articles/posts/<slug>/` | One folder per article (`index.md`, `.qmd` or `.ipynb`) |
| `articles/posts/_metadata.yml` | Shared article options and includes |
| `_includes/*.ejs.md` | Quarto listing templates for writing and projects |
| `projects/catalog.yml` | Project descriptions and links, in display order |
| `css/terminal-theme.css` | Shared palette, type, navigation, and index layout |
| `css/posts.css` | Article typography and reading layout |
| `javaScript/` | Archive topic filter, article contents and sharing, and analytics includes |
| `media/` | Images used by pages and articles |
| `projects/6CardGolf/`, `projects/DigDug/` | Self-contained browser games, copied to `docs/` |
| `artifacts/` | Standalone interactive pages, copied to `docs/` |
| `_future_work/` | Drafts |

## Adding an article

1. Create `articles/posts/<slug>/index.md` (or `.qmd`/`.ipynb`) with front matter:

   ```yaml
   ---
   title: "Title"
   author: "Josh Pearlson"
   date: "2026-01-31"
   categories: [Finance]
   ---
   ```

2. Put images in `media/` and reference them as `../../../media/<file>`.
3. `quarto render`, check the page with `quarto preview`, and commit the source and `docs/`.

Quarto builds the homepage’s recent writing and the archive from post front matter.

## Adding a page

Create `<name>/index.qmd` following an existing page such as `contact/index.qmd`, add it to
`project.render` in `_quarto.yml`. Add it under `website.navbar` or `website.page-footer`
when it needs a site-wide link.
