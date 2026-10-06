import type { CandidateJob, ScoredJob } from "./types.js";

function clamp(n: number): number {
  return Math.max(0, Math.min(3, n));
}

/**
 * Higher fit = better first automation bet.
 * Statutory work and high irreversibility pull the score down hard.
 */
export function scoreJob(job: CandidateJob): ScoredJob {
  const compliance = clamp(job.compliance_risk);
  const data = clamp(job.data_quality);
  const human = clamp(job.human_in_loop_need);
  const irr = clamp(job.irreversibility);

  let fit = data * 2 - compliance - human * 0.5 - irr;
  if (job.statutory) fit -= 2;

  const reasons: string[] = [];
  if (data >= 2) reasons.push("Structured data looks usable");
  if (data <= 1) reasons.push("Data is thin or messy");
  if (compliance >= 2) reasons.push("Compliance exposure is material");
  if (human >= 2) reasons.push("Needs frequent human judgment");
  if (irr >= 2) reasons.push("Bad actions are hard to reverse");
  if (job.statutory) reasons.push("Sits on a statutory obligation");

  let band: ScoredJob["band"];
  let oversight: string;
  if (job.statutory || fit < 0) {
    band = "reject";
    oversight = "Keep humans on the critical path. Do not automate the decision.";
  } else if (fit < 2) {
    band = "defer";
    oversight = "Draft-only automation with mandatory review before any action.";
  } else {
    band = "pilot";
    oversight = "Pilot with logging, spot checks, and a clear rollback.";
  }

  return {
    ...job,
    automation_fit: Math.round(fit * 10) / 10,
    band,
    reasons,
    oversight,
  };
}

export function scoreAll(jobs: CandidateJob[]): ScoredJob[] {
  return jobs
    .map(scoreJob)
    .sort((a, b) => b.automation_fit - a.automation_fit);
}
