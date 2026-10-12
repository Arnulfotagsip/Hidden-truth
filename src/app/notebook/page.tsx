import type { Metadata } from "next";
import { NotebookScreen } from "@/components/screens/NotebookScreen";

export const metadata: Metadata = { title: "Case Notebook · CASE FILES: Hidden Truths" };

export default function Page() {
  return <NotebookScreen />;
}
