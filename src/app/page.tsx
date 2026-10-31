import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { PERSONAS } from "@/lib/personas/personas";

const FEATURES = [
  {
    href: "/cuppa",
    emoji: "☕",
    name: "Cuppa",
    text: "One-to-one chats with a Local — from casual natter to job interviews, meetings and stage rehearsals.",
  },
  {
    href: "/briefing",
    emoji: "📻",
    name: "The Briefing",
    text: "A Local talks you through today's UK, India or world news — or any topic you like — then you ask questions.",
  },
  {
    href: "/playback",
    emoji: "📈",
    name: "Playback",
    text: "After each session: your pace, filler words, clarity, and better ways to say what you said.",
  },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="pt-6 text-center sm:pt-12">
        <p className="mb-3 inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-medium">Private beta</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Talk like a local.
          <br />
          <span className="text-brand">Speak like a pro.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Practise real conversations with friendly AI Locals from London, Birmingham, Glasgow and beyond — then get honest,
          useful feedback on how you sound.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/cuppa" className="rounded-full bg-brand px-6 py-3 font-medium text-brand-ink hover:opacity-90">
            Start a conversation
          </Link>
          <Link href="/briefing" className="rounded-full border border-line bg-surface px-6 py-3 font-medium hover:bg-surface-2">
            Hear the news
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <Link key={f.href} href={f.href} className="rounded-2xl bg-surface p-5 ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-2xl">{f.emoji}</div>
            <h2 className="mt-2 font-semibold">{f.name}</h2>
            <p className="mt-1 text-sm text-muted">{f.text}</p>
          </Link>
        ))}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Meet the Locals</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PERSONAS.map((p) => (
            <Link key={p.id} href={`/cuppa?local=${p.id}`} className="flex gap-3 rounded-2xl bg-surface p-4 ring-1 ring-line hover:ring-brand">
              <Avatar persona={p} />
              <div className="min-w-0">
                <div className="font-medium">
                  {p.name} <span className="text-sm font-normal text-muted">· {p.accentLabel}</span>
                </div>
                <p className="text-sm text-muted">{p.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
