import { NavLink } from "react-router-dom";
import { MdDashboard, MdCalendarMonth, MdCheckCircle, MdStickyNote2 } from "react-icons/md";
import { useTodos } from "../context/TodoContext";

export default function BottomNav() {
  const { todos } = useTodos();

  const today    = new Date().toISOString().split("T")[0];
  const active   = todos.filter(t => !t.completed);
  const upcoming = todos.filter(t => !t.completed && t.dueDate && t.dueDate >= today);
  const completed= todos.filter(t =>  t.completed);

  const navItems = [
    { to: "/",            label: "Dashboard", icon: MdDashboard,     count: active.length,    end: true  },
    { to: "/upcoming",    label: "Upcoming",  icon: MdCalendarMonth, count: upcoming.length,  end: false },
    { to: "/completed",   label: "Done",      icon: MdCheckCircle,   count: completed.length, end: false },
    { to: "/sticky-wall", label: "Sticky",    icon: MdStickyNote2,   count: 0,                end: false },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden border-t border-white/10"
      style={{ background: "linear-gradient(160deg, #3b0764 0%, #4c1d95 50%, #312e81 100%)" }}
    >
      {navItems.map(({ to, label, icon: Icon, count, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2.5 text-[11px] gap-0.5 relative transition-all duration-200 ${
              isActive ? "text-white" : "text-purple-400 hover:text-purple-200"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400" />
              )}
              <div className={`relative transition-all duration-200 ${isActive ? "scale-115 -translate-y-0.5" : ""}`}>
                <div className={`w-9 h-7 flex items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive ? "bg-white/15" : ""
                }`}>
                  <Icon size={20} />
                </div>
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none shadow-sm">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </div>
              <span className={`font-medium transition-all ${isActive ? "text-white" : ""}`}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
