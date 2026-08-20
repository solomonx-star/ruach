"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Eye, EyeOff, Upload, X } from "lucide-react";

interface GalleryItem {
  _id: string;
  title: string;
  caption?: string;
  url: string;
  publicId: string;
  type: "photo" | "video";
  category: string;
  eventTag?: string;
  order: number;
  published: boolean;
}

const emptyForm = {
  title: "",
  caption: "",
  category: "General",
  eventTag: "",
  type: "photo" as "photo" | "video",
  order: 0,
  published: false,
  url: "",
  publicId: "",
};

const CATEGORIES = ["General", "Worship", "Outreach", "Youth", "Events", "Missions"];

export default function AdminGalleryClient() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch("/api/gallery?all=true");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }

  useEffect(() => { load(); }, []);

  async function handleFile(file: File) {
    if (!file) return;
    setUploading(true);
    setPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "ruach/gallery");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) {
      setForm((f) => ({ ...f, url: data.url, publicId: data.publicId, type: file.type.startsWith("video/") ? "video" : "photo" }));
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.url) return;
    setSaving(true);
    if (editId) {
      await fetch(`/api/gallery/${editId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setSaving(false);
    closeForm();
    load();
  }

  async function togglePublish(id: string, published: boolean) {
    await fetch(`/api/gallery/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !published }) });
    load();
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    load();
  }

  function openNew() {
    setForm(emptyForm);
    setEditId(null);
    setPreview(null);
    setShowForm(true);
  }

  function openEdit(item: GalleryItem) {
    setForm({ title: item.title, caption: item.caption ?? "", category: item.category, eventTag: item.eventTag ?? "", type: item.type, order: item.order, published: item.published, url: item.url, publicId: item.publicId });
    setPreview(item.type === "photo" ? item.url : null);
    setEditId(item._id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setForm(emptyForm);
    setEditId(null);
    setPreview(null);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[28px] text-[#0A3D62]">Gallery</h1>
        <button onClick={openNew} className="flex items-center gap-2 font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-4 py-2.5 rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors">
          <Plus size={16} /> Upload
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-[#EFE7D8] rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[18px] text-[#0A3D62]">{editId ? "Edit item" : "Upload new"}</h2>
            <button onClick={closeForm} className="text-[#9AA5AF] hover:text-[#0A3D62]"><X size={18} /></button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* File drop zone */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${dragOver ? "border-[#D4AF37] bg-[#FDF9F0]" : "border-[#E6DFD1] bg-[#FBF8F1]"}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              {uploading ? (
                <p className="text-[14px] text-[#8A7A55]">Uploading to Cloudinary…</p>
              ) : preview ? (
                <img src={preview} alt="preview" className="max-h-[220px] mx-auto rounded-md object-contain" />
              ) : form.url ? (
                <div className="text-[14px] text-[#5A6572]">
                  <div className="text-[#D4AF37] font-semibold mb-1">File uploaded</div>
                  <div className="truncate text-[12px] text-[#9AA5AF]">{form.url}</div>
                  <p className="mt-2 text-[12px]">Click to replace</p>
                </div>
              ) : (
                <div className="text-[#9AA5AF]">
                  <Upload size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-[14px]">Drop an image or video here, or click to browse</p>
                  <p className="text-[12px] mt-1">JPEG, PNG, WebP, GIF, MP4, WebM — max 50 MB</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">Title</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full font-[family-name:var(--font-open-sans)] text-[14px] px-3 py-2.5 rounded-md border border-[#E6DFD1] bg-[#FBF8F1] focus:outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full font-[family-name:var(--font-open-sans)] text-[14px] px-3 py-2.5 rounded-md border border-[#E6DFD1] bg-[#FBF8F1] focus:outline-none focus:border-[#D4AF37]">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">Caption</label>
                <input value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="w-full font-[family-name:var(--font-open-sans)] text-[14px] px-3 py-2.5 rounded-md border border-[#E6DFD1] bg-[#FBF8F1] focus:outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">Event tag</label>
                <input value={form.eventTag} onChange={(e) => setForm({ ...form, eventTag: e.target.value })} placeholder="e.g. Easter 2025" className="w-full font-[family-name:var(--font-open-sans)] text-[14px] px-3 py-2.5 rounded-md border border-[#E6DFD1] bg-[#FBF8F1] focus:outline-none focus:border-[#D4AF37]" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">Display order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-24 font-[family-name:var(--font-open-sans)] text-[14px] px-3 py-2.5 rounded-md border border-[#E6DFD1] bg-[#FBF8F1] focus:outline-none focus:border-[#D4AF37]" />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="pub" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                <label htmlFor="pub" className="text-[14px] text-[#5A6572] font-[family-name:var(--font-montserrat)]">Publish immediately</label>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving || uploading || !form.url} className="font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-5 py-2.5 rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors disabled:opacity-50">
                {saving ? "Saving…" : editId ? "Save changes" : "Add to gallery"}
              </button>
              <button type="button" onClick={closeForm} className="font-[family-name:var(--font-montserrat)] text-[13.5px] px-5 py-2.5 rounded-md border border-[#E6DFD1] text-[#5A6572] hover:border-[#0A3D62] transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Grid */}
      {items.length === 0 ? (
        <div className="bg-white border border-[#EFE7D8] rounded-lg p-12 text-center">
          <div className="w-14 h-14 bg-[#F4EFE4] rounded-full grid place-items-center mx-auto mb-4">
            <span className="text-[24px]">📷</span>
          </div>
          <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[16px] text-[#0A3D62] mb-2">No items yet</div>
          <p className="text-[14px] text-[#6B7683]">Click "Upload" to add your first image or video.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item._id} className="relative group bg-white border border-[#EFE7D8] rounded-lg overflow-hidden">
              <div className="aspect-square bg-[#F4EFE4] overflow-hidden">
                {item.type === "video" ? (
                  <div className="w-full h-full grid place-items-center text-[#8A7A55]">
                    <span className="text-[40px]">▶</span>
                  </div>
                ) : (
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                )}
              </div>
              <div className="px-3 py-2.5">
                <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[13px] text-[#0A3D62] truncate">{item.title}</div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[11px] text-[#8A7A55]">{item.category}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${item.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.published ? "Live" : "Draft"}</span>
                </div>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button aria-label={`${item.published ? "Unpublish" : "Publish"} "${item.title}"`} onClick={() => togglePublish(item._id, item.published)} className="w-7 h-7 bg-white rounded shadow-sm grid place-items-center text-[#9AA5AF] hover:text-[#0A3D62]">
                  {item.published ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                <button aria-label={`Edit "${item.title}"`} onClick={() => openEdit(item)} className="w-7 h-7 bg-white rounded shadow-sm grid place-items-center text-[#9AA5AF] hover:text-[#0A3D62]">
                  <Plus size={13} className="rotate-45" />
                </button>
                <button aria-label={`Delete "${item.title}"`} onClick={() => deleteItem(item._id)} className="w-7 h-7 bg-white rounded shadow-sm grid place-items-center text-[#9AA5AF] hover:text-red-500">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
