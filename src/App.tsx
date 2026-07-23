import type { ReactNode } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { Shell } from "./components/Shell";
import { ContentProvider } from "./content/ContentContext";
import { isOnboardingDone } from "./data/contentStore";
import { Auth } from "./pages/Auth";
import { Codex } from "./pages/Codex";
import { Create } from "./pages/Create";
import { Discover } from "./pages/Discover";
import { Home } from "./pages/Home";
import { Onboarding } from "./pages/Onboarding";
import { Pack } from "./pages/Pack";
import { PlatformSelect } from "./pages/PlatformSelect";
import { Play } from "./pages/Play";
import { Profile } from "./pages/Profile";
import { Results } from "./pages/Results";
import { PlatformProvider, usePlatform } from "./platform/PlatformContext";

function ChooseRoute() {
  const { platform } = usePlatform();
  const { isLoggedIn, user } = useAuth();
  if (!platform) return <PlatformSelect />;
  if (!isLoggedIn || !user) return <Navigate to="/auth" replace />;
  if (!isOnboardingDone(user.id)) return <Navigate to="/onboarding" replace />;
  return <Navigate to="/" replace />;
}

function AuthRoute() {
  const { platform } = usePlatform();
  if (!platform) return <Navigate to="/choose" replace />;
  return <Auth />;
}

function OnboardingRoute() {
  const { platform } = usePlatform();
  const { isLoggedIn, user } = useAuth();
  if (!platform) return <Navigate to="/choose" replace />;
  if (!isLoggedIn || !user) return <Navigate to="/auth" replace />;
  if (isOnboardingDone(user.id)) return <Navigate to="/" replace />;
  return <Onboarding />;
}

function RequireReady({ children }: { children: ReactNode }) {
  const { platform } = usePlatform();
  const { isLoggedIn, user } = useAuth();
  if (!platform) return <Navigate to="/choose" replace />;
  if (!isLoggedIn || !user) return <Navigate to="/auth" replace />;
  if (!isOnboardingDone(user.id)) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/choose" element={<ChooseRoute />} />
      <Route path="/auth" element={<AuthRoute />} />
      <Route path="/onboarding" element={<OnboardingRoute />} />
      <Route
        element={
          <RequireReady>
            <Shell />
          </RequireReady>
        }
      >
        <Route index element={<Home />} />
        <Route path="discover" element={<Discover />} />
        <Route path="create" element={<Create />} />
        <Route path="pack" element={<Pack />} />
        <Route path="codex" element={<Codex />} />
        <Route path="profile" element={<Profile />} />
        <Route path="play/:id" element={<Play />} />
        <Route path="results/:id" element={<Results />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

/**
 * Flow: platform → auth (register / reconnect) → onboarding → shell + profile.
 */
export default function App() {
  return (
    <PlatformProvider>
      <AuthProvider>
        <ContentProvider>
          <HashRouter>
            <AppRoutes />
          </HashRouter>
        </ContentProvider>
      </AuthProvider>
    </PlatformProvider>
  );
}
