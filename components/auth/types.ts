export type Screen = "signin" | "forgot" | "verify";

export interface AuthContext {
  email: string;
  challengeId?: string;
  hint?: string;
}

export type GoFn = (next: Screen, patch?: Partial<AuthContext>) => void;
