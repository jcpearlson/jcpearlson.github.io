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
| `_quarto.yml` | Site config: pages to render, site-wide includes, theme |
| `index.qmd`, `about/`, `articles/`, `projects/`, `contact/`, `quotes/`, `404.qmd` | Pages. Each wraps its content in `<div id="jcp-terminal">` |
| `articles/posts/<slug>/` | One folder per article (`index.md`, `.qmd` or `.ipynb`) |
| `articles/posts/_metadata.yml` | Options and includes shared by every article |
| `css/terminal-theme.css` | Palette tokens (`--t-*`), tab bar and status bar |
| `css/index.css` | Layout shared by the terminal pages, plus the home page |
| `css/posts.css` | Article pages |
| `css/<page>.css` | Styles for a single page |
| `javaScript/` | HTML includes (see below) |
| `media/` | Images used by pages and articles |
| `projects/` | Self-contained browser games, copied to `docs/` as-is |
| `artifacts/` | Standalone interactive pages, copied to `docs/` as-is (e.g. `/artifacts/population-trends/`) |
| `_future_work/` | Drafts; not rendered |

### JavaScript includes

| File | Included by | Does |
| --- | --- | --- |
| `terminal.html` | every page (`_quarto.yml`) | Draws the tab bar and status bar, fetches the NYC temperature and article/project counts, tracks newsletter signups, and exposes shared helpers as `window.JCP` |
| `console.html`, `analytics.html` | every page | Console greeting; GoatCounter analytics |
| `home.html` | `index.qmd` | Home page hero, ASCII logo and latest-article card |
| `articles-table.html` | `articles/index.qmd` | Replaces Quarto's listing with the filterable article table |
| `article-chrome.html` | articles | Terminal-style article header and read time |
| `toc-scrollspy.html` | articles | Table of contents that follows the scroll position |
| `share.html` | articles | Subscribe form and share button at the end of an article |

The navigation tabs are defined once, in `NAV` at the top of `terminal.html`.

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

2. Put images in `media/` and reference them as `../../../media/<file>`. The first image is
   used as the listing thumbnail.
3. `quarto render`, check the page with `quarto preview`, and commit the source and `docs/`.

The home page's latest-article card, the article table and the status-bar counts all read
Quarto's rendered listing, so nothing else needs updating.

## Adding a page

Create `<name>/index.qmd` following an existing page such as `contact/index.qmd`, add it to
`project.render` in `_quarto.yml`, and add it to `NAV` in `javaScript/terminal.html` if it
should appear in the tab bar.
