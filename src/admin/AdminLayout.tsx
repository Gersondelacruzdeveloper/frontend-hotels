// src/admin/AdminLayout.tsx
import { Outlet, NavLink } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

export default function AdminLayout() {
  const hotel = useSelector((s: RootState) => s.conversations.currentHotel);
  // in AdminLayout before rendering:
    const role = useSelector((s:RootState)=>s.auth.role);
    if (role !== "admin" && role !== "manager") {
    return <div className="p-6">You need manager/admin access.</div>;
    }

  return (
    <div className="h-screen w-full grid grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="min-h-0 flex flex-col">
        <header className="h-14 border-b bg-white flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {hotel?.logo ? (
              <img src={hotel.logo} className="h-8 w-8 rounded border" />
            ) : (
              <div className="h-8 w-8 rounded bg-indigo-600 text-white grid place-items-center">
                {(hotel?.name || "H").slice(0,1)}
              </div>
            )}
            <div className="font-semibold">{hotel?.name || "Hotel Admin"}</div>
            <span className="text-xs text-slate-500">Admin</span>
          </div>
          <NavLink to="/hotels" className="text-sm text-indigo-600 hover:underline">
            Go to Inbox →
          </NavLink>
        </header>
        <main className="flex-1 overflow-auto bg-slate-50 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
