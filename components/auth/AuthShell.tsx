"use client";

import { useState } from "react";
import { AuthChrome } from "./AuthChrome";
import { SignIn } from "./screens/SignIn";
import { Forgot } from "./screens/Forgot";
import { Verify } from "./screens/Verify";
import type { AuthContext, Screen } from "./types";

export function AuthShell({ initial = "signin" }: { initial?: Screen }) {
  const [screen, setScreen] = useState<Screen>(initial);
  const [ctx, setCtx] = useState<AuthContext>({ email: "" });

  const go: (next: Screen, patch?: Partial<AuthContext>) => void = (
    next,
    patch,
  ) => {
    if (patch) setCtx((prev) => ({ ...prev, ...patch }));
    setScreen(next);
  };

  return (
    <AuthChrome>
      {screen === "signin" && <SignIn go={go} />}
      {screen === "forgot" && <Forgot go={go} ctx={ctx} />}
      {screen === "verify" && <Verify go={go} ctx={ctx} />}
    </AuthChrome>
  );
}
