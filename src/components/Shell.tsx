import { Outlet } from "react-router-dom";
import { usePlatform } from "../platform/PlatformContext";
import { BottomNav } from "./BottomNav";
import { SideNav } from "./SideNav";
import { TopBar } from "./TopBar";

export function Shell() {
  const { platform, isMobile } = usePlatform();

  const shellClass = [
    "app-shell",
    `app-shell--${platform}`,
    isMobile ? "app-shell--mobile" : "app-shell--desktop",
  ].join(" ");

  return (
    <div className={`platform-stage platform-stage--${platform}`}>
      {isMobile && (
        <div className="device-chrome" aria-hidden>
          <div className="device-notch" />
          <div className="device-status">
            <span>9:41</span>
            <span className="device-status-icons">
              {platform === "ios" ? "●●●●  Wi‑Fi  🔋" : "LTE  Wi‑Fi  🔋"}
            </span>
          </div>
        </div>
      )}

      <div className={shellClass}>
        <TopBar />
        {!isMobile && <SideNav />}
        <main className="main">
          <Outlet />
        </main>
        {isMobile && <BottomNav />}
      </div>

      {isMobile && <div className="device-home-bar" aria-hidden />}
    </div>
  );
}
