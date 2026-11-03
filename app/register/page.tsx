import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <AuthGuard mode="guest">
      <AuthForm mode="register" />
    </AuthGuard>
  );
}
