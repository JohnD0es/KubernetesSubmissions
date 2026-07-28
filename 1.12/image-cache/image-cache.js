const fs = require("fs");
const https = require("https");

const IMAGE_PATH = "/usr/src/app/data/image.jpg";
const TS_PATH = "/usr/src/app/data/image_timestamp.txt";
const CACHE_MS = 10 * 60 * 1000;

function readTimestamp() {
  try {
    return parseInt(fs.readFileSync(TS_PATH, "utf8"), 10);
  } catch {
    return 0;
  }
}

function writeTimestamp(ts) {
  fs.writeFileSync(TS_PATH, String(ts));
}

function fetchImage() {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(IMAGE_PATH);

    https.get("https://picsum.photos/1200", (res) => {
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", reject);
  });
}

async function loop() {
  while (true) {
    const now = Date.now();
    const last = readTimestamp();

    if (now - last >= CACHE_MS) {
      await fetchImage();
      writeTimestamp(now);
    }

    await new Promise(r => setTimeout(r, 5000)); // check every 5 seconds
  }
}

loop();
