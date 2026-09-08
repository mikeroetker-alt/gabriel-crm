import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeOtterlyExport, createEvidenceManifest } from "../pilot/otterly-import.mjs";

const [, , inputPath, mainBrand, outputPath = "private-pilot/otterly-normalized.json"] = process.argv;
if (!inputPath || !mainBrand) {
  throw new Error("Usage: node tools/import-otterly-export.mjs INPUT_JSON MAIN_BRAND [OUTPUT_JSON]");
}
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const resolvedOutput = resolve(repositoryRoot, outputPath);
const relativeOutput = resolvedOutput.slice(repositoryRoot.length);
if (!relativeOutput.startsWith("\\") && !relativeOutput.startsWith("/")) {
  throw new Error("Output must stay inside the repository");
}
const original = JSON.parse(await readFile(resolve(inputPath), "utf8"));
const observations = normalizeOtterlyExport(original, { mainBrand });
const result = { manifest: createEvidenceManifest(observations), observations };
await mkdir(dirname(resolvedOutput), { recursive: true });
await writeFile(resolvedOutput, JSON.stringify(result, null, 2), "utf8");
console.log(JSON.stringify({ output: resolvedOutput, ...result.manifest }));

