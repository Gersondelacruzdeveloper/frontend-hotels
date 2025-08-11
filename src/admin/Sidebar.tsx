// src/admin/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { Workflow, Users, MessageSquare, QrCode, Settings } from "lucide-react";

const Item = ({ to, icon: Icon, label }:{to:string;icon:any;label:string}) => (
  <NavLink
    to={to}
    end
    className={({isActive})=>
      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm
       ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"}`
    }
  >
    <Icon size={18} />
    {label}
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="border-r bg-white p-3 space-y-2">
      <div className="px-2 py-1 text-[11px] uppercase tracking-wide text-slate-500">Manage</div>
      <Item to="/admin" icon={Workflow} label="Overview" />
      <Item to="/admin/departments" icon={Workflow} label="Departments" />
      <Item to="/admin/staff" icon={Users} label="Staff" />
      <Item to="/admin/quick-replies" icon={MessageSquare} label="Quick replies" />
      <Item to="/admin/qr-links" icon={QrCode} label="QR links" />
      <Item to="/admin/settings" icon={Settings} label="Settings" />
      <div className="px-2 pt-4 text-[10px] text-slate-400">Powered by MassLingo</div>
    </aside>
  );
}
