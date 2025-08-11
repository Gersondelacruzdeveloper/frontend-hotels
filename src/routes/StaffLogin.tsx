import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../features/auth/authSlice";
import { RootState } from "../app/store";

export default function StaffLogin() {
  const dispatch = useDispatch();
  const loading = useSelector((s: RootState) => s.auth.loading);
  const [username, setU] = useState(""); const [password, setP] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await (dispatch as any)(loginThunk({ username, password }));
    if (res.meta.requestStatus === "fulfilled") {
      // If you know the hotel UUID, redirect directly; else route to a picker page first
      window.location.href = "/hotels"; // you can set /hotels/<hotelId>
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Hotel Staff Login</h1>
        <input className="border p-2 w-full" placeholder="Username" value={username} onChange={e=>setU(e.target.value)} />
        <input className="border p-2 w-full" type="password" placeholder="Password" value={password} onChange={e=>setP(e.target.value)} />
        <button disabled={loading} className="bg-black text-white px-4 py-2 w-full">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
