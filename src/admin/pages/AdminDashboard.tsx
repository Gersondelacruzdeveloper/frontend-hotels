// src/admin/pages/AdminDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Topbar from "../../components/Topbar";
import { RootState } from "../../app/store";
import { NavLink, useNavigate } from "react-router-dom";
import { AdminApi } from "../../features/admin/adminApi";
import { setCurrentHotel } from "../../features/conversations/conversationsSlice";

type Stat = { label: string; value: number | string; to: string };

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hotel = useSelector((s: RootState) => s.conversations.currentHotel);
  const token = useSelector((s: RootState) => s.auth.token);

  // simple stats
  const [deptCount, setDeptCount] = useState<number | null>(null);
  const [staffCount, setStaffCount] = useState<number | null>(null);
  const [qrCount, setQrCount] = useState<number | null>(null);
  const [openCount, setOpenCount] = useState<number | null>(null);

  // Hotel must be selected before loading
  const hotelId = hotel?.id as string | undefined;

  useEffect(() => {
    if (!token) {
      navigate("/hotels/login");
      return;
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!hotelId) return;
    (async () => {
      const [dept, staff, qrl, open] = await Promise.all([
        AdminApi.departments.list(hotelId).then(r => r.data.length).catch(() => 0),
        AdminApi.staff.list(hotelId).then(r => r.data.length).catch(() => 0),
        AdminApi.qr.list(hotelId).then(r => r.data.length).catch(() => 0),
        // conversations open
        AdminApi.conversations.openCount(hotelId).catch(() => 0),
      ]);
      setDeptCount(dept);
      setStaffCount(staff);
      setQrCount(qrl);
      setOpenCount(open);
    })();
  }, [hotelId]);

  const stats: Stat[] = useMemo(() => ([
    { label: "Departments",        value: deptCount ?? "—", to: "/admin/departments" },
    { label: "Staff",              value: staffCount ?? "—", to: "/admin/staff" },
    { label: "Open conversations", value: openCount ?? "—", to: "/admin" /* you can point to an inbox filter */ },
    { label: "QR links",           value: qrCount ?? "—", to: "/admin/qr-links" },
  ]), [deptCount, staffCount, openCount, qrCount]);

  return (
    <div className="h-screen flex flex-col">
      <Topbar connected />

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r p-3 space-y-2">
          <div className="px-2 py-1 text-[11px] uppercase tracking-wide text-slate-500">Manage</div>
          <SideLink to="/admin" label="Overview" />
          <SideLink to="/admin/departments" label="Departments" />
          <SideLink to="/admin/staff" label="Staff" />
          <SideLink to="/admin/quick-replies" label="Quick replies" />
          <SideLink to="/admin/qr-links" label="QR links" />
          <SideLink to="/admin/settings" label="Settings" />

          {/* Hotel switcher */}
          <div className="pt-4 border-t mt-4">
            <HotelSwitcher
              onPicked={(h) => dispatch(setCurrentHotel(h))}
              currentId={hotelId}
            />
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto bg-slate-50 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-semibold">Overview</h1>
              <div className="text-sm text-slate-600">
                Managing: <span className="font-medium">{hotel?.name || "Choose a hotel"}</span>
              </div>
            </div>
            <NavLink
              to="/hotels"
              className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-sm"
            >
              Go to Inbox →
            </NavLink>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <NavLink
                key={s.label}
                to={s.to}
                className="rounded-xl border bg-white p-4 hover:shadow-sm transition"
              >
                <div className="text-slate-500 text-sm">{s.label}</div>
                <div className="text-2xl font-semibold mt-1">{s.value}</div>
              </NavLink>
            ))}
          </div>

          {/* Helper */}
          {!hotelId && (
            <div className="mt-6 text-sm text-slate-600">
              Select a hotel in the left sidebar to start managing departments, staff, and more.
            </div>
          )}
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

/** Small hotel switcher fed by the Hotels API (admin-only list) */
function HotelSwitcher({
  currentId,
  onPicked,
}: {
  currentId?: string;
  onPicked: (h: any) => void;
}) {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // NOTE: this hits /api/hotels/hotels/ (HotelViewSet)
        const { data } = await AdminApi.hotels.list();
        setHotels(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-2">
      <div className="text-[11px] uppercase tracking-wide text-slate-500 px-1">Hotel</div>
      <select
        className="input"
        value={currentId || ""}
        onChange={(e) => {
          const h = hotels.find((x) => x.id === e.target.value);
          if (h) onPicked(h);
        }}
      >
        <option value="" disabled>
          {loading ? "Loading…" : "Select a hotel"}
        </option>
        {hotels.map((h) => (
          <option key={h.id} value={h.id}>
            {h.name}
          </option>
        ))}
      </select>
    </div>
  );
}
