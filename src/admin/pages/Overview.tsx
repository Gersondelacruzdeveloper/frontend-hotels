// src/admin/pages/Overview.tsx
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

export default function Overview() {
  const hotel = useSelector((s: RootState) => s.conversations.currentHotel);
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Departments" value="—" />
        <Stat label="Staff" value="—" />
        <Stat label="Open conversations" value="—" />
        <Stat label="QR links" value="—" />
      </div>
      <div className="text-sm text-slate-600">
        Managing: <span className="font-medium">{hotel?.name || "—"}</span>
      </div>
    </div>
  );
}
function Stat({label, value}:{label:string;value:string}) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-slate-500 text-sm">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
