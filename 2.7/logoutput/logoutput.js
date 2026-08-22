const http = require("http");
const crypto = require("crypto");

const storedString = crypto.randomUUID();

function fetchPongs(callback) {
  http.get("http://pingpong-svc:3000/pings", (res) => {
    let data = "";
    res.on("data", chunk => data += chunk);
    res.on("end", () => callback(Number(data)));
  }).on("error", () => callback(0));
}

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    fetchPongs((count) => {
      const timestamp = new Date().toISOString();
      const payload =
        `${timestamp}: ${storedString}.\nPing / Pongs: ${count}\n`;

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(payload);
    });
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(3000, () => {
  console.log("Log output app running on port 3000");
});
