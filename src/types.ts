export type CandidateJob = {
  id: string;
  name: string;
  description: string;
  /** 0–3: how much statutory / safety exposure */
  compliance_risk: number;
  /** 0–3: quality of available structured data */
  data_quality: number;
  /** 0–3: how often a licensed human must decide */
  human_in_loop_need: number;
  /** 0–3: how hard it is to undo a bad automated action */
  irreversibility: number;
  /** true if the step sits on a statutory obligation */
  statutory: boolean;
};

export type ScoredJob = CandidateJob & {
  automation_fit: number;
  band: "pilot" | "defer" | "reject";
  reasons: string[];
  oversight: string;
};
