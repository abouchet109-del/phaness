import fs from "fs";
const j = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const all = [];
(function w(o) { if (!o || typeof o !== "object") return; if (o.code && o.message) all.push(o); Object.values(o).forEach(w); })(j);
const seen = {};
all.forEach((o) => { const k = o.code + "|" + (o.severity || ""); (seen[k] = seen[k] || []).push(o); });
Object.entries(seen).forEach(([k, v]) => console.log(k, v.length, "|", String(v[0].message).slice(0, 260).replace(/\n/g, " "), "|", String(v[0].selector || v[0].element || v[0].file || "").slice(0, 80)));
