const http = require("http");
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function init() {
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS counter (
      id INT PRIMARY KEY,
      value INT
    );
  `);
  await client.query(`
    INSERT INTO counter (id, value)
    VALUES (1, 0)
    ON CONFLICT (id) DO NOTHING;
  `);
}

async function getCount() {
  const res = await client.query("SELECT value FROM counter WHERE id = 1");
  return res.rows[0].value;
}

async function incrementCount() {
  await client.query("UPDATE counter SET value = value + 1 WHERE id = 1");
}

init();

const server = http.createServer(async (req, res) => {
  if (req.url === "/pingpong") {
    await incrementCount();
    const count = await getCount();
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`pong ${count}`);
  } else if (req.url === "/pings") {
    const count = await getCount();
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(String(count));
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Ping-pong app running on port", process.env.PORT || 3000);
});
