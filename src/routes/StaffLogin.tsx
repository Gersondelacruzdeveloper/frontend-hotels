import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../features/auth/authSlice";
import { RootState } from "../app/store";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function StaffLogin() {
  const dispatch = useDispatch();
  const loading = useSelector((s: RootState) => s.auth.loading);
  const err = useSelector((s: RootState) => s.auth.error) as string | undefined; // adjust if different
  const hotel = useSelector((s: RootState) => s.conversations.currentHotel);     // optional
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [show, setShow] = useState(false);
  const [formErr, setFormErr] = useState<string | null>(null);

  useEffect(() => setFormErr(err || null), [err]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setFormErr("Please enter your username and password.");
      return;
    }
    setFormErr(null);
    const res = await (dispatch as any)(loginThunk({ username: username.trim(), password }));
    if (res.meta.requestStatus === "fulfilled") {
      // if you know the hotel id, route straight there; otherwise list picker
      const fallback = "/hotels";
      window.location.href = fallback;
    }
  }

  return (
    <div className="
      min-h-screen grid place-items-center px-4
      bg-[radial-gradient(1000px_600px_at_10%_-10%,_rgba(99,102,241,.08),_transparent_60%),radial-gradient(900px_500px_at_110%_0%,_rgba(16,185,129,.06),_transparent_60%)]
      bg-slate-50
    ">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-6">
            {hotel?.logo ? (
              <img
                src={hotel.logo}
                alt={`${hotel.name} logo`}
                className="h-10 w-10 rounded-md object-cover border border-slate-200"
              />
            ) : (
              <div className="h-10 w-10 rounded-md bg-indigo-600 text-white grid place-items-center font-semibold">
                {(hotel?.name || "MH").slice(0, 1)}
              </div>
            )}
            <div>
              <div className="text-lg font-semibold leading-5">
                {hotel?.name || "MassLingo Hotels"}
              </div>
              <div className="text-xs text-slate-500">Staff Portal</div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {formErr && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {formErr}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="username" className="text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                id="username"
                autoComplete="username"
                className="w-full h-11 rounded-lg border border-slate-300 bg-white px-3 outline-none
                           focus:ring-2 focus:ring-indigo-200"
                placeholder="e.g. reception1"
                value={username}
                onChange={(e) => setU(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full h-11 rounded-lg border border-slate-300 bg-white px-3 pr-10 outline-none
                             focus:ring-2 focus:ring-indigo-200"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setP(e.target.value)}
                />
                <button
                  type="button"
                  aria-label={show ? "Hide password" : "Show password"}
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-slate-600 hover:bg-slate-100"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" className="rounded border-slate-300" />
                Remember me
              </label>
              <a className="text-sm text-indigo-600 hover:underline" href="#">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg
                         bg-indigo-600 text-white font-medium hover:bg-indigo-700
                         disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-slate-500">
          Powered by <span className="font-medium">MassLingo</span>
        </div>
      </div>
    </div>
  );
}
