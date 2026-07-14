'use strict';

const { spawn } = require('node:child_process');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const processes = [
  spawn(npmCommand, ['--prefix', 'backend', 'run', 'dev'], { stdio: 'inherit' }),
  spawn(npmCommand, ['--prefix', 'frontend', 'run', 'dev'], { stdio: 'inherit' }),
];

let stopping = false;

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of processes) {
    if (!child.killed) child.kill('SIGTERM');
  }
  process.exitCode = exitCode;
}

for (const child of processes) {
  child.on('error', (error) => {
    console.error(`No fue posible iniciar un proceso: ${error.message}`);
    stop(1);
  });
  child.on('exit', (code) => {
    if (!stopping && code !== 0) stop(code || 1);
  });
}

process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
