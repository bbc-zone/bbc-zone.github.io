import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const basePathArgument = process.argv.slice(2).find((arg) => arg.startsWith("--base-path="));
const outputDirArgument = process.argv.slice(2).find((arg) => arg.startsWith("--output-dir="));
const relativeAssets = process.argv.includes("--relative-assets");
const outputDirName = outputDirArgument?.slice("--output-dir=".length);

if (outputDirName && (!/^[a-zA-Z0-9_-]+$/.test(outputDirName) || outputDirName === "out")) {
  throw new Error("Output directory must be a simple folder name other than out.");
}

if (basePathArgument) {
  const requestedBasePath = basePathArgument.slice("--base-path=".length);
  if (
    requestedBasePath !== "" &&
    (!requestedBasePath.startsWith("/") || requestedBasePath.endsWith("/"))
  ) {
    throw new Error("Build base path must start with / and must not end with /.");
  }
  process.env.NEXT_PUBLIC_BASE_PATH = requestedBasePath;
}
if (relativeAssets) {
  process.env.NEXT_PUBLIC_RELATIVE_ASSETS = "true";
  delete process.env.NEXT_PUBLIC_BASE_PATH;
}

const sourcePath = path.join(projectRoot, "public", "site-config.json");
const nextOutputDir = path.join(projectRoot, "out");
const outputDir = path.join(projectRoot, outputDirName ?? "out");
const outputPath = path.join(nextOutputDir, "site-config.json");
const targetConfigPath = path.join(outputDir, "site-config.json");
const statePath = path.join(projectRoot, ".site-config-build-state");
const nextBin = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");

const sourceConfig = await readFile(sourcePath);
const sourceHash = createHash("sha256").update(sourceConfig).digest("hex");

let previousSourceHash = null;
try {
  previousSourceHash = (await readFile(statePath, "utf8")).trim();
} catch {
  // The first build with this script has no saved source fingerprint yet.
}

let previousOutputConfig = null;
try {
  previousOutputConfig = await readFile(outputPath);
} catch {
  // Next.js will create the output file from public/ on the first build.
}

let previousTargetConfig = null;
if (outputDirName) {
  try {
    previousTargetConfig = await readFile(targetConfigPath);
  } catch {
    // The target folder may not exist before its first build.
  }
}

const sourceUnchanged = previousSourceHash === null || previousSourceHash === sourceHash;
const preserveOutputConfig =
  sourceUnchanged &&
  previousOutputConfig !== null &&
  !previousOutputConfig.equals(sourceConfig);
const preserveTargetConfig =
  outputDirName &&
  sourceUnchanged &&
  previousTargetConfig !== null &&
  !previousTargetConfig.equals(sourceConfig);

if (preserveOutputConfig) {
  console.log("Keeping out/site-config.json because public/site-config.json is unchanged.");
} else if (previousSourceHash !== null && previousSourceHash !== sourceHash) {
  console.log("public/site-config.json changed; the new source config will be exported.");
}

const build = spawn(process.execPath, [nextBin, "build"], {
  cwd: projectRoot,
  stdio: "inherit",
});

const exitCode = await new Promise((resolve, reject) => {
  build.once("error", reject);
  build.once("exit", (code, signal) => {
    if (signal) reject(new Error(`Next.js build stopped by ${signal}`));
    else resolve(code ?? 1);
  });
});

if (preserveOutputConfig) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, previousOutputConfig);
}

if (exitCode !== 0) {
  process.exitCode = exitCode;
} else {
  if (outputDirName) {
    await rm(outputDir, { recursive: true, force: true });
    await mkdir(outputDir, { recursive: true });
    await cp(nextOutputDir, outputDir, { recursive: true });
    if (preserveTargetConfig) {
      await writeFile(targetConfigPath, previousTargetConfig);
      console.log(`Keeping ${outputDirName}/site-config.json because public/site-config.json is unchanged.`);
    }
  }
  await writeFile(statePath, `${sourceHash}\n`, "utf8");
}
