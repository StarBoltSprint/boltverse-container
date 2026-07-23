import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "./components/Shell";
import { PlatformProvider, usePlatform } from "./platform/PlatformContext";
import { Codex } from "./pages/Codex";
import { Create } from "./pages/Create";
import { Discover } from "./pages/Discover";
import { Home } from "./pages/Home";
import { Pack } from "./pages/Pack";
import { PlatformSelect } from "./pages/PlatformSelect";
import { Play } from "./pages/Play";
import { Results } from "./pages/Results";

function ChooseRoute() {
  const { platform } = usePlatform();
  if (platform) {
    return <Navigate to="/" replace />;
  }
  return <PlatformSelect />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/choose" element={<ChooseRoute />} />
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="discover" element={<Discover />} />
        <Route path="create" element={<Create />} />
        <Route path="pack" element={<Pack />} />
        <Route path="codex" element={<Codex />} />
        <Route path="play/:id" element={<Play />} />
        <Route path="results/:id" element={<Results />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

/**
 * HashRouter works on static hosts / *.grok.me without server rewrite rules.
 * First visit → platform chooser (Desktop / Android / iOS) → shell Home.
 */
export default function App() {
  return (
    <PlatformProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </PlatformProvider>
  );
}
