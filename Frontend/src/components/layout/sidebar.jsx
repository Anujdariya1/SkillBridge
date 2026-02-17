import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "/dashboard.png" },
  { to: "/careers", label: "Careers", icon: "/career.png" },
  { to: "/learning", label: "Learning Path", icon: "/learningpath.png" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-gray-950 border-r border-gray-800 p-4">
      {/* Logo / Title */}
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold text-blue-500 tracking-tight">
          SkillBridge
        </h1>
        <p className="text-xs text-gray-500 mt-1">Career roadmap platform</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
              }`
            }
          >
            {/* Icon (black PNG → white via CSS) */}
            <img
              src={item.icon}
              alt=""
              className="w-5 h-5 brightness-0 invert opacity-90"
            />

            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section (future profile/settings area) */}
      <div className="mt-auto pt-6 border-t border-gray-800">
        <div className="flex items-center gap-3 px-2 py-2 text-sm text-gray-400">
          <img
            src="/profile.png"
            alt="profile"
            className="w-6 h-6 rounded-full brightness-0 invert opacity-80"
          />
          <span>User Profile</span>
        </div>
      </div>
    </aside>
  );
}
