import type { Metadata } from "next";
import { SettingsScreen } from "@/components/screens/SettingsScreen";

export const metadata: Metadata = { title: "Settings · CASE FILES: Hidden Truths" };

export default function Page() {
  return <SettingsScreen />;
}
