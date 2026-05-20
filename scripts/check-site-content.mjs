import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()

const files = {
  site: 'content-site/site.json',
  home: 'content-site/home.json',
  about: 'content-site/about.json',
  projects: 'content-site/projects.json',
  life: 'content-site/life.json',
  links: 'content-site/links.json'
}

const content = Object.fromEntries(
  Object.entries(files).map(([key, file]) => [key, readJson(file)])
)

checkSite(content.site)
checkHome(content.home)
checkAbout(content.about)
checkProjects(content.projects)
checkLife(content.life)
checkLinks(content.links)

console.log('Site content looks valid.')

function readJson(file) {
  const absolute = path.join(root, file)
  try {
    return JSON.parse(readFileSync(absolute, 'utf8'))
  } catch (error) {
    fail(`${file} is not valid JSON: ${error.message}`)
  }
}

function checkSite(site) {
  assertString(site.title, 'site.title')
  assertString(site.author, 'site.author')
  assertString(site.description, 'site.description')
  assertString(site.logo?.src, 'site.logo.src')
  assertExistingPath(site.logo.src, 'site.logo.src')
  assertArray(site.header?.menu, 'site.header.menu')
  site.header.menu.forEach((item, index) => {
    assertString(item.title, `site.header.menu[${index}].title`)
    assertString(item.link, `site.header.menu[${index}].link`)
  })
}

function checkHome(home) {
  assertString(home.hero?.location, 'home.hero.location')
  assertArray(home.hero?.taglines, 'home.hero.taglines')
  assertArray(home.about?.paragraphs, 'home.about.paragraphs')
  assertArray(home.education, 'home.education')
  home.education.forEach((item, index) => {
    assertString(item.heading, `home.education[${index}].heading`)
    assertString(item.logoImage, `home.education[${index}].logoImage`)
    assertExistingPath(item.logoImage, `home.education[${index}].logoImage`)
  })
  assertArray(home.projects, 'home.projects')
  home.projects.forEach((project, index) => {
    assertString(project.heading, `home.projects[${index}].heading`)
    assertString(project.imagePath, `home.projects[${index}].imagePath`)
    assertExistingPath(project.imagePath, `home.projects[${index}].imagePath`)
  })
  assertArray(home.skills, 'home.skills')
}

function checkAbout(about) {
  assertString(about.title, 'about.title')
  checkSections(about.sections, 'about.sections')
}

function checkProjects(projects) {
  assertString(projects.title, 'projects.title')
  assertArray(projects.groups, 'projects.groups')
  checkUniqueIds(projects.groups, 'projects.groups')
  projects.groups.forEach((group, groupIndex) => {
    assertString(group.id, `projects.groups[${groupIndex}].id`)
    assertString(group.title, `projects.groups[${groupIndex}].title`)
    assertArray(group.projects, `projects.groups[${groupIndex}].projects`)
    group.projects.forEach((project, projectIndex) => {
      const base = `projects.groups[${groupIndex}].projects[${projectIndex}]`
      assertString(project.name, `${base}.name`)
      assertString(project.description, `${base}.description`)
      if (project.image)
        assertExistingPath(`/src/assets/projects/${project.image}`, `${base}.image`)
      assertArray(project.links, `${base}.links`)
      project.links.forEach((link, linkIndex) => {
        assertString(link.type, `${base}.links[${linkIndex}].type`)
        assertString(link.href, `${base}.links[${linkIndex}].href`)
      })
    })
  })
}

function checkLife(life) {
  assertString(life.title, 'life.title')
  checkSections(life.sections, 'life.sections')
  life.sections.forEach((section, index) => {
    const base = `life.sections[${index}]`
    if (!['cards', 'music', 'gallery', 'text'].includes(section.kind)) {
      fail(`${base}.kind must be cards, music, gallery, or text`)
    }
    if (section.kind === 'cards') assertArray(section.cards, `${base}.cards`)
    if (section.kind === 'gallery') assertArray(section.slots, `${base}.slots`)
    if (section.kind === 'music') {
      assertString(section.playlist?.url, `${base}.playlist.url`)
      assertString(section.playlist?.embedUrl, `${base}.playlist.embedUrl`)
    }
  })
}

function checkLinks(links) {
  assertString(links.title, 'links.title')
  assertArray(links.links, 'links.links')
  links.links.forEach((link, index) => {
    assertString(link.title, `links.links[${index}].title`)
    assertString(link.href, `links.links[${index}].href`)
    assertString(link.icon, `links.links[${index}].icon`)
  })
}

function checkSections(sections, label) {
  assertArray(sections, label)
  checkUniqueIds(sections, label)
  sections.forEach((section, index) => {
    assertString(section.id, `${label}[${index}].id`)
    assertString(section.title, `${label}[${index}].title`)
  })
}

function checkUniqueIds(items, label) {
  const seen = new Set()
  items.forEach((item, index) => {
    if (!item.id) return
    if (seen.has(item.id)) fail(`${label}[${index}].id duplicates "${item.id}"`)
    seen.add(item.id)
  })
}

function assertArray(value, label) {
  if (!Array.isArray(value)) fail(`${label} must be an array`)
}

function assertString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') fail(`${label} must be a non-empty string`)
}

function assertExistingPath(value, label) {
  const relative = value.startsWith('/') ? value.slice(1) : value
  if (!existsSync(path.join(root, relative))) fail(`${label} points to a missing file: ${value}`)
}

function fail(message) {
  console.error(`Content check failed: ${message}`)
  process.exit(1)
}
