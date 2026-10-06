#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { scoreAll } from "./score.js";
import type { CandidateJob } from "./types.js";

function usage(): never {
  console.log(`Usage: ops-decision --fixtures <file.yaml> [--out <report.json>]`);
  process.exit(1);
}

function argValue(args: string[], flag: string): string | undefined {
  const i = args.indexOf(flag);
  return i === -1 ? undefined : args[i + 1];
}

async function main() {
  const args = process.argv.slice(2);
  const fixtures = argValue(args, "--fixtures");
  if (!fixtures) usage();
  const out = argValue(args, "--out") ?? "reports/latest.json";

  const raw = await readFile(path.resolve(fixtures), "utf8");
  const data = parseYaml(raw) as { jobs: CandidateJob[] };
  if (!data?.jobs?.length) throw new Error("fixtures must include a jobs array");

  const scored = scoreAll(data.jobs);
  await mkdir(path.dirname(path.resolve(out)), { recursive: true });
  await writeFile(path.resolve(out), JSON.stringify({ scored }, null, 2) + "\n");

  console.log("id\tband\tfit\tname");
  for (const j of scored) {
    console.log(`${j.id}\t${j.band}\t${j.automation_fit}\t${j.name}`);
  }
  console.log(`Report: ${path.resolve(out)}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
