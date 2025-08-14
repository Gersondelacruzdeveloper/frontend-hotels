// src/admin/pages/AdminOverview.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { AdminApi } from "../adminApi";
import { Link } from "react-router-dom";

export default function AdminOverview() {
  const currentHotel = useSelector((s: RootState) => s.conversations.currentHotel);
  const [counts, setCounts] = useState({ depts: "-", staff: "-", open: "-", qrs: "-" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!currentHotel?.id) return;
      setLoading(true);
      try {
        const [depts, staff, qrs, open] = await Promise.all([
          AdminApi.departments.list(currentHotel.id),
          AdminApi.staff.list(currentHotel.id),
          AdminApi.qr.list(currentHotel.id),
          AdminApi.conversations.openCount(currentHotel.id),
        ]);
        if (!alive) return;
        setCounts({
          depts: String((depts.data?.length ?? 0)),
          staff: String((staff.data?.length ?? 0)),
          qrs:   String((qrs.data?.length ?? 0)),
          open:  String(open),
        });
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, [currentHotel?.id]);

  return (
    <div className="space-y-6">
      {/* Page header inside content (no extra sidebars here) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Overview</h1>
          <p className="text-sm text-slate-600">
            {currentHotel?.name ? `Managing: ${currentHotel.name}` : "Choose a hotel to manage."}
          </p>
        </div>
        <Link
          to={currentHotel?.id ? `/hotels/${currentHotel.id}` : "/hotels"}
          className="btn-secondary"
        >
          Go to Inbox →
        </Link>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Departments" value={counts.depts} to="/admin/departments" loading={loading} />
        <Card title="Staff"       value={counts.staff} to="/admin/staff"        loading={loading} />
        <Card title="Open conversations" value={counts.open} to="/admin"        loading={loading} />
        <Card title="QR links"    value={counts.qrs}  to="/admin/qr-links"      loading={loading} />
      </div>

      {!currentHotel?.id && (
        <p className="text-sm text-slate-500">Select a hotel in the top bar (Hotel Switcher) to see stats.</p>
      )}
    </div>
  );
}

function Card({ title, value, to, loading }: { title: string; value: string; to: string; loading: boolean }) {
  return (
    <Link
      to={to}
      className="block rounded-2xl border bg-white hover:shadow-sm transition p-4"
    >
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 text-3xl font-semibold">{loading ? "—" : value}</div>
    </Link>
  );
}
