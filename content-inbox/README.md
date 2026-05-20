# Content Inbox

Use this folder for new long-form content before publishing it into the site.

## Blog

Put simple Markdown files in `content-inbox/blog/`, then run:

```bash
npm run publish -- "Add blog post"
```

The publish script will:

1. Convert inbox Markdown into Astro blog posts under `src/content/blog/`.
2. Validate the full site content in `content-site/`.
3. Run the production build.
4. Commit all changes.
5. Push to GitHub.

Minimal input works:

```md
# My Title

Article body.
```

Optional metadata also works:

```md
---
title: 'My Title'
description: 'Short summary.'
tags: [life, music]
slug: my-title
---

Article body.
```

## Site Pages

For normal homepage, About, Projects, Life, and Links updates, edit:

```text
content-site/
```

Then run:

```bash
npm run publish -- "Update site content"
```
