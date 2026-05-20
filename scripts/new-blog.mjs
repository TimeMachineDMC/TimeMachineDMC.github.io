import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const inboxDir = path.join(root, 'content-inbox', 'blog')
const title = process.argv.slice(2).join(' ').trim() || 'New Blog Post'
const slug = slugify(title)
const filePath = path.join(inboxDir, `${today()}-${slug}.md`)

await mkdir(inboxDir, { recursive: true })
await writeFile(
  filePath,
  `# ${title}

## 开场

写这篇文章的原因。

## 正文

### 第一部分

填入内容。

### 第二部分

填入内容。

## 结尾

留下结论、问题或下一步。
`,
  'utf8'
)

console.log(`Created ${path.relative(root, filePath)}`)

function today() {
  return new Date().toISOString().slice(0, 10)
}

function slugify(value) {
  const slug = value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || `post-${Date.now()}`
}
