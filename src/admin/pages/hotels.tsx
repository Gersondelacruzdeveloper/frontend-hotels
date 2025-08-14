// src/admin/pages/Hotels.tsx
import { useEffect, useMemo, useState } from "react";
import { AdminApi } from "../adminApi";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { setCurrentHotel } from "../../features/conversations/conversationsSlice";

type Hotel = {
  id: string;
  name: string;
  slug: string;
  brand_color?: string;
  logo?: string;
  primary_staff_language?: string;
  country?: string;
  timezone?: string;
  is_active?: boolean;
  organization?: string;
};

export default function Hotels() {
  const dispatch = useDispatch();
  const [items, setItems] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await AdminApi.hotels.list();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const onCreate = () => { setEditing(null); setShowForm(true); };
  const onEdit = (h: Hotel) => { setEditing(h); setShowForm(true); };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this hotel? This cannot be undone.")) return;
    await AdminApi.hotels.remove(id);
    load();
  };

  const onPick = (h: Hotel) => {
    dispatch(setCurrentHotel({ id: h.id, name: h.name, logo: h.logo }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Hotels</h1>
          <p className="text-sm text-slate-600">Create, edit and switch the active hotel.</p>
        </div>
        <button className="btn-primary" onClick={onCreate}>New hotel</button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b">
            <tr>
              <th className="p-3">Name</th>
              <th>Slug</th>
              <th>Lang</th>
              <th>Time zone</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(h => (
              <tr key={h.id} className="border-b last:border-0">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {h.logo ? (
                      <img src={h.logo} className="h-6 w-6 rounded border" />
                    ) : (
                      <div className="h-6 w-6 rounded bg-indigo-600 text-white grid place-items-center text-[11px]">
                        {h.name?.slice(0,1) || "H"}
                      </div>
                    )}
                    <button
                      className="text-indigo-600 hover:underline"
                      onClick={() => onPick(h)}
                      title="Set as current hotel"
                    >
                      {h.name}
                    </button>
                  </div>
                </td>
                <td>{h.slug}</td>
                <td>{h.primary_staff_language || "-"}</td>
                <td>{h.timezone || "-"}</td>
                <td>{h.is_active ? "Yes" : "No"}</td>
                <td className="text-right pr-3 space-x-2">
                  <button className="btn-secondary" onClick={() => onEdit(h)}>Edit</button>
                  <button className="btn-danger" onClick={() => onDelete(h.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr><td className="p-3 text-slate-500" colSpan={6}>No hotels yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <HotelFormModal
          initial={editing || undefined}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); }}
        />
      )}
    </div>
  );
}

function HotelFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial?: Partial<Hotel>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name,setName]=useState(initial?.name || "");
  const [slug,setSlug]=useState(initial?.slug || "");
  const [lang,setLang]=useState(initial?.primary_staff_language || "es");
  const [tz,setTz]=useState(initial?.timezone || "America/Santo_Domingo");
  const [country,setCountry]=useState(initial?.country || "DO");
  const [color,setColor]=useState(initial?.brand_color || "#3B82F6");
  const [logo,setLogo]=useState(initial?.logo || "");
  const [active,setActive]=useState(initial?.is_active ?? true);
  const [saving,setSaving]=useState(false);

  const isEdit = Boolean(initial?.id);

  const save = async () => {
    setSaving(true);
    const body = {
      name, slug,
      primary_staff_language: lang,
      timezone: tz,
      country, brand_color: color,
      logo, is_active: active,
      ...(initial?.organization ? { organization: initial.organization } : {}),
    };
    try {
      if (isEdit) await AdminApi.hotels.update(String(initial?.id), body);
      else        await AdminApi.hotels.create(body as any);
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
      <div className="w-[min(680px,95vw)] bg-white rounded-2xl border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{isEdit ? "Edit hotel" : "New hotel"}</h2>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Name</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Sunrise Punta Cana" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Slug</label>
            <input className="input" value={slug} onChange={e=>setSlug(e.target.value)} placeholder="sunrise-punta-cana" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Primary staff language</label>
            <input className="input" value={lang} onChange={e=>setLang(e.target.value)} placeholder="es" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Timezone</label>
            <input className="input" value={tz} onChange={e=>setTz(e.target.value)} placeholder="America/Santo_Domingo" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Country (ISO-2)</label>
            <input className="input" value={country} onChange={e=>setCountry(e.target.value)} placeholder="DO" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Brand color</label>
            <input className="input" value={color} onChange={e=>setColor(e.target.value)} type="color" />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-sm font-medium">Logo URL</label>
            <input className="input" value={logo} onChange={e=>setLogo(e.target.value)} placeholder="https://..." />
          </div>

          <label className="flex items-center gap-2 sm:col-span-2">
            <input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} />
            <span className="text-sm">Active</span>
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : (isEdit ? "Save changes" : "Create")}
          </button>
        </div>
      </div>
    </div>
  );
}
