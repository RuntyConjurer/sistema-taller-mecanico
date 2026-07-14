'use strict';

const { execFileSync } = require('node:child_process');
const { readdirSync, statSync } = require('node:fs');
const { join } = require('node:path');

function javascriptFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? javascriptFiles(path) : path.endsWith('.js') ? [path] : [];
  });
}

for (const file of [...javascriptFiles(join(__dirname, '..', 'src')), join(__dirname, '..', 'server.js')]) {
  execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
}

console.log('Sintaxis del backend verificada.');
