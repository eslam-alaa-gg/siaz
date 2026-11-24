"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Newsletter({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const r = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Something went wrong");
      setState("done");
      setMsg(j.message);
      setEmail("");
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait" initial={false}>
        {state === "done" ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-full border border-current/20 px-6 py-3.5 text-sm"
          >
            {msg}
          </motion.p>
        ) : (
          <motion.form key="form" onSubmit={submit} exit={{ opacity: 0 }} className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === "error") setState("idle");
              }}
              placeholder="Your email address"
              aria-label="Email address"
              className={`field flex-1 ${dark ? "!border-ivory/25 !bg-ivory/5 !text-ivory placeholder:!text-ivory/40 focus:!border-ivory/70" : ""}`}
            />
            <button type="submit" disabled={state === "loading"} className={`btn ${dark ? "btn-light" : "btn-strong"}`}>
              {state === "loading" ? "Joining…" : "Subscribe"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      {state === "error" && <p className="mt-2 px-2 text-xs text-red-700">{msg}</p>}
    </div>
  );
}
