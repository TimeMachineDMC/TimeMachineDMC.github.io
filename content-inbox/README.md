# Content Inbox

Put simple Markdown files in `content-inbox/blog/`, then run:

```bash
npm run publish -- "Add blog post"
```

The publish script will:

1. Convert inbox Markdown into Astro blog posts under `src/content/blog/`.
2. Run the production build.
3. Commit all changes.
4. Push to GitHub.

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
