import { CuppaPicker } from "./CuppaPicker";

export const metadata = { title: "Cuppa — Natterly" };

export default async function CuppaPage({ searchParams }: { searchParams: Promise<{ local?: string }> }) {
  const { local } = await searchParams;
  return <CuppaPicker initialLocal={local} />;
}
