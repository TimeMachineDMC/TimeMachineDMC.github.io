# Content Workflow

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

The script imports inbox Markdown, builds the site, commits, and pushes to GitHub.

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

## Existing Templates

Reusable draft templates are in `src/content/blog/`:

- `_template.md`
- `literature-note-template.md`
- `film-note-template.md`
- `game-log-template.md`
- `fashion-brand-template.md`
- `photo-gallery-template.md`
- `music-diary-template.md`

Copy one, rename it, replace the text, set `draft: false`, then run `npm run publish`.
