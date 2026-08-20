"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, X } from "lucide-react";

interface Resource {
  _id: string;
  title: string;
  note?: string;
  type: string;
  fileUrl: string;
  publicId: string;
  fileSize?: string;
  category: string;
  published: boolean;
  downloads: number;
}

const emptyForm = {
  title: "",
  note: "",
  type: "PDF",
  category: "General",
  published: false,
  fileUrl: "",
  publicId: "",
  fileSize: "",
};

const TYPES = ["PDF", "Word Document", "PowerPoint", "Other"];
const CATEGORIES = ["General", "Bible Study", "Sermon Notes", "Flyers", "Forms", "Youth", "Outreach"];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminResourcesClient() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch("/api/resources?all=true");
    const data = await res.json();
    setResources(Array.isArray(data) ? data : []);
  }

  useEffect(() => { load(); }, []);

  async function handleFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "ruach/resources");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) {
      const ext = file.name.split(".").pop()?.toUpperCase() ?? "FILE";
      const detectedType = ext === "PDF" ? "PDF" : ext === "DOCX" || ext === "DOC" ? "Word Document" : ext === "PPTX" || ext === "PPT" ? "PowerPoint" : "Other";
      setForm((f) => ({
        ...f,
        fileUrl: data.url,
        publicId: data.publicId,
        fileSize: formatBytes(data.bytes),
        type: TYPES.includes(detectedType) ? detectedType : f.type,
      }));
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fileUrl) return;
    setSaving(true);
    if (editId) {
      await fetch(`/api/resources/${editId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/resources", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setSaving(false);
    closeForm();
    load();
  }

  async function togglePublish(id: string, published: boolean) {
    await fetch(`/api/resources/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !published }) });
    load();
  }

  async function deleteResource(id: string) {
    if (!confirm("Delete this resource?")) return;
    await fetch(`/api/resources/${id}`, { method: "DELETE" });
    load();
  }

  function openNew() {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(r: Resource) {
    setForm({ title: r.title, note: r.note ?? "", type: r.type, category: r.category, published: r.published, fileUrl: r.fileUrl, publicId: r.publicId, fileSize: r.fileSize ?? "" });
    setEditId(r._id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setForm(emptyForm);
    setEditId(null);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[28px] text-[#0A3D62]">Resources</h1>
        <button onClick={openNew} className="flex items-center gap-2 font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-4 py-2.5 rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors">
          <Plus size={16} /> Add resource
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-[#EFE7D8] rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[18px] text-[#0A3D62]">{editId ? "Edit resource" : "New resource"}</h2>
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
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              {uploading ? (
                <p className="text-[14px] text-[#8A7A55]">Uploading to Cloudinary…</p>
              ) : form.fileUrl ? (
                <div className="text-[14px] text-[#5A6572]">
                  <div className="text-[#D4AF37] font-semibold mb-1 font-[family-name:var(--font-montserrat)]">File uploaded {form.fileSize && `(${form.fileSize})`}</div>
                  <div className="truncate text-[12px] text-[#9AA5AF]">{form.fileUrl}</div>
                  <p className="mt-2 text-[12px] text-[#9AA5AF]">Click to replace</p>
                </div>
              ) : (
                <div className="text-[#9AA5AF]">
                  <Upload size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-[14px]">Drop a file here, or click to browse</p>
                  <p className="text-[12px] mt-1">PDF, Word, PowerPoint — max 50 MB</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">Title</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full font-[family-name:var(--font-open-sans)] text-[14px] px-3 py-2.5 rounded-md border border-[#E6DFD1] bg-[#FBF8F1] focus:outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">Note</label>
                <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="e.g. Week 3 study guide" className="w-full font-[family-name:var(--font-open-sans)] text-[14px] px-3 py-2.5 rounded-md border border-[#E6DFD1] bg-[#FBF8F1] focus:outline-none focus:border-[#D4AF37]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full font-[family-name:var(--font-open-sans)] text-[14px] px-3 py-2.5 rounded-md border border-[#E6DFD1] bg-[#FBF8F1] focus:outline-none focus:border-[#D4AF37]">
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full font-[family-name:var(--font-open-sans)] text-[14px] px-3 py-2.5 rounded-md border border-[#E6DFD1] bg-[#FBF8F1] focus:outline-none focus:border-[#D4AF37]">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="pub" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              <label htmlFor="pub" className="text-[14px] text-[#5A6572] font-[family-name:var(--font-montserrat)]">Publish immediately</label>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving || uploading || !form.fileUrl} className="font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-5 py-2.5 rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors disabled:opacity-50">
                {saving ? "Saving…" : editId ? "Save changes" : "Add resource"}
              </button>
              <button type="button" onClick={closeForm} className="font-[family-name:var(--font-montserrat)] text-[13.5px] px-5 py-2.5 rounded-md border border-[#E6DFD1] text-[#5A6572] hover:border-[#0A3D62] transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-[#EFE7D8] rounded-lg overflow-hidden">
        <div className="grid grid-cols-[1fr_140px_120px_80px_100px] gap-4 px-6 py-3 bg-[#F4EFE4] font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.12em] uppercase text-[#8A7A55]">
          <div>Title</div><div>Type</div><div>Size</div><div>Status</div><div>Actions</div>
        </div>
        {resources.length === 0 && <div className="px-6 py-10 text-center text-[14px] text-[#9AA5AF]">No resources yet.</div>}
        {resources.map((r) => (
          <div key={r._id} className="grid grid-cols-[1fr_140px_120px_80px_100px] gap-4 px-6 py-4 border-t border-[#F1EADC] items-center">
            <div>
              <div className="font-[family-name:var(--font-montserrat)] font-medium text-[14px] text-[#0A3D62] truncate">{r.title}</div>
              {r.note && <div className="text-[12px] text-[#8A7A55] truncate">{r.note}</div>}
            </div>
            <div className="text-[13.5px] text-[#5A6572]">{r.type}</div>
            <div className="text-[13.5px] text-[#9AA5AF]">{r.fileSize ?? "—"}</div>
            <div><span className={`text-[11px] font-[family-name:var(--font-montserrat)] font-semibold px-2 py-0.5 rounded-full ${r.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{r.published ? "Live" : "Draft"}</span></div>
            <div className="flex gap-2">
              <button aria-label={`${r.published ? "Unpublish" : "Publish"} "${r.title}"`} onClick={() => togglePublish(r._id, r.published)} className="p-1.5 rounded text-[#9AA5AF] hover:text-[#0A3D62] transition-colors">{r.published ? <Eye size={15} /> : <EyeOff size={15} />}</button>
              <button aria-label={`Edit "${r.title}"`} onClick={() => openEdit(r)} className="p-1.5 rounded text-[#9AA5AF] hover:text-[#0A3D62] transition-colors"><Pencil size={15} /></button>
              <button aria-label={`Delete "${r.title}"`} onClick={() => deleteResource(r._id)} className="p-1.5 rounded text-[#9AA5AF] hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
