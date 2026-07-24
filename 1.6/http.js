const express = require('express');
const app = express();
const PORT = 3000;

// GET / → return HTML
app.get('/', (req, res) => {
  res.send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>My Node App</title>
      </head>
      <body>
        <h1>Hello from Node + Express!</h1>
        <p>This is a simple HTML response to GET /</p>
      </body>
    </html>
  `);
});

// start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
