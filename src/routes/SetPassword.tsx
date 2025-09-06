// src/routes/SetPassword.tsx
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AdminApi } from "../admin/adminApi";

export default function SetPassword() {
  const { uid = "", token = "" } = useParams();
  const [sp] = useSearchParams();
  const email = sp.get("email") || "";
  const navigate = useNavigate();

  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function submit() {
    setError(null);
    if (pw1.length < 8) return setError("Password must be at least 8 characters.");
    if (pw1 !== pw2) return setError("Passwords do not match.");
    setSaving(true);
    try {
      await AdminApi.AuthApi.setPassword({ uid, token, new_password: pw1 });
      setOk(true);
      setTimeout(() => navigate("/hotels/login"), 1500);
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ||
        (typeof e?.response?.data === "string" ? e.response.data : "Failed to set password.");
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50">
      <div className="w-[min(520px,95vw)] bg-white border rounded-2xl p-6 space-y-4">
        <h1 className="text-xl font-semibold">Set your password</h1>
        {email && <p className="text-sm text-slate-600">for <b>{email}</b></p>}
        <div className="grid gap-3">
          <input
            className="input"
            type="password"
            placeholder="New password"
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Confirm new password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        {ok && <div className="text-sm text-green-600">Password set! Redirecting…</div>}
        <div className="flex justify-end">
          <button className="btn-primary" onClick={submit} disabled={saving}>
            {saving ? "Saving…" : "Set password"}
          </button>
        </div>
      </div>
    </div>
  );
}
