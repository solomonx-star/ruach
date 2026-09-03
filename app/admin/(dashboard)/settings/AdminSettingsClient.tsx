"use client";

import { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";

interface Settings {
  heroImageUrl?: string;
  heroImagePublicId?: string;
}

export default function AdminSettingsClient() {
  const [settings, setSettings] = useState<Settings>({});
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        if (data.heroImageUrl) setPreview(data.heroImageUrl);
      });
  }, []);

  async function handleFile(file: File) {
    if (!file) return;
    setUploading(true);
    setError(null);
    setSaved(false);
    setPreview(URL.createObjectURL(file));

    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "ruach/hero");

    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Upload failed.");
      setUploading(false);
      return;
    }

    setSettings((s) => ({ ...s, heroImageUrl: data.url, heroImagePublicId: data.publicId }));
    setUploading(false);
  }

  async function handleSave() {
    if (!settings.heroImageUrl) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heroImageUrl: settings.heroImageUrl,
        heroImagePublicId: settings.heroImagePublicId,
      }),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError("Failed to save. Please try again.");
    }
  }

  async function handleRemove() {
    if (!confirm("Remove the hero image? The hero will revert to its default gradient.")) return;
    setSaving(true);
    setError(null);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heroImageUrl: "", heroImagePublicId: "" }),
    });
    setSaving(false);
    if (res.ok) {
      setSettings({});
      setPreview(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  return (
    <div className="p-8 max-w-[760px]">
      <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[28px] text-[#0A3D62] mb-1">Site Settings</h1>
      <p className="text-[14.5px] text-[#5A6572] mb-8">Manage the hero section image shown on the home page.</p>

      <div className="bg-white border border-[#EFE7D8] rounded-lg p-6">
        <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[16px] text-[#0A3D62] mb-1">Hero image</div>
        <p className="text-[13.5px] text-[#6B7683] mb-5">
          Replaces the default gradient background on the home page hero. Recommended: a high-resolution landscape photo (min 1400 × 800 px).
        </p>

        {/* Drop zone */}
        <div
          className={`relative border-2 border-dashed rounded-lg transition-colors cursor-pointer mb-5 ${
            dragOver ? "border-[#D4AF37] bg-[#FDF9F0]" : "border-[#E6DFD1] bg-[#FBF8F1]"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />

          {uploading ? (
            <div className="p-10 text-center">
              <p className="text-[14px] text-[#8A7A55]">Uploading to Cloudinary…</p>
            </div>
          ) : preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Hero preview"
                className="w-full max-h-[320px] object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors rounded-md flex items-center justify-center opacity-0 hover:opacity-100">
                <span className="text-white text-[14px] font-[family-name:var(--font-montserrat)] font-semibold bg-black/50 px-4 py-2 rounded-md">
                  Click to replace
                </span>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center text-[#9AA5AF]">
              <Upload size={36} className="mx-auto mb-3 opacity-50" />
              <p className="text-[14px]">Drop an image here, or click to browse</p>
              <p className="text-[12px] mt-1">JPEG, PNG, WebP, AVIF — max 50 MB</p>
            </div>
          )}
        </div>

        {error && <p className="text-[13.5px] text-red-600 mb-4">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || uploading || !settings.heroImageUrl}
            className="font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-6 py-2.5 rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save image"}
          </button>
          {preview && !uploading && (
            <button
              onClick={handleRemove}
              disabled={saving}
              className="font-[family-name:var(--font-montserrat)] text-[13.5px] px-6 py-2.5 rounded-md border border-[#E6DFD1] text-[#5A6572] hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              Remove image
            </button>
          )}
          {saved && (
            <span className="text-[13.5px] text-green-600 font-[family-name:var(--font-montserrat)]">
              Saved — changes are live.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
