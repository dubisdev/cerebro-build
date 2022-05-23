import esbuild from "esbuild";
import cssModulesPlugin from "esbuild-css-modules-plugin";
import path from "path";
import fs from "fs";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const configFile = path.resolve("cerebro.build.js");
let config = {};
if (fs.existsSync(configFile)) config = require(configFile);

esbuild
  .build({
    logLevel: "info",
    entryPoints: ["src/index.tsx"],
    bundle: true,
    minify: true,
    format: "cjs",
    target: "es2016",
    loader: { ".js": "jsx", ".png": "dataurl", ".svg": "text" },
    outfile: "dist/index.js",
    plugins: [cssModulesPlugin()],
    ...config,
  })
  .catch(() => process.exit(1));
