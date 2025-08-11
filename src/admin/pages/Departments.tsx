// src/admin/pages/Departments.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { AdminApi } from "../adminApi";

export default function Departments() {
  const hotel = useSelector((s: RootState) => s.conversations.currentHotel);
  const hotelId = hotel?.id as string;
  const [items,setItems]=useState<any[]>([]);
  const [name,setName]=useState(""); const [slug,setSlug]=useState("");

  async function load(){ if(!hotelId) return;
    const {data}=await AdminApi.departments.list(hotelId); setItems(data);
  }
  useEffect(()=>{load();},[hotelId]);

  async function add(){
    await AdminApi.departments.create(hotelId,{name,slug});
    setName(""); setSlug(""); load();
  }
  async function remove(id:string){
    await AdminApi.departments.remove(hotelId,id); load();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Departments</h1>

      <div className="bg-white border rounded-xl p-4 space-y-3">
        <div className="grid sm:grid-cols-3 gap-3">
          <input className="input" placeholder="Name (Reception)" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" placeholder="Slug (reception)" value={slug} onChange={e=>setSlug(e.target.value)} />
          <button onClick={add} className="btn-primary">Add</button>
        </div>
      </div>

      <div className="bg-white border rounded-xl">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b">
            <tr><th className="p-3">Name</th><th>Slug</th><th></th></tr>
          </thead>
          <tbody>
            {items.map(d=>(
              <tr key={d.id} className="border-b last:border-0">
                <td className="p-3">{d.name}</td>
                <td>{d.slug}</td>
                <td className="text-right pr-3">
                  <button onClick={()=>remove(d.id)} className="btn-danger">Delete</button>
                </td>
              </tr>
            ))}
            {items.length===0 && <tr><td className="p-3 text-slate-500" colSpan={3}>No departments yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
