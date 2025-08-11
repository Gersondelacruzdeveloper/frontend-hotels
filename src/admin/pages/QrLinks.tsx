// src/admin/pages/QrLinks.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { AdminApi } from "../adminApi";

export default function QrLinks() {
  const hotelId = useSelector((s:RootState)=>s.conversations.currentHotel?.id) as string;
  const [items,setItems]=useState<any[]>([]);
  const [slug,setSlug]=useState(""); const [defaultLang,setLang]=useState("en");

  async function load(){ if(!hotelId) return; setItems((await AdminApi.qr.list(hotelId)).data); }
  useEffect(()=>{load();},[hotelId]);

  async function add(){
    await AdminApi.qr.create(hotelId,{ slug, default_guest_language: defaultLang });
    setSlug(""); load();
  }
  async function remove(id:string){ await AdminApi.qr.remove(hotelId,id); load(); }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">QR links</h1>

      <div className="bg-white border rounded-xl p-4 grid sm:grid-cols-4 gap-3">
        <input className="input" placeholder="Slug (sunrise-frontdesk)" value={slug} onChange={e=>setSlug(e.target.value)} />
        <input className="input" placeholder="Default language (en/es…)" value={defaultLang} onChange={e=>setLang(e.target.value)} />
        <div />
        <button className="btn-primary" onClick={add}>Create link</button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b">
            <tr><th className="p-3">Slug</th><th>Default Lang</th><th>Expires</th><th></th></tr>
          </thead>
          <tbody>
            {items.map(l=>(
              <tr key={l.id} className="border-b last:border-0">
                <td className="p-3 font-mono">{l.slug}</td>
                <td>{l.default_guest_language || "-"}</td>
                <td>{l.expires_at ? new Date(l.expires_at).toLocaleString() : "Never"}</td>
                <td className="text-right pr-3">
                  <button className="btn-secondary mr-2" onClick={()=>navigator.clipboard.writeText(`${location.origin}/qr/${l.slug}`)}>Copy URL</button>
                  <button className="btn-danger" onClick={()=>remove(l.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length===0 && <tr><td className="p-3 text-slate-500" colSpan={4}>No QR links yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
