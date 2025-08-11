// src/admin/pages/Staff.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { AdminApi } from "../adminApi";

export default function Staff() {
  const hotel = useSelector((s: RootState) => s.conversations.currentHotel);
  const hotelId = hotel?.id as string;
  const [items,setItems]=useState<any[]>([]);
  const [userId,setUserId]=useState(""); // you can swap to username search
  const [role,setRole]=useState("agent");

  async function load(){ if(!hotelId) return;
    const {data}=await AdminApi.staff.list(hotelId); setItems(data);
  }
  useEffect(()=>{load();},[hotelId]);

  async function add(){
    await AdminApi.staff.create(hotelId,{ user: userId, role });
    setUserId(""); load();
  }
  async function remove(id:string){
    await AdminApi.staff.remove(hotelId,id); load();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Staff</h1>

      <div className="bg-white border rounded-xl p-4 grid sm:grid-cols-4 gap-3">
        <input className="input" placeholder="User ID" value={userId} onChange={e=>setUserId(e.target.value)} />
        <select className="input" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="agent">Agent</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        <div />
        <button className="btn-primary" onClick={add}>Add staff</button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b">
            <tr><th className="p-3">User</th><th>Role</th><th>Dept</th><th></th></tr>
          </thead>
          <tbody>
            {items.map(m=>(
              <tr key={m.id} className="border-b last:border-0">
                <td className="p-3">{m.user?.username}</td>
                <td>{m.role}</td>
                <td>{m.department?.name || "-"}</td>
                <td className="text-right pr-3">
                  <button className="btn-danger" onClick={()=>remove(m.id)}>Remove</button>
                </td>
              </tr>
            ))}
            {items.length===0 && <tr><td className="p-3 text-slate-500" colSpan={4}>No staff yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
