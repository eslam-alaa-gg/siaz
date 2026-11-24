"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="space-y-3">
      <input
        name="password"
        type="password"
        required
        autoFocus
        placeholder="Password"
        aria-label="Admin password"
        className="field"
      />
      {state?.error && <p className="px-2 text-xs text-red-700">{state.error}</p>}
      <button disabled={pending} className="btn btn-strong w-full py-3.5">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
