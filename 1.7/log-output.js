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

setInterval(() => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${storedString}`);
}, 5000);

const server = http.createServer((req, res) => {
  if (req.url === "/status") {
    const payload = JSON.stringify({
      timestamp: new Date().toISOString(),
      randomString: storedString
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(payload);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

server.listen(3000, () => {
  console.log("Log Output status endpoint running on port 3000");
});
