import { describe, expect, it } from "vitest";
import { scoreAll, scoreJob } from "../src/score.js";
import type { CandidateJob } from "../src/types.js";

const base: CandidateJob = {
  id: "x",
  name: "x",
  description: "x",
  compliance_risk: 0,
  data_quality: 3,
  human_in_loop_need: 0,
  irreversibility: 0,
  statutory: false,
};

describe("scoreJob", () => {
  it("pilots clean digest-style work", () => {
    const s = scoreJob({ ...base, id: "digest" });
    expect(s.band).toBe("pilot");
  });

  it("rejects statutory auto-close", () => {
    const s = scoreJob({
      ...base,
      statutory: true,
      compliance_risk: 3,
      irreversibility: 3,
      human_in_loop_need: 3,
    });
    expect(s.band).toBe("reject");
  });

  it("ranks pilots above rejects", () => {
    const ranked = scoreAll([
      { ...base, id: "good", data_quality: 3 },
      {
        ...base,
        id: "bad",
        statutory: true,
        compliance_risk: 3,
        data_quality: 1,
      },
    ]);
    expect(ranked[0]?.id).toBe("good");
    expect(ranked.at(-1)?.band).toBe("reject");
  });
});
