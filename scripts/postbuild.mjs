import fs from 'node:fs';
import path from 'node:path';

if (process.env.VERCEL) {
  process.exit(0);
}

const root = process.cwd();
const nextDir = path.join(root, '.next');
const standaloneDir = path.join(nextDir, 'standalone');
const staticDir = path.join(nextDir, 'static');
const publicDir = path.join(root, 'public');
const distDir = path.join(root, 'dist');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true, force: true });
}

// 1. Copy static assets & public files into Next.js standalone output
if (fs.existsSync(standaloneDir)) {
  copyDir(publicDir, path.join(standaloneDir, 'public'));
  copyDir(staticDir, path.join(standaloneDir, '.next', 'static'));
}

// 2. Mirror built static assets into dist/ for platforms expecting a dist artifact folder
fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });
copyDir(publicDir, distDir);
copyDir(staticDir, path.join(distDir, '_next', 'static'));
if (fs.existsSync(path.join(root, 'favicon.ico'))) {
  fs.copyFileSync(path.join(root, 'favicon.ico'), path.join(distDir, 'favicon.ico'));
}
