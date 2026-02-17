import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 border-b border-gray-800 bg-gray-950 flex items-center justify-between px-6">
      {/* Left — Page context only (NO sidebar duplication) */}
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-gray-100 tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* Right — User actions */}
      <div className="flex items-center gap-4">
        {/* Profile */}
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <img
            src="/profile.png"
            alt="profile"
            className="w-8 h-8 rounded-full brightness-0 invert opacity-90"
          />
          <span className="hidden sm:block">My Account</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
