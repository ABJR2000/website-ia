import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const metadata: Metadata = { title: "My snippets" };

export default function DashboardPage() {
  return (
    <AuthGuard mode="private">
      <DashboardView />
    </AuthGuard>
  );
}
