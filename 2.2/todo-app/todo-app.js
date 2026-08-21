const http = require("http");
const fs = require("fs");
const { getImagePath } = require("./image-cache");

function fetchTodos(callback) {
  http.get("http://todo-backend-svc:3000/todos", (res) => {
    let data = "";
    res.on("data", chunk => data += chunk);
    res.on("end", () => {
      try {
        callback(JSON.parse(data));
      } catch {
        callback([]);
      }
    });
  }).on("error", () => callback([]));
}

function createTodo(text, callback) {
  const req = http.request(
    {
      hostname: "todo-backend-svc",
      port: 3000,
      path: "/todos",
      method: "POST",
      headers: { "Content-Type": "application/json" }
    },
    (res) => {
      res.on("data", () => {});
      res.on("end", callback);
    }
  );
  req.write(JSON.stringify({ text }));
  req.end();
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    fetchTodos((todos) => {
      const html = `
        <html>
          <body>
            <h2>Todo App</h2>
            <img src="/image" style="max-width: 600px;" /><br><br>

            <form method="POST" action="/new">
              <input name="todo" maxlength="140" />
              <button type="submit">Add</button>
            </form>

            <h3>Todos</h3>
            <ul>
              ${todos.map(t => `<li>${t.text}</li>`).join("")}
            </ul>
          </body>
        </html>
      `;
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    });
    return;
  }

  if (req.method === "GET" && req.url === "/image") {
    (async () => {
      try {
        const imgPath = await getImagePath();
        const img = fs.readFileSync(imgPath);
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        res.end(img);
      } catch {
        res.writeHead(500);
        res.end("Image error");
      }
    })();
    return;
  }

  if (req.method === "POST" && req.url === "/new") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const params = new URLSearchParams(body);
      const text = params.get("todo") || "";
      if (!text.trim()) {
        res.writeHead(302, { Location: "/" });
        return res.end();
      }
      createTodo(text.trim(), () => {
        res.writeHead(302, { Location: "/" });
        res.end();
      });
    });
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(3000, () => {
  console.log("todo-app running on port 3000");
});
