const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const keysFile = "./keys.json";

function loadKeys() {
  return JSON.parse(fs.readFileSync(keysFile));
}

function saveKeys(keys) {
  fs.writeFileSync(keysFile, JSON.stringify(keys, null, 2));
}

app.get("/", (req, res) => {
  res.send("Key server online");
});

app.post("/activate", (req, res) => {
  const { key, hwid } = req.body;
  const keys = loadKeys();
  const lic = keys.find(k => k.key === key);

  if (!lic) return res.json({ status: "invalid" });

  if (!lic.hwid) {
    lic.hwid = hwid;
    saveKeys(keys);
    return res.json({ status: "activated" });
  }

  if (lic.hwid === hwid) return res.json({ status: "ok" });

  res.json({ status: "used" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
