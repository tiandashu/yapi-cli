#!/usr/bin/env node
/**
 * After tsc, copy skill markdown assets into dist/ (no TypeScript entry — agents use yapi CLI only).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const skillSrc = path.join(root, 'skills', 'yapi-cli-skill');
const skillDest = path.join(root, 'dist', 'skills', 'yapi-cli-skill');

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const name of fs.readdirSync(from)) {
    const sf = path.join(from, name);
    const dt = path.join(to, name);
    const st = fs.statSync(sf);
    if (st.isDirectory()) {
      copyDir(sf, dt);
    } else {
      fs.copyFileSync(sf, dt);
    }
  }
}

fs.mkdirSync(skillDest, { recursive: true });

const skillMd = path.join(skillSrc, 'SKILL.md');
if (!fs.existsSync(skillMd)) {
  console.error('copy-skill-assets: missing', skillMd);
  process.exit(1);
}
fs.copyFileSync(skillMd, path.join(skillDest, 'SKILL.md'));

const refSrc = path.join(skillSrc, 'references');
if (fs.existsSync(refSrc)) {
  copyDir(refSrc, path.join(skillDest, 'references'));
}
