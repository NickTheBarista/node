'use strict';
const common = require('../common');
const assert = require('assert');
const fs = require('fs');
const spawn = require('child_process').spawn;

// Fails with EINVAL on SmartOS, EBUSY on Windows, EBUSY on AIX.
if (common.isSunOS || common.isWindows || common.isAix) {
  common.skip('cannot rmdir current working directory');
  return;
}

var dirname = common.tmpDir + '/cwd-does-not-exist-' + process.pid;
common.refreshTmpDir();
fs.mkdirSync(dirname);
process.chdir(dirname);
fs.rmdirSync(dirname);

var proc = spawn(process.execPath, ['--interactive']);
proc.stdout.pipe(process.stdout);
proc.stderr.pipe(process.stderr);
proc.stdin.write('require("path");\n');
proc.stdin.write('process.exit(42);\n');

proc.once('exit', common.mustCall(function(exitCode, signalCode) {
  assert.strictEqual(exitCode, 42);
  assert.strictEqual(signalCode, null);
}));
