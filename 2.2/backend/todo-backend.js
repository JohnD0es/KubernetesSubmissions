const http = require("http");

let todos = [];

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/todos") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(todos));
  }

  if (req.method === "POST" && req.url === "/todos") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        if (!data.text || typeof data.text !== "string") {
          res.writeHead(400);
          return res.end("Invalid todo");
        }
        todos.push({ text: data.text });
        res.writeHead(201, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ status: "ok" }));
      } catch {
        res.writeHead(400);
        return res.end("Invalid JSON");
      }
    });
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(3000, () => {
  console.log("todo-backend running on port 3000");
});
