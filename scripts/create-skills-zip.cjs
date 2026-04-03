#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const skillRoot = path.join(root, 'dist', 'skills', 'yapi-cli-skill');
const outZip = path.join(root, 'dist', 'yapi-skills.zip');

if (!fs.existsSync(skillRoot)) {
  console.error(`create-skills-zip: missing ${skillRoot}`);
  process.exit(1);
}

fs.rmSync(outZip, { force: true });

try {
  execFileSync('zip', ['-qr', outZip, '.'], {
    cwd: skillRoot,
    stdio: 'inherit',
  });
} catch (error) {
  console.error('create-skills-zip: failed to run `zip`.');
  console.error('Install `zip` or create the archive manually from dist/skills/yapi-cli-skill/.');
  if (error && error.message) {
    console.error(error.message);
  }
  process.exit(1);
}

