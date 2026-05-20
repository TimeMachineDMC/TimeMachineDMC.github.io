# Content Workflow

The site now has one controlled content layer:

```text
content-site/
```

Edit these JSON files for normal site changes. You do not need to edit Astro or HTML for routine updates.

## What To Edit

- `content-site/site.json`: site title, author, logo, header menu, footer links, social links, quote.
- `content-site/home.json`: homepage About, Education, Music, featured Projects, Skills, footer text.
- `content-site/about.json`: About page sections, labels, and buttons.
- `content-site/projects.json`: Projects page groups and project cards.
- `content-site/life.json`: Life page sections such as devices, music, fashion, literature, film, games, brands, gallery, and notes.
- `content-site/links.json`: Links page. Keep this to your own public links.

JSON cannot contain comments. Keep quotes and commas valid.

## Publish Any Site Change

After editing any file under `content-site/`, run:

```bash
npm run publish -- "Update site content"
```

The script will:

1. Import new Blog inbox Markdown.
2. Validate `content-site/*.json`.
3. Build the production site.
4. Commit all changes.
5. Push to GitHub.

You can check content without publishing:

```bash
npm run content:check
```

## Fast Blog Publishing

Create a new draft file:

```bash
npm run new:blog -- "文章标题"
```

Edit the generated file in:

```text
content-inbox/blog/
```

Then publish:

```bash
npm run publish -- "Add new blog post"
```

The publish script imports inbox Markdown into `src/content/blog/`, builds the site, commits, and pushes.

## Manual Blog Publishing

You can also write directly in `src/content/blog/`.

Required frontmatter:

```md
---
title: '文章标题'
publishDate: '2026-05-20'
description: '文章简介。'
tags:
  - life
language: 'zh-CN'
draft: false
comment: false
---
```

Keep `draft: true` for templates or unfinished drafts. Change it to `draft: false` to publish.

## Existing Blog Templates

Reusable draft templates are in `src/content/blog/`:

- `_template.md`
- `literature-note-template.md`
- `film-note-template.md`
- `game-log-template.md`
- `fashion-brand-template.md`
- `photo-gallery-template.md`
- `music-diary-template.md`

Copy one, rename it, replace the text, set `draft: false`, then run `npm run publish`.
