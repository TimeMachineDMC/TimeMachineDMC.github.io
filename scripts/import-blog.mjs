import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const inboxDir = path.join(root, 'content-inbox', 'blog')
const outputDir = path.join(root, 'src', 'content', 'blog')

await mkdir(inboxDir, { recursive: true })
await mkdir(outputDir, { recursive: true })

const entries = await readdir(inboxDir, { withFileTypes: true })
const markdownFiles = entries
  .filter((entry) => entry.isFile() && /\.(md|mdx)$/i.test(entry.name))
  .map((entry) => entry.name)
  .sort()

if (markdownFiles.length === 0) {
  console.log('No inbox blog posts to import.')
  process.exit(0)
}

let imported = 0

for (const fileName of markdownFiles) {
  const sourcePath = path.join(inboxDir, fileName)
  const raw = await readFile(sourcePath, 'utf8')
  const parsed = parseMarkdown(raw)
  const body = normalizeBody(parsed.body, parsed.meta.title)
  const title = parsed.meta.title || inferTitle(body, fileName)
  const publishDate = parsed.meta.publishDate || today()
  const description = parsed.meta.description || inferDescription(body)
  const tags = parsed.meta.tags
  const language = parsed.meta.language || 'zh-CN'
  const comment = parsed.meta.comment ?? false
  const slug = slugify(parsed.meta.slug || path.basename(fileName, path.extname(fileName)), title)
  const ext = path.extname(fileName).toLowerCase() === '.mdx' ? '.mdx' : '.md'
  const outputPath = await availablePath(path.join(outputDir, `${publishDate}-${slug}${ext}`))
  const frontmatter = [
    '---',
    `title: ${yamlString(title)}`,
    `publishDate: ${yamlString(publishDate)}`,
    `description: ${yamlString(description)}`,
    'tags:',
    ...tags.map((tag) => `  - ${yamlString(tag)}`),
    `language: ${yamlString(language)}`,
    'draft: false',
    `comment: ${comment ? 'true' : 'false'}`,
    '---',
    ''
  ].join('\n')

  await writeFile(outputPath, `${frontmatter}${body.trim()}\n`, 'utf8')
  await unlink(sourcePath)
  imported += 1
  console.log(`Imported ${fileName} -> ${path.relative(root, outputPath)}`)
}

console.log(`Imported ${imported} blog post${imported === 1 ? '' : 's'}.`)

function parseMarkdown(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { meta: { tags: [] }, body: raw }

  return {
    meta: parseFrontmatter(match[1]),
    body: raw.slice(match[0].length)
  }
}

function parseFrontmatter(source) {
  const meta = { tags: [] }
  const lines = source.split(/\r?\n/)

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    const pair = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
    if (!pair) continue

    const [, key, rawValue] = pair
    if (key === 'tags') {
      const inline = rawValue.trim()
      if (inline.startsWith('[') && inline.endsWith(']')) {
        meta.tags = inline
          .slice(1, -1)
          .split(',')
          .map((item) => cleanYamlValue(item))
          .filter(Boolean)
      } else {
        const tags = []
        while (lines[i + 1]?.match(/^\s*-\s+/)) {
          i += 1
          tags.push(cleanYamlValue(lines[i].replace(/^\s*-\s+/, '')))
        }
        meta.tags = tags
      }
      continue
    }

    if (key === 'draft' || key === 'comment') {
      meta[key] = cleanYamlValue(rawValue) === 'true'
      continue
    }

    meta[key] = cleanYamlValue(rawValue)
  }

  return meta
}

function normalizeBody(body, title) {
  if (!title) return body
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return body.replace(new RegExp(`^#\\s+${escaped}\\s*\\r?\\n+`), '')
}

function inferTitle(body, fileName) {
  const heading = body.match(/^#\s+(.+)$/m)?.[1]?.trim()
  if (heading) return heading
  return path.basename(fileName, path.extname(fileName)).replace(/[-_]+/g, ' ')
}

function inferDescription(body) {
  const paragraph = body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('#') && !line.startsWith('!') && !line.startsWith('>'))

  return truncate(stripMarkdown(paragraph || 'New blog post.'), 150)
}

function stripMarkdown(value) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncate(value, max) {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value
}

function slugify(value, fallback) {
  const slug = value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (slug) return slug

  const fallbackSlug = fallback
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return fallbackSlug || `post-${hash(fallback)}`
}

function hash(value) {
  let acc = 0
  for (const char of value) acc = (acc * 31 + char.charCodeAt(0)) >>> 0
  return acc.toString(36)
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function yamlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`
}

function cleanYamlValue(value) {
  const trimmed = String(value).trim()
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

async function availablePath(targetPath) {
  const ext = path.extname(targetPath)
  const base = targetPath.slice(0, -ext.length)
  let candidate = targetPath
  let index = 2

  while (await exists(candidate)) {
    candidate = `${base}-${index}${ext}`
    index += 1
  }

  return candidate
}

async function exists(targetPath) {
  try {
    await readFile(targetPath)
    return true
  } catch {
    return false
  }
}
