// writer.js
const fs = require('fs');
const path = '/usr/src/app/files/log.txt';

const random = Math.random().toString(36).substring(2, 10);
console.log("Random string:", random);

function writeLine() {
  const line = `${random} ${new Date().toISOString()}\n`;
  fs.appendFileSync(path, line);
  console.log("Wrote:", line.trim());
}

writeLine();
setInterval(writeLine, 5000);
