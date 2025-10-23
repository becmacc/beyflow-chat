import { execSync } from "node:child_process";
import fs from "node:fs";

console.log("🚀  Starting BeyFlow Chat Agent");

const lock = "package-lock.json";
if (!fs.existsSync(lock)) {
  console.error("❌  Missing lockfile — push it before deploying.");
  process.exit(1);
}

if (!fs.existsSync("node_modules")) {
  console.log("📦  Installing dependencies…");
  execSync("npm ci --prefer-offline --no-audit", { stdio: "inherit" });
} else {
  console.log("🧹  Using cached node_modules");
}

console.log("🏗️  Building optimized bundle…");
execSync("npm run build", { stdio: "inherit" });

console.log("✅  Build complete — ready for preview.");