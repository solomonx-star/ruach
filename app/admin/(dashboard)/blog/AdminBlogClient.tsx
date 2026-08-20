"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload } from "lucide-react";

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  published: boolean;
  createdAt: string;
  imageUrl?: string;
}

const emptyForm = { title: "", excerpt: "", content: "", category: "Announcements", author: "", published: false, imageUrl: "" };

export default function AdminBlogClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setPosts([]);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleImageFile(file: File) {
    setImageUploading(true);
    setImagePreview(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "ruach/blog");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) setForm((f) => ({ ...f, imageUrl: data.url }));
    setImageUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (editId) {
      await fetch(`/api/blog/${editId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setLoading(false);
    setShowForm(false);
    setForm(emptyForm);
    setEditId(null);
    setImagePreview(null);
    load();
  }

  async function togglePublish(id: string, published: boolean) {
    await fetch(`/api/blog/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !published }) });
    load();
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    load();
  }

  function openEdit(p: Post) {
    setForm({ title: p.title, excerpt: p.excerpt ?? "", content: p.content ?? "", category: p.category, author: p.author, published: p.published, imageUrl: p.imageUrl ?? "" });
    setImagePreview(p.imageUrl ?? null);
    setEditId(p._id);
    setShowForm(true);
  }

  const categories = ["Announcements", "Mission Updates", "Prayer Requests", "Teaching", "Youth"];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[28px] text-[#0A3D62]">Blog</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); setImagePreview(null); }} className="flex items-center gap-2 font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-4 py-2.5 rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors">
          <Plus size={16} /> New post
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-[#EFE7D8] rounded-lg p-6 mb-6">
          <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[18px] text-[#0A3D62] mb-4">{editId ? "Edit post" : "New post"}</h2>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full font-[family-name:var(--font-open-sans)] text-[14px] px-3 py-2.5 rounded-md border border-[#E6DFD1] bg-[#FBF8F1] focus:outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">Author</label>
                <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full font-[family-name:var(--font-open-sans)] text-[14px] px-3 py-2.5 rounded-md border border-[#E6DFD1] bg-[#FBF8F1] focus:outline-none focus:border-[#D4AF37]" />
              </div>
            </div>
            <div>
              <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="font-[family-name:var(--font-open-sans)] text-[14px] px-3 py-2.5 rounded-md border border-[#E6DFD1] bg-[#FBF8F1] focus:outline-none focus:border-[#D4AF37]">
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">Cover image</label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
              {imagePreview || form.imageUrl ? (
                <div className="relative">
                  <img src={imagePreview ?? form.imageUrl} alt="Cover preview" className="w-full h-[160px] object-cover rounded-md" />
                  <button type="button" onClick={() => fileRef.current?.click()} className="absolute bottom-2 right-2 flex items-center gap-1.5 text-[12px] font-[family-name:var(--font-montserrat)] font-semibold px-3 py-1.5 rounded bg-white/90 text-[#0A3D62] shadow">
                    <Upload size={12} /> Replace
                  </button>
                  {imageUploading && <div className="absolute inset-0 bg-white/70 rounded-md grid place-items-center text-[13px] text-[#8A7A55]">Uploading…</div>}
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()} className="w-full h-[100px] border-2 border-dashed border-[#E6DFD1] rounded-md bg-[#FBF8F1] flex items-center justify-center gap-2 text-[14px] text-[#9AA5AF] hover:border-[#D4AF37] transition-colors">
                  <Upload size={16} />
                  {imageUploading ? "Uploading…" : "Upload cover image"}
                </button>
              )}
            </div>
            <div>
              <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">Excerpt</label>
              <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full font-[family-name:var(--font-open-sans)] text-[14px] px-3 py-2.5 rounded-md border border-[#E6DFD1] bg-[#FBF8F1] focus:outline-none focus:border-[#D4AF37] resize-none" />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">Content</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} className="w-full font-[family-name:var(--font-open-sans)] text-[14px] px-3 py-2.5 rounded-md border border-[#E6DFD1] bg-[#FBF8F1] focus:outline-none focus:border-[#D4AF37] resize-y" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="pub" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              <label htmlFor="pub" className="text-[14px] text-[#5A6572] font-[family-name:var(--font-montserrat)]">Publish immediately</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading || imageUploading} className="font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-5 py-2.5 rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors disabled:opacity-60">{loading ? "Saving…" : "Save post"}</button>
              <button type="button" onClick={() => { setShowForm(false); setImagePreview(null); }} className="font-[family-name:var(--font-montserrat)] text-[13.5px] px-5 py-2.5 rounded-md border border-[#E6DFD1] text-[#5A6572] hover:border-[#0A3D62] transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-[#EFE7D8] rounded-lg overflow-hidden">
        <div className="grid grid-cols-[1fr_160px_140px_80px_100px] gap-4 px-6 py-3 bg-[#F4EFE4] font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.12em] uppercase text-[#8A7A55]">
          <div>Title</div><div>Category</div><div>Author</div><div>Status</div><div>Actions</div>
        </div>
        {posts.length === 0 && <div className="px-6 py-10 text-center text-[14px] text-[#9AA5AF]">No posts yet.</div>}
        {posts.map((p) => (
          <div key={p._id} className="grid grid-cols-[1fr_160px_140px_80px_100px] gap-4 px-6 py-4 border-t border-[#F1EADC] items-center">
            <div className="font-[family-name:var(--font-montserrat)] font-medium text-[14px] text-[#0A3D62] truncate">{p.title}</div>
            <div className="text-[13.5px] text-[#8A7A55]">{p.category}</div>
            <div className="text-[13.5px] text-[#5A6572]">{p.author}</div>
            <div><span className={`text-[11px] font-[family-name:var(--font-montserrat)] font-semibold px-2 py-0.5 rounded-full ${p.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{p.published ? "Live" : "Draft"}</span></div>
            <div className="flex gap-2">
              <button aria-label={`${p.published ? "Unpublish" : "Publish"} "${p.title}"`} onClick={() => togglePublish(p._id, p.published)} className="p-1.5 rounded text-[#9AA5AF] hover:text-[#0A3D62] transition-colors">{p.published ? <Eye size={15} /> : <EyeOff size={15} />}</button>
              <button aria-label={`Edit "${p.title}"`} onClick={() => openEdit(p)} className="p-1.5 rounded text-[#9AA5AF] hover:text-[#0A3D62] transition-colors"><Pencil size={15} /></button>
              <button aria-label={`Delete "${p.title}"`} onClick={() => deletePost(p._id)} className="p-1.5 rounded text-[#9AA5AF] hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
