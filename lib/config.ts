// Shared by server (metadata) and client (navbar) code, so it must not live in a "use client" module.
export const APP_NAME = "Snippet Vault";

// Optional shared account so visitors can try the app without registering.
// Both values are public by design (NEXT_PUBLIC_*): use a throwaway account with no real data.
const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL;
const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

export const DEMO_ACCOUNT =
  demoEmail && demoPassword ? { email: demoEmail, password: demoPassword } : null;
