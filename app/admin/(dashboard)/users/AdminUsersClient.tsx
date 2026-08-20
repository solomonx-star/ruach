"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const roles = ["admin", "editor", "volunteer-coordinator", "content-manager", "visitor"];
const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  editor: "bg-blue-100 text-blue-700",
  "volunteer-coordinator": "bg-purple-100 text-purple-700",
  "content-manager": "bg-orange-100 text-orange-700",
  visitor: "bg-gray-100 text-gray-600",
};

const emptyForm = { name: "", email: "", password: "", role: "visitor" };

export default function AdminUsersClient() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(`User ${form.email} created successfully.`);
      setForm(emptyForm);
      setShowForm(false);
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to create user.");
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[28px] text-[#0A3D62]">Users</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-4 py-2.5 rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors">
          <Plus size={16} /> Add user
        </button>
      </div>

      {success && <div role="alert" className="bg-green-50 border border-green-200 text-green-700 text-[14px] px-4 py-3 rounded-md mb-5">{success}</div>}
      {error && <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-[14px] px-4 py-3 rounded-md mb-5">{error}</div>}

      {showForm && (
        <div className="bg-white border border-[#EFE7D8] rounded-lg p-6 mb-6 max-w-[480px]">
          <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[18px] text-[#0A3D62] mb-4">Create new user</h2>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {[
              { label: "Full name", key: "name", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: "Password", key: "password", type: "password" },
            ].map((f) => (
              <div key={f.key}>
                <label htmlFor={`user-${f.key}`} className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">{f.label}</label>
                <input
                  id={`user-${f.key}`}
                  type={f.type}
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full font-[family-name:var(--font-open-sans)] text-[14px] px-3 py-2.5 rounded-md border border-[#E6DFD1] bg-[#FBF8F1] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            ))}
            <div>
              <label htmlFor="user-role" className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">Role</label>
              <select id="user-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="font-[family-name:var(--font-open-sans)] text-[14px] px-3 py-2.5 rounded-md border border-[#E6DFD1] bg-[#FBF8F1] focus:outline-none focus:border-[#D4AF37]">
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex gap-3 mt-1">
              <button type="submit" disabled={loading} className="font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-5 py-2.5 rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors disabled:opacity-60">{loading ? "Creating…" : "Create user"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="font-[family-name:var(--font-montserrat)] text-[13.5px] px-5 py-2.5 rounded-md border border-[#E6DFD1] text-[#5A6572] hover:border-[#0A3D62] transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-[#EFE7D8] rounded-lg p-6">
        <div className="text-[14px] text-[#8A7A55] mb-4">User role reference:</div>
        <div className="grid gap-3">
          {roles.map((r) => (
            <div key={r} className="flex items-center gap-4">
              <span className={`text-[11px] font-[family-name:var(--font-montserrat)] font-semibold px-3 py-1 rounded-full ${roleColors[r]}`}>{r}</span>
              <span className="text-[13.5px] text-[#5A6572]">
                {r === "admin" ? "Full access to all dashboard sections" :
                 r === "editor" ? "Manage blog and resources" :
                 r === "volunteer-coordinator" ? "Manage volunteers and prayer requests" :
                 r === "content-manager" ? "Manage events and gallery" :
                 "Read-only or public access"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
