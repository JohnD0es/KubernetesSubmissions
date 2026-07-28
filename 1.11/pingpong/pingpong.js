const http = require('http');
const fs = require('fs');

const FILE = '/usr/src/app/data/pingpong.txt';

function readCount() {
  try {
    const raw = fs.readFileSync(FILE, 'utf8');
    return parseInt(raw) || 0;
  } catch {
    return 0;
  }
}

function writeCount(count) {
  fs.writeFileSync(FILE, String(count));
}

const server = http.createServer((req, res) => {
  let count = readCount();
  count++;
  writeCount(count);

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`Ping / Pongs: ${count}`);
});

server.listen(3000);
