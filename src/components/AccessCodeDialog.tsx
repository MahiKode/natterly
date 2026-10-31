"use client";

import { useEffect, useState } from "react";
import { ACCESS_REQUIRED_EVENT, setAccessCode } from "@/lib/client/api";

/** Shown when the server answers 401: asks for the beta access code once and remembers it. */
export function AccessCodeDialog() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(ACCESS_REQUIRED_EVENT, show);
    return () => window.removeEventListener(ACCESS_REQUIRED_EVENT, show);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="access-title">
      <form
        className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl"
        onSubmit={(e) => {
          e.preventDefault();
          setAccessCode(code);
          setOpen(false);
        }}
      >
        <h2 id="access-title" className="text-lg font-semibold">
          Beta access
        </h2>
        <p className="mt-1 text-sm text-muted">Natterly is in private beta. Enter the access code you were given, then try again.</p>
        <input
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mt-4 w-full rounded-xl border border-line bg-bg px-3 py-2 outline-none focus:border-brand"
          placeholder="Access code"
        />
        <button className="mt-4 w-full rounded-xl bg-brand px-4 py-2 font-medium text-brand-ink">Save</button>
      </form>
    </div>
  );
}
