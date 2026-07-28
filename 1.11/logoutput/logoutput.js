const fs = require("fs");
const http = require("http");

function generateRandomString(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const storedString = generateRandomString();
console.log("Generated string at startup:", storedString);

const DATA_FILE = "/usr/src/app/data/pingpong.txt";

function readPingpongCount() {
  try {
    const content = fs.readFileSync(DATA_FILE, "utf8").trim();
    const count = parseInt(content, 10);
    return isNaN(count) ? 0 : count;
  } catch (err) {
    return 0; // file missing or unreadable
  }
}

// Log every 5 seconds
setInterval(() => {
  const timestamp = new Date().toISOString();
  const count = readPingpongCount();
  console.log(`${timestamp}: ${storedString}. Ping / Pongs: ${count}`);
}, 5000);

// HTTP server
const server = http.createServer((req, res) => {
  if (req.url === "/status") {
    const timestamp = new Date().toISOString();
    const count = readPingpongCount();

    const payload = `${timestamp}: ${storedString}.\nPing / Pongs: ${count}\n`;

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(payload);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

server.listen(3000, () => {
  console.log("Log Output status endpoint running on port 3000");
});
