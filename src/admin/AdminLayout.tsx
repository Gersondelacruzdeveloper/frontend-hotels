// src/admin/AdminLayout.tsx
import { NavLink, Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";

export default function AdminLayout() {
  return (
    <div className="h-screen flex flex-col">
      <Topbar />

      <div className="flex flex-1 min-h-0">
        <aside className="w-64 bg-white border-r p-3 space-y-2">
          <div className="px-2 py-1 text-[11px] uppercase tracking-wide text-slate-500">Manage</div>
          {/* NOTE: these links are RELATIVE to /admin because they live under AdminLayout */}
          <SideLink to="" label="Overview" />
          <SideLink to="hotels" label="Hotels" />
          <SideLink to="departments" label="Departments" />
          <SideLink to="staff" label="Staff" />
          <SideLink to="quick-replies" label="Quick replies" />
          <SideLink to="qr-links" label="QR links" />
          <SideLink to="settings" label="Settings" />
        </aside>

        <main className="flex-1 overflow-auto bg-slate-50 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SideLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `block px-3 py-2 rounded-lg text-sm ${
          isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
