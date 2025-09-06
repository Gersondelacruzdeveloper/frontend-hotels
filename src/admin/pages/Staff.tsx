// src/admin/pages/Staff.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { AdminApi } from "../adminApi";

type StaffRow = {
  id: string;
  role: "agent" | "manager" | "admin";
  is_active: boolean;
  user_email?: string;
  user_name?: string;
  department?: { id: string; name: string; slug: string } | null;
};

type Dept = { id: string; name: string };

export default function Staff() {
  const hotel = useSelector((s: RootState) => s.conversations.currentHotel);
  const hotelId = (hotel?.id as string) || "";

  const [items, setItems] = useState<StaffRow[]>([]);
  const [departments, setDepartments] = useState<Dept[]>([]);

  // form state
  const [identifier, setIdentifier] = useState(""); // email or user_id
  const [name, setName] = useState("");             // optional (used when creating by email)
  const [role, setRole] = useState<"agent" | "manager" | "admin">("agent");
  const [departmentId, setDepartmentId] = useState<string>("");
  const [sendInvite, setSendInvite] = useState<boolean>(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!hotelId) return;
    const [staffRes, deptRes] = await Promise.all([
      AdminApi.staff.list(hotelId),
      AdminApi.departments.list(hotelId),
    ]);
    setItems(staffRes.data as StaffRow[]);
    setDepartments(deptRes.data as Dept[]);
  }

  useEffect(() => {
    setItems([]);
    setDepartments([]);
    setError(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelId]);

  async function add() {
    if (!hotelId || !identifier.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const v = identifier.trim();
      const body: any = v.includes("@")
        ? { email: v, name: name.trim() || undefined, role, send_invite: sendInvite }
        : { user_id: v, role, send_invite: sendInvite };

      if (departmentId) body.department_id = departmentId;

      await AdminApi.staff.create(hotelId, body);
      // reset form
      setIdentifier("");
      setName("");
      setRole("agent");
      setDepartmentId("");
      setSendInvite(true);
      await load();
    } catch (e: any) {
      setError(
        e?.response?.data?.detail ??
        (typeof e?.response?.data === "string"
          ? e.response.data
          : JSON.stringify(e?.response?.data || "Failed to add staff"))
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!hotelId) return;
    await AdminApi.staff.remove(hotelId, id);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Staff</h1>
          <p className="text-sm text-slate-600">{hotel?.name || "Choose a hotel"}</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-4 grid sm:grid-cols-5 gap-3">
        <input
          className="input"
          placeholder="Email or User ID"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <input
          className="input"
          placeholder="Name (optional for email invites)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select className="input" value={role} onChange={(e) => setRole(e.target.value as any)}>
          <option value="agent">Agent</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        <select
          className="input"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        >
          <option value="">No department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <input
            id="send-invite"
            type="checkbox"
            checked={sendInvite}
            onChange={(e) => setSendInvite(e.target.checked)}
          />
          <label htmlFor="send-invite" className="text-sm">Send invite email</label>
        </div>

        <div className="sm:col-span-5 flex justify-end">
          <button
            className="btn-primary"
            onClick={add}
            disabled={saving || !identifier || !hotelId}
          >
            {saving ? "Adding…" : "Add staff"}
          </button>
        </div>

        {error && <div className="sm:col-span-5 text-sm text-red-600">{error}</div>}
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b">
            <tr>
              <th className="p-3">User</th>
              <th>Role</th>
              <th>Dept</th>
              <th className="w-32"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((m) => (
              <tr key={m.id} className="border-b last:border-0">
                <td className="p-3">{m.user_name || m.user_email || "-"}</td>
                <td>{m.role}</td>
                <td>{m.department?.name || "-"}</td>
                <td className="text-right pr-3">
                  <button className="btn-danger" onClick={() => remove(m.id)}>Remove</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="p-3 text-slate-500" colSpan={4}>No staff yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
