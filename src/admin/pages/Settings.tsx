// src/admin/pages/Settings.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { AdminApi } from "../adminApi";

export default function Settings() {
  const hotelId = useSelector((s:RootState)=>s.conversations.currentHotel?.id) as string;
  const [items,setItems]=useState<any[]>([]);
  const [welcome,setWelcome]=useState(""); const [ai,setAi]=useState(false);

  async function load(){
    if(!hotelId) return;
    const {data}=await AdminApi.settings.list(hotelId);
    setItems(data);
    const byKey = Object.fromEntries(data.map((x:any)=>[x.key, x]));
    setWelcome(byKey.welcome_message?.value || "");
    setAi((byKey.ai_auto_reply?.value || "off") === "on");
  }
  useEffect(()=>{load();},[hotelId]);

  async function save(){
    const existingWelcome = items.find((x:any)=>x.key==="welcome_message");
    await AdminApi.settings.upsert(hotelId,"welcome_message", welcome, existingWelcome?.id);
    const existingAI = items.find((x:any)=>x.key==="ai_auto_reply");
    await AdminApi.settings.upsert(hotelId,"ai_auto_reply", ai ? "on" : "off", existingAI?.id);
    load();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Settings</h1>

      <div className="bg-white border rounded-xl p-4 space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Welcome message (shown to guests)</label>
          <textarea className="input h-28" value={welcome} onChange={e=>setWelcome(e.target.value)} />
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={ai} onChange={e=>setAi(e.target.checked)} />
          <span className="text-sm">Enable AI auto-reply fallback</span>
        </label>

        <button className="btn-primary" onClick={save}>Save changes</button>
      </div>
    </div>
  );
}
