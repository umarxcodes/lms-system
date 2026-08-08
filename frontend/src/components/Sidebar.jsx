import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  CalendarDays,
  Network,
  CheckSquare,
  GraduationCap,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { path: "/students", label: "Students", icon: Users },
  { path: "/attendance", label: "Attendance", icon: CalendarDays },
  { path: "/teams", label: "Teams", icon: Network },
  { path: "/tasks", label: "Tasks", icon: CheckSquare },
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-100 flex flex-col justify-between h-full">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-900 leading-tight">
              SMIT
            </p>
            <p className="text-xs text-gray-400 leading-tightgu">Bootcamp LMS</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 mt-2 flex flex-col gap-1">
          {navItems.map(({ path, label, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`
              }
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="px-3 pb-6">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg mb-4 transition-colors">
          New Enrollment
        </button>
        <div className="border-t border-gray-100 pt-3 flex flex-col gap-1">
          <button className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
            Settings
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
            Support
          </button>
        </div>
      </div>
    </aside>
  );
}
