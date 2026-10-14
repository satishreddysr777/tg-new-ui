export const STAGES = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
] as const;

export type Stage = (typeof STAGES)[number];

export type EmpStatus = "Active" | "Onboarding" | "On bench";
