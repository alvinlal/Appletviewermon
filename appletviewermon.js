// hot reload for appletviewer

// Usage :- node appletviewermon.js <nameofappletviewerfile>

const fs = require('fs');
const { exit } = require('process');
const { exec, spawn } = require('child_process');

var appletviewerProcess;

if (!process.argv[2]) {
  console.log('please provide a filename !');
  exit();
}

const filename = process.argv[2];

console.log(`observing ${filename}`);

function runProcess() {
  console.log('rerunning...');
  appletviewerProcess = exec(`javac ${filename} && appletviewer ${filename}`, { shell: true, detached: true });
}

fs.watchFile(filename, {}, () => {
  if (appletviewerProcess) {
    exec(`taskkill -F -T -PID ${appletviewerProcess.pid}`);
  }
  runProcess();
});

runProcess();

appletviewerProcess.stdout.on('data', data => {
  console.log(data);
});
appletviewerProcess.stderr.on('data', data => {
  console.log(data);
});
