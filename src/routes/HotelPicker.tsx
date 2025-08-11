import { useEffect, useState } from "react";
import api from "../lib/api";
import { Link, useNavigate } from "react-router-dom";

type Item = { id:string; name:string; slug:string; organization:string; brand_color:string };

export default function HotelPicker(){
  const [items,setItems]=useState<Item[]|null>(null);
  const nav = useNavigate();

  useEffect(()=>{
    api.get("/hotels/my-hotels/").then(r=>{
      const list = r.data as Item[];
      if (list.length === 1) {
        nav(`/hotels/${list[0].id}`, { replace:true });
      } else {
        setItems(list);
      }
    }).catch(()=> setItems([]));
  },[nav]);

  if (items === null) return <div className="p-6">Loading your hotels…</div>;
  if (items.length === 0) return <div className="p-6">No hotels found for your account.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-semibold mb-4">Pick a hotel</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(h=>(
          <Link key={h.id} to={`/hotels/${h.id}`} className="block rounded-2xl bg-white p-5 shadow hover:shadow-md border">
            <div className="text-sm text-gray-500">{h.organization}</div>
            <div className="text-lg font-medium">{h.name}</div>
            <div className="mt-2 h-2 rounded" style={{background:h.brand_color}} />
          </Link>
        ))}
      </div>
    </div>
  );
}
