// src/admin/pages/Departments.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { AdminApi } from "../adminApi";

type Dept = { id: string; name: string; slug: string };

export default function Departments() {
  const hotel = useSelector((s: RootState) => s.conversations.currentHotel);
  const hotelId = hotel?.id || "";
  const [items, setItems] = useState<Dept[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Dept | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    if (!hotelId) return;
    setLoading(true);
    try {
      const { data } = await AdminApi.departments.list(hotelId);
      setItems(data as Dept[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setItems([]);
    load();
  }, [hotelId]);

  const createNew = () => { setEditing(null); setShowForm(true); };
  const edit = (d: Dept) => { setEditing(d); setShowForm(true); };
  const remove = async (id: string) => {
    if (!hotelId) return;
    if (!confirm("Delete this department?")) return;
    await AdminApi.departments.remove(hotelId, id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Departments</h1>
          <p className="text-sm text-slate-600">{hotel?.name || "Choose a hotel"}</p>
        </div>
        <button className="btn-primary" onClick={createNew} disabled={!hotelId}>
          New department
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b">
            <tr>
              <th className="p-3">Name</th>
              <th>Slug</th>
              <th className="w-40"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <tr key={d.id} className="border-b last:border-0">
                <td className="p-3">{d.name}</td>
                <td>{d.slug}</td>
                <td className="text-right pr-3 space-x-2">
                  <button className="btn-secondary" onClick={() => edit(d)}>Edit</button>
                  <button className="btn-danger" onClick={() => remove(d.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr><td className="p-3 text-slate-500" colSpan={3}>No departments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <DeptForm
          hotelId={hotelId}
          initial={editing || undefined}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); }}
        />
      )}
    </div>
  );
}

function DeptForm({
  hotelId, initial, onClose, onSaved,
}: { hotelId: string; initial?: Partial<Dept>; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(initial?.id);

  const save = async () => {
    if (!hotelId) return;
    setSaving(true);
    try {
      const body = { name, slug };
      if (isEdit) await AdminApi.departments.update(hotelId, String(initial?.id), body);
      else await AdminApi.departments.create(hotelId, body);
      onSaved();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
      <div className="w-[min(560px,95vw)] bg-white rounded-2xl border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{isEdit ? "Edit department" : "New department"}</h2>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
        <div className="grid gap-3">
          <div className="space-y-1">
            <div className="text-sm font-medium">Name</div>
            <input className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Reception" />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">Slug</div>
            <input className="input" value={slug} onChange={(e)=>setSlug(e.target.value)} placeholder="reception" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={save} disabled={saving || !name || !slug}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
