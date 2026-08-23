const http = require("http");
const { Client } = require("pg");

const PORT = process.env.PORT || 3001;

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function init() {
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL
    );
  `);
}

async function getTodos() {
  const res = await client.query("SELECT * FROM todos ORDER BY id ASC");
  return res.rows;
}

async function addTodo(text) {
  await client.query("INSERT INTO todos (text) VALUES ($1)", [text]);
}

init();

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/todos") {
    const todos = await getTodos();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(todos));
  } else if (req.method === "POST" && req.url === "/todos") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", async () => {
      const { text } = JSON.parse(body);
      await addTodo(text);
      res.writeHead(201);
      res.end("Created");
    });
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log("Todo backend running on port", PORT);
});
