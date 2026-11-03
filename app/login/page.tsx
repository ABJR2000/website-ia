import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthGuard mode="guest">
      <AuthForm mode="login" />
    </AuthGuard>
  );
}
