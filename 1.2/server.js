const http = require('http');

const PORT = process.env.PORT || 3123;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Todo app server is running\n');
});

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});