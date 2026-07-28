const fs = require("fs");
const http = require("http");
const { getImage } = require("./image-cache");   // ⭐ REQUIRED FIX

function generateRandomString(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const RANDOM = generateRandomString();
const COUNTER_PATH = "/usr/src/app/data/pingpong.txt";

function readCounter() {
  try {
    return fs.readFileSync(COUNTER_PATH, "utf8").trim();
  } catch {
    return "0";
  }
}

const server = http.createServer(async (req, res) => {
  if (req.url === "/status") {
    const ts = new Date().toISOString();
    const count = readCounter();

    let base64 = "";
    try {
      const imagePath = await getImage();
      base64 = fs.readFileSync(imagePath, { encoding: "base64" });   // ⭐ safer
    } catch (err) {
      console.log("Image not ready yet:", err.message);
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <html>
        <body>
          <h2>Todo App</h2>

          <img src="data:image/jpeg;base64,${base64}" style="max-width: 600px;" />

          <div style="margin-bottom: 20px;">
            <label for="todo-input">Enter a new todo (max 140 characters)</label><br>
            <input id="todo-input" type="text" maxlength="140" style="width: 300px;" />
            <button id="send-btn">Send</button>
          </div>

          <h3>Todos</h3>
          <ul id="todo-list">
            <li>Learn Kubernetes basics</li>
            <li>Deploy application to cluster</li>
            <li>Configure persistent volumes</li>
          </ul>

          <script>
            document.getElementById("send-btn").onclick = () => {
              const input = document.getElementById("todo-input");
              const text = input.value.trim();

              if (!text) return;
              if (text.length > 140) return;

              const ul = document.getElementById("todo-list");
              const li = document.createElement("li");
              li.textContent = text;
              ul.appendChild(li);

              input.value = "";
            };
          </script>
        </body>
      </html>
    `);
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Logoutput running on port 3000");
});
