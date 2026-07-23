import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Home", icon: "🏰", end: true },
  { to: "/discover", label: "Discover", icon: "🔭", end: false },
  { to: "/create", label: "Create", icon: "⚒️", end: false },
  { to: "/pack", label: "Pack", icon: "🐺", end: false },
  { to: "/profile", label: "Profile", icon: "👤", end: false },
] as const;

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `bottom-nav-item${isActive ? " active" : ""}`}
        >
          <span className="icon" aria-hidden>
            {item.icon}
          </span>
          <span className="label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
