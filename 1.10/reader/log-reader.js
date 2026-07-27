// reader.js
const http = require('http');
const fs = require('fs');
const path = '/usr/src/app/files/log.txt';

const server = http.createServer((req, res) => {
  if (!fs.existsSync(path)) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('No log yet');
  }

  const content = fs.readFileSync(path, 'utf8');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(content);
});

server.listen(3000, () => {
  console.log('Reader running on port 3000');
});
