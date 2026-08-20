"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-[#072A44] flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 border-[1.5px] border-[#D4AF37] rounded-full grid place-items-center text-[#D4AF37] font-[family-name:var(--font-montserrat)] font-bold text-[16px]">R</div>
          <div className="font-[family-name:var(--font-montserrat)] font-bold text-[18px] text-white">RUACH GLOBAL</div>
        </div>

        <div className="bg-white rounded-lg px-8 py-9">
          <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[24px] text-[#0A3D62] mb-2">Admin login</h1>
          <p className="text-[14.5px] text-[#6B7683] mb-7">Enter your credentials to access the dashboard.</p>

          {error && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-[14px] px-4 py-3 rounded-md mb-5">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label htmlFor="login-email" className="block font-[family-name:var(--font-montserrat)] text-[12.5px] font-semibold text-[#0A3D62] mb-[7px]">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full font-[family-name:var(--font-open-sans)] text-[15px] px-[14px] py-[13px] rounded-md border border-[#E6DFD1] bg-[#FBF8F1] text-[#2C3641] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block font-[family-name:var(--font-montserrat)] text-[12.5px] font-semibold text-[#0A3D62] mb-[7px]">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full font-[family-name:var(--font-open-sans)] text-[15px] px-[14px] py-[13px] rounded-md border border-[#E6DFD1] bg-[#FBF8F1] text-[#2C3641] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="font-[family-name:var(--font-montserrat)] font-semibold text-[14.5px] py-[14px] rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors mt-1 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
