const fs = require("fs");
const https = require("https");

const IMAGE_PATH = "/usr/src/app/data/random.jpg";
const TS_PATH = "/usr/src/app/data/timestamp.txt";
const CACHE_MS = 10 * 60 * 1000; // 10 min

function readTimestamp() {
  try {
    return parseInt(fs.readFileSync(TS_PATH, "utf8"));
  } catch {
    return 0;
  }
}

function writeTimestamp(ts) {
  fs.writeFileSync(TS_PATH, String(ts));
}

function fetchImage() {
  return new Promise((resolve, reject) => {
    https.get("https://picsum.photos/1200", (res) => {

      if (res.statusCode === 302 && res.headers.location) {
        return https.get(res.headers.location, (imgRes) => {
          const file = fs.createWriteStream(IMAGE_PATH);
          imgRes.pipe(file);
          file.on("finish", () => file.close(resolve));
        }).on("error", reject);
      }

      const file = fs.createWriteStream(IMAGE_PATH);
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", reject);
  });
}


async function getImagePath() {
  const now = Date.now();
  const last = readTimestamp();

  if (!fs.existsSync(IMAGE_PATH) || now - last > CACHE_MS) {
    await fetchImage();
    writeTimestamp(now);
  }

  return IMAGE_PATH;
}

module.exports = { getImagePath };
