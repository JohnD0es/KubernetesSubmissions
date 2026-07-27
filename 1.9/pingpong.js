const http = require('http');

let counter = 0;
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/pingpong') {
    counter++;
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`pong ${counter}`);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Ping-pong server started on port ${PORT}`);
});
