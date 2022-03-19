// hot reload for appletviewer

// Usage :- node appletviewermon.js <nameofappletviewerfile>

const fs = require('fs');
const { exit } = require('process');
const { exec, spawn, execSync } = require('child_process');

var appletviewerProcess;
var compilerProcess;

if (!process.argv[2]) {
  console.log('please provide a filename !');
  exit();
}

const filename = process.argv[2];

console.log(`observing ${filename}`);

function runProcess() {
  console.log('rerunning...');
  try {
    execSync(`javac ${filename}`, { shell: true });
    appletviewerProcess = exec(`appletviewer ${filename}`, { shell: true, detached: true });
    appletviewerProcess.stdout.on('data', data => {
      console.log(data.toString());
    });
    appletviewerProcess.stderr.on('data', data => {
      console.log(data);
    });
  } catch (err) {
    console.log(err.stderr.toString());
  }
}

runProcess();

fs.watchFile(filename, {}, () => {
  if (appletviewerProcess) {
    exec(`taskkill -F -T -PID ${appletviewerProcess.pid}`);
  }
  runProcess();
});
