import { NavLink } from "react-router-dom";
import { MdDashboard, MdCalendarMonth, MdCheckCircle, MdStickyNote2, MdLogout } from "react-icons/md";
import { useTodos } from "../context/TodoContext";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { todos } = useTodos();
  const { user, logout } = useAuth();

  const today     = new Date().toISOString().split("T")[0];
  const active    = todos.filter(t => !t.completed);
  const upcoming  = todos.filter(t => !t.completed && t.dueDate && t.dueDate >= today);
  const completed = todos.filter(t =>  t.completed);

  const navItems = [
    { to: "/",            label: "Dashboard",   icon: MdDashboard,     count: active.length,    end: true,  color: "from-violet-500 to-purple-600"  },
    { to: "/upcoming",    label: "Upcoming",    icon: MdCalendarMonth, count: upcoming.length,  end: false, color: "from-indigo-500 to-blue-500"    },
    { to: "/completed",   label: "Completed",   icon: MdCheckCircle,   count: completed.length, end: false, color: "from-teal-500 to-emerald-500"   },
    { to: "/sticky-wall", label: "Sticky Wall", icon: MdStickyNote2,   count: 0,                end: false, color: "from-amber-500 to-orange-400"   },
  ];

  const initials = user?.name
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  return (
    <aside
      className="hidden md:flex w-64 text-white min-h-screen flex-col shrink-0 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #3b0764 0%, #4c1d95 40%, #312e81 100%)" }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 -translate-y-16 translate-x-16"
        style={{ background: "radial-gradient(circle, #c084fc, transparent)" }} />
      <div className="absolute bottom-20 left-0 w-32 h-32 rounded-full opacity-10 -translate-x-12"
        style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />

      <div className="relative flex flex-col h-full p-5">
        {/* Logo */}
        <div className="slide-in-left mb-7">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner shrink-0"
              style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)" }}>
              ✅
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">Todo App</h2>
              <p className="text-purple-300 text-xs">
                <span className="text-white font-semibold">{active.length}</span> task{active.length !== 1 ? "s" : ""} left
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="space-y-1 flex-1">
          {navItems.map(({ to, label, icon: Icon, count, end, color }, i) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={{ animationDelay: `${i * 70}ms` }}
              className={({ isActive }) =>
                `slide-in-left relative flex items-center justify-between px-3.5 py-3 rounded-xl
                 transition-all duration-200 group overflow-hidden
                 ${isActive
                   ? "bg-white/15 shadow-inner"
                   : "hover:bg-white/8 border border-transparent hover:border-white/10"
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active glow bg */}
                  {isActive && (
                    <span className={`absolute inset-0 opacity-20 bg-gradient-to-r ${color}`} />
                  )}
                  {/* Left accent bar */}
                  <span className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-full transition-all duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`}
                    style={{ background: isActive ? "white" : "rgba(255,255,255,0.5)" }}
                  />

                  <div className="flex items-center gap-3 relative z-10">
                    {/* Icon with gradient bg on active */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isActive ? `bg-gradient-to-br ${color} shadow-md` : "bg-white/10 group-hover:bg-white/15"
                    }`}>
                      <Icon size={16} className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                    </div>
                    <span className={`text-sm font-medium transition-colors ${isActive ? "text-white" : "text-purple-200 group-hover:text-white"}`}>
                      {label}
                    </span>
                  </div>

                  {count > 0 && (
                    <span className={`relative z-10 text-[11px] font-bold px-2 py-0.5 rounded-full transition-all ${
                      isActive ? "bg-white text-purple-800 shadow-sm" : "bg-white/20 text-white/90"
                    }`}>
                      {count}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User profile */}
        <div className="mt-4 pt-4 border-t border-white/10 slide-in-left" style={{ animationDelay: "320ms" }}>
          {user && (
            <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/8 transition-colors group mb-2">
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 shadow-md"
                style={{ background: "linear-gradient(135deg, #f472b6, #a855f7)" }}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate leading-tight">{user.name}</p>
                <p className="text-purple-300 text-xs truncate">{user.email}</p>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="text-purple-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 active:scale-95"
              >
                <MdLogout size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
