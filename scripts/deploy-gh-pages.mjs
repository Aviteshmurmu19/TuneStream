#!/usr/bin/env node
/* eslint-disable no-console */
import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync, existsSync, readdirSync, statSync, copyFileSync, mkdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const distDir = join(repoRoot, 'dist');
const ghPagesBranch = 'gh-pages';

const run = (cmd, cwd) => {
  console.log(`> ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
};

const copyDir = (src, dst) => {
  if (!existsSync(dst)) mkdirSync(dst, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const s = join(src, entry.name);
    const d = join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else if (entry.isFile()) {
      copyFileSync(s, d);
    }
  }
};

if (!existsSync(distDir)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const remote = execSync('git remote get-url origin', { cwd: repoRoot, encoding: 'utf8' }).trim();
if (!remote) {
  console.error('No `origin` remote configured.');
  process.exit(1);
}

run('git fetch origin', repoRoot);

const remoteSha = execSync(`git rev-parse origin/${ghPagesBranch}`, { cwd: repoRoot, encoding: 'utf8' }).trim();
if (!remoteSha) {
  console.error(`Branch ${ghPagesBranch} does not exist on origin. Create it once on GitHub (e.g. an empty initial commit) before running deploy.`);
  process.exit(1);
}

const worktree = mkdtempSync(join(tmpdir(), 'tunestream-gh-pages-'));
console.log(`Using temp worktree: ${worktree}`);

try {
  run(`git worktree add --detach "${worktree}" ${remoteSha}`, repoRoot);

  for (const entry of readdirSync(worktree, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const p = join(worktree, entry.name);
    rmSync(p, { recursive: true, force: true });
  }

  for (const entry of readdirSync(distDir, { withFileTypes: true })) {
    const s = join(distDir, entry.name);
    const d = join(worktree, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else if (entry.isFile()) {
      copyFileSync(s, d);
    }
  }

  run('git add -A', worktree);
  const status = execSync('git status --porcelain', { cwd: worktree, encoding: 'utf8' }).trim();
  if (!status) {
    console.log('No changes to deploy.');
  } else {
    run('git commit -m "Deploy dist to GitHub Pages"', worktree);
    run(`git push origin HEAD:${ghPagesBranch} --force`, worktree);
  }
} finally {
  run(`git worktree remove "${worktree}" --force`, repoRoot);
  try { rmSync(worktree, { recursive: true, force: true }); } catch {}
}

console.log(`\nDeployed. Visit: https://aviteshmurmu19.github.io/TuneStream/`);
