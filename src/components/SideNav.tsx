import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Home", icon: "🏰", end: true },
  { to: "/discover", label: "Discover", icon: "🔭", end: false },
  { to: "/create", label: "Create", icon: "⚒️", end: false },
  { to: "/pack", label: "Pack", icon: "🐺", end: false },
  { to: "/codex", label: "Codex", icon: "📜", end: false },
  { to: "/profile", label: "Profile", icon: "👤", end: false },
] as const;

export function SideNav() {
  return (
    <nav className="side-nav" aria-label="Main">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
        >
          <span className="icon" aria-hidden>
            {item.icon}
          </span>
          <span className="label">{item.label}</span>
        </NavLink>
      ))}
      <div className="nav-spacer" />
      <div className="nav-howl">AROO ⚡</div>
    </nav>
  );
}
