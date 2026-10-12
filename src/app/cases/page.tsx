import type { Metadata } from "next";
import { CaseSelect } from "@/components/screens/CaseSelect";

export const metadata: Metadata = { title: "Case Selection · CASE FILES: Hidden Truths" };

export default function Page() {
  return <CaseSelect />;
}
