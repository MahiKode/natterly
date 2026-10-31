"use client";

import type { ChatMessage, CoachFeedback } from "@/lib/api-schema";

/**
 * Practice history, stored on the learner's device (localStorage) in Phase 1.
 * No accounts or database yet — see ADR-0002. Phase 2 syncs this to the cloud.
 *
 * Bump STORAGE_KEY's version suffix if the Session shape changes incompatibly.
 */

const STORAGE_KEY = "natterly.sessions.v1";
const MAX_SESSIONS = 50;

/** One line in a conversation, with speaking stats for the learner's spoken lines. */
export interface Turn extends ChatMessage {
  durationSec?: number;
  confidence?: number;
}

export interface Session {
  id: string;
  kind: "cuppa" | "briefing";
  personaId: string;
  /** Scenario title or briefing topic. */
  title: string;
  startedAt: string;
  turns: Turn[];
  feedback?: CoachFeedback;
}

export function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session[]) : [];
  } catch {
    return [];
  }
}

export function getSession(id: string): Session | undefined {
  return loadSessions().find((s) => s.id === id);
}

export function saveSession(session: Session) {
  const others = loadSessions().filter((s) => s.id !== session.id);
  const next = [session, ...others].slice(0, MAX_SESSIONS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked: the report still works for this page view.
  }
}

export function deleteSession(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loadSessions().filter((s) => s.id !== id)));
  } catch {
    // ignore
  }
}

export function newSessionId(): string {
  return crypto.randomUUID();
}
