const http = require("http");

let counter = 0;

const server = http.createServer((req, res) => {
  if (req.url === "/pingpong") {
    counter++;
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`pong ${counter}`);
  } else if (req.url === "/pings") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(String(counter));
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(3000, () => {
  console.log("Ping-pong app running on port 3000");
});
