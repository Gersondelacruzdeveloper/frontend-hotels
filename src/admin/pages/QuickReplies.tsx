// src/admin/pages/QuickReplies.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { AdminApi } from "../adminApi";

export default function QuickReplies() {
  const hotelId = useSelector((s:RootState)=>s.conversations.currentHotel?.id) as string;
  const [items,setItems]=useState<any[]>([]);
  const [title,setTitle]=useState(""); const [body,setBody]=useState("");

  async function load(){ if(!hotelId) return; setItems((await AdminApi.quickReplies.list(hotelId)).data); }
  useEffect(()=>{load();},[hotelId]);

  async function add(){
    await AdminApi.quickReplies.create(hotelId,{title,body});
    setTitle(""); setBody(""); load();
  }
  async function remove(id:string){ await AdminApi.quickReplies.remove(hotelId,id); load(); }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Quick replies</h1>

      <div className="bg-white border rounded-xl p-4 space-y-3">
        <div className="grid sm:grid-cols-3 gap-3">
          <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea className="input sm:col-span-2" placeholder="Body…" value={body} onChange={e=>setBody(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={add}>Add quick reply</button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b">
            <tr><th className="p-3">Title</th><th>Body</th><th></th></tr>
          </thead>
          <tbody>
            {items.map(q=>(
              <tr key={q.id} className="border-b last:border-0">
                <td className="p-3">{q.title}</td>
                <td className="pr-3">{q.body}</td>
                <td className="text-right pr-3">
                  <button className="btn-danger" onClick={()=>remove(q.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length===0 && <tr><td className="p-3 text-slate-500" colSpan={3}>No quick replies yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
