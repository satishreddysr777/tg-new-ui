export interface Strength {
  score: 0 | 1 | 2 | 3 | 4;
  label: "EMPTY" | "WEAK" | "FAIR" | "GOOD" | "STRONG";
}

/** Lightweight, dependency-free password strength heuristic. */
export function scorePassword(pw: string): Strength {
  if (!pw) return { score: 0, label: "EMPTY" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  const clamped = Math.min(score, 4) as Strength["score"];
  const labels: Strength["label"][] = ["EMPTY", "WEAK", "FAIR", "GOOD", "STRONG"];
  return { score: clamped, label: labels[clamped] };
}
