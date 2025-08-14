import React, { useMemo, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";
// Simple field-level error bag type returned by DRF
type DRFError = Record<string, string[] | string> & { non_field_errors?: string[] };

export default function AdminSignup() {
  const [organizationName, setOrganizationName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<null | { organization_id: string; user_id: string; email: string }>(null);
  const [errors, setErrors] = useState<DRFError>({});

  const canSubmit = useMemo(() => {
    return (
      organizationName.trim().length > 1 &&
      /.+@.+\..+/.test(email) &&
      password.length >= 8 &&
      password === confirm &&
      !loading
    );
  }, [organizationName, email, password, confirm, loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    if (password !== confirm) {
      setErrors({ password: ["Passwords do not match."], confirm: ["Passwords do not match."] });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/hotels/signup/admin/`, {
        organization_name: organizationName.trim(),
        email: email.trim(),
        password,
        name: name.trim() || undefined,
      }, { withCredentials: false });

      setSuccess(res.data);
      // Optional: persist IDs for a quick onboarding step
      try {
        localStorage.setItem("org_id", res.data.organization_id);
        localStorage.setItem("user_id", res.data.user_id);
        localStorage.setItem("signup_email", res.data.email);
      } catch (_) {}
    } catch (err: any) {
      // Map DRF error structure to our field errors
      const data: DRFError | undefined = err?.response?.data;
      if (data) setErrors(data);
      else setErrors({ non_field_errors: ["Signup failed. Please try again."] });
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow p-6 space-y-4">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold">Account created 🎉</h1>
            <p className="text-gray-600">{success.email}</p>
          </div>
          <p className="text-gray-700">
            Your organisation is set up. Next, create your first hotel and departments
            to start receiving guest requests.
          </p>
          <div className="flex gap-2">
            <a href="/hotels/new" className="flex-1 inline-flex items-center justify-center h-11 rounded-xl bg-black text-white hover:opacity-90">
              Create first hotel
            </a>
            <a href="/dashboard" className="flex-1 inline-flex items-center justify-center h-11 rounded-xl border">
              Go to dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Create your admin account</h1>
          <p className="text-gray-600">Sign up to manage hotels and staff.</p>
        </div>

        {/* Organisation name */}
        <Field label="Organisation name" error={errors["organization_name"]}>
          <input
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="e.g. Oceanic Hospitality"
            className="input"
            autoFocus
          />
        </Field>

        {/* Full name (optional) */}
        <Field label="Your name" optional error={errors["name"]}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ana Pérez"
            className="input"
          />
        </Field>

        {/* Email */}
        <Field label="Email" error={errors["email"]}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@hotel.com"
            className="input"
          />
        </Field>

        {/* Password */}
        <Field label="Password" hint="Minimum 8 characters" error={errors["password"]}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input"
          />
        </Field>

        {/* Confirm */}
        <Field label="Confirm password" error={errors["confirm"]}>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            className="input"
          />
        </Field>

        {/* Non-field errors */}
        {errors?.non_field_errors && (
          <div className="mt-2 text-sm text-red-600">
            {Array.isArray(errors.non_field_errors)
              ? errors.non_field_errors.join(" ")
              : String(errors.non_field_errors)}
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-6 w-full h-11 rounded-xl bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? "Creating…" : "Create account"}
        </button>

        <style>{`
          .input {
            @apply w-full h-11 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-black/20;
          }
          label.required::after { content: " *"; color: #ef4444; }
        `}</style>
      </form>
    </div>
  );
}

function Field({
  label,
  optional,
  hint,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string[] | string;
  children: React.ReactNode;
}) {
  const errText = Array.isArray(error) ? error.join(" ") : error ? String(error) : "";
  return (
    <div className="space-y-1.5 mb-4">
      <label className={`block text-sm font-medium ${optional ? "" : "required"}`}>{label}{optional && <span className="text-gray-400"> (optional)</span>}</label>
      {children}
      {hint && !errText && <p className="text-xs text-gray-500">{hint}</p>}
      {!!errText && <p className="text-xs text-red-600">{errText}</p>}
    </div>
  );
}
