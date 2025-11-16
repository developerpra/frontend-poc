import { NavLink } from "react-router-dom";

export default function Header() {
  const baseClasses =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors";
  const activeClasses = "bg-blue-600 text-white shadow-sm";
  const inactiveClasses = "text-gray-700 hover:bg-blue-50 hover:text-blue-700";

  return (
    <header className="w-full bg-white border-b shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo / App Name */}
        <span className="text-xl font-bold tracking-tight text-blue-700">
          My App
        </span>

        {/* Navigation Links */}
        <div className="flex items-center gap-3">
          <NavLink
            to="/module-1"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Module 1
          </NavLink>

          <NavLink
            to="/module-2"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Module 2
          </NavLink>

          <NavLink
            to="/pwa-1"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            PWA 1
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
