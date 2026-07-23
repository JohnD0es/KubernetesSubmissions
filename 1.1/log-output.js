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
