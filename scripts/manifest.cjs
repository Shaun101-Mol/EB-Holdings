// Runs at deploy time: lists the photos in each gallery folder so the site
// doesn't have to guess file names in the browser.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", "images");
const out = {};
for (const dir of ["catering", "dresses"]) {
  const p = path.join(root, dir);
  out[dir] = fs.existsSync(p)
    ? fs.readdirSync(p)
        .map(f => f.match(/^(\d+)\.(jpe?g|png|webp)$/i))
        .filter(Boolean)
        .map(m => [Number(m[1]), m[2]])
        .sort((a, b) => a[0] - b[0])
    : [];
}
fs.writeFileSync(path.join(root, "manifest.json"), JSON.stringify(out));
console.log("Photo manifest:", Object.entries(out).map(([k, v]) => `${k}=${v.length}`).join(", "));
