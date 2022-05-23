#!/usr/bin/env node

switch (process.argv[2]) {
  case "build":
    import("./scripts/build.js");
    break;
  case "clear":
    import("./scripts/clear.js");
    break;
  case "dev":
    import("./scripts/dev.js");
    break;
  default:
    console.error("Invalid-Command - Usage: npm run (build|clear|dev)");
    process.exit(1);
}
