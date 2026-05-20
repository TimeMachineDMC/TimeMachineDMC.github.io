import { spawnSync } from 'node:child_process'

const message = process.argv.slice(2).join(' ').trim() || 'Update site content'

run('node', ['scripts/import-blog.mjs'])
run('git', ['pull', '--rebase', '--autostash', '--ff-only'])
run('npm', ['run', 'build'])
run('git', ['add', '-A'])

const status = capture('git', ['status', '--short'])
if (!status.trim()) {
  console.log('No changes to commit.')
  process.exit(0)
}

run('git', ['commit', '-m', message])
run('git', ['push', 'origin', currentBranch()])

function currentBranch() {
  return capture('git', ['branch', '--show-current']).trim() || 'main'
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

function capture(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8' })
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout)
    process.exit(result.status ?? 1)
  }
  return result.stdout
}
