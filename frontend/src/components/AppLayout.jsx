import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

// Persistent app shell — Sidebar + Header stay mounted across every page.
// Outlet renders whichever child route matched (Dashboard, Students, etc).
export default function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
