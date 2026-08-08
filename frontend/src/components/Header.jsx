import { Search, Bell, MessageSquare, HelpCircle } from "lucide-react";

const tabs = ["Overview", "Analytics", "Reports"];

export default function Header({ tab, setTab }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
      <h1 className="text-lg font-bold text-gray-900">Bootcamp Dashboard</h1>

      <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 w-72">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full"
        />
      </div>

      <nav className="flex items-center gap-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-sm pb-1 border-b-2 transition-colors ${
              tab === t
                ? "text-blue-600 border-blue-600 font-medium"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button className="relative text-gray-400 hover:text-gray-600">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button className="text-gray-400 hover:text-gray-600">
          <MessageSquare className="w-[18px] h-[18px]" />
        </button>
        <button className="text-gray-400 hover:text-gray-600 border border-gray-200 rounded-md w-7 h-7 flex items-center justify-center">
          <HelpCircle className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
          <img
            src="https://i.pravatar.cc/64?img=47"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
