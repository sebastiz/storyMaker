// Builds the pre-compiled, fast-loading index.html from src/story-wheel.jsx.
import { build } from "esbuild";
import { readFileSync, writeFileSync } from "fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));

let code = readFileSync("src/story-wheel.jsx", "utf8");
code = code.replace('const APP_VERSION = "dev";', `const APP_VERSION = ${JSON.stringify(pkg.version)};`);
code = code.replace(/import \{[^}]*\} from "react";/,
  "const { useState, useMemo, useRef, useEffect } = React;");
code = code.replace("export default function StoryWheel(", "function StoryWheel(");
code += `\nReactDOM.createRoot(document.getElementById("root")).render(React.createElement(StoryWheel));\n`;

const res = await build({
  stdin: { contents: code, resolveDir: "src", sourcefile: "entry.jsx", loader: "jsx" },
  bundle: true, format: "iife", write: false,
  loader: { ".jsx": "jsx" }, jsx: "transform", minify: true, target: "es2018",
});
const js = res.outputFiles[0].text;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,650&family=Archivo:wght@400;500;600;700&display=swap" rel="stylesheet">\n`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Story Wheel</title>
<link rel="manifest" href="manifest.json">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="theme-color" content="#120E1C">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
${FONTS}<style>html,body{margin:0;background:#120E1C}#boot{color:#8B8398;font-family:system-ui;padding:40px;text-align:center}</style>
</head>
<body>
<div id="root"><div id="boot">Sharpening the pencil…</div></div>
<script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script>
${js}
</script>
<script>
if ("serviceWorker" in navigator && location.protocol.startsWith("http"))
  navigator.serviceWorker.register("sw.js").catch(() => {});
</script>
</body>
</html>`;

writeFileSync("index.html", html);
console.log("built index.html");

const sw = readFileSync("sw.js", "utf8").replace(/const CACHE = "[^"]*";/, `const CACHE = "sw-v${pkg.version}";`);
writeFileSync("sw.js", sw);
console.log(`stamped sw.js cache → sw-v${pkg.version}`);
