process.on("unhandledRejection", (err) => {
  throw err;
});

import path from "path";
import fs from "fs";
import os from "os";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkgJson = require(path.resolve("package.json"));

const appName = "Cerebro";
const homeDir = os.homedir();
const pluginName = pkgJson.name;

let symlinkPath;
if (process.platform === "darwin") {
  symlinkPath = path.join(
    homeDir,
    "Library",
    "Application Support",
    appName,
    "plugins",
    "node_modules",
    pluginName
  );
} else if (process.platform === "win32") {
  symlinkPath = path.join(
    process.env.APPDATA,
    appName,
    "plugins",
    "node_modules",
    pluginName
  );
} else {
  symlinkPath = path.join(
    homeDir,
    ".config",
    appName,
    "plugins",
    "node_modules",
    pluginName
  );
}

console.log("Start plugin development");
if (fs.existsSync(symlinkPath)) {
  console.log("   Symlink already exist");
  removeSymlink();
}

console.log("   Create symlink");
fs.symlinkSync(
  path.resolve(),
  symlinkPath,
  process.platform === "win32" ? "junction" : "file"
);

// Handle ctrl+c to remove symlink to plugin
process.on("SIGHUP", removeSymlink);
process.on("SIGINT", removeSymlink);
process.on("SIGTERM", removeSymlink);
process.on("SIGBREAK", removeSymlink);

console.log("   Starting esbuild...");

function removeSymlink() {
  console.log("   Removing symlink");
  fs.unlinkSync(symlinkPath);
}

import esbuild from "esbuild";
import cssModulesPlugin from "esbuild-css-modules-plugin";

const configFile = path.resolve("cerebro.build.js");
let config = {};
if (fs.existsSync(configFile)) config = require(configFile);

esbuild
  .build({
    watch: true,
    logLevel: "info",
    entryPoints: ["./src/index.js"],
    bundle: true,
    minify: false,
    format: "cjs",
    target: "es2016",
    loader: { ".js": "jsx", ".png": "dataurl", ".svg": "text" },
    outfile: "./dist/index.js",
    plugins: [cssModulesPlugin()],
    ...config,
  })
  .catch(() => process.exit(1));
