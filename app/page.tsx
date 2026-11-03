import { AuthGuard } from "@/components/auth/AuthGuard";
import { HomeView } from "@/components/home/HomeView";

export default function Home() {
  return (
    <AuthGuard mode="private">
      <HomeView />
    </AuthGuard>
  );
}
