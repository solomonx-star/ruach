"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload } from "lucide-react";

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  published: boolean;
  registrationRequired: boolean;
  registrationUrl?: string;
  imageUrl?: string;
  flyerUrl?: string;
}

const emptyForm = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  address: "",
  category: "General",
  registrationRequired: false,
  registrationUrl: "",
  published: false,
  imageUrl: "",
  flyerUrl: "",
};

export default function AdminEventsClient() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [flyerUploading, setFlyerUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const flyerRef = useRef<HTMLInputElement>(null);

  async function load() {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
    }
  }

  useEffect(() => { load(); }, []);

  async function uploadFile(file: File, folder: string): Promise<{ url: string } | null> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) return null;
    return res.json();
  }

  async function handleImageFile(file: File) {
    setImageUploading(true);
    setImagePreview(URL.createObjectURL(file));
    const result = await uploadFile(file, "ruach/events");
    if (result) setForm((f) => ({ ...f, imageUrl: result.url }));
    setImageUploading(false);
  }

  async function handleFlyerFile(file: File) {
    setFlyerUploading(true);
    const result = await uploadFile(file, "ruach/events/flyers");
    if (result) setForm((f) => ({ ...f, flyerUrl: result.url }));
    setFlyerUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (editId) {
      await fetch(`/api/events/${editId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setLoading(false);
    closeForm();
    load();
  }

  async function togglePublish(id: string, published: boolean) {
    await fetch(`/api/events/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !published }) });
    load();
  }

  async function deleteEvent(id: string) {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    load();
  }

  function openNew() {
    setForm(emptyForm);
    setEditId(null);
    setImagePreview(null);
    setShowForm(true);
  }

  function startEdit(e: Event) {
    setForm({ title: e.title, description: "", date: e.date.slice(0, 10), time: "", location: e.location, address: "", category: e.category, registrationRequired: e.registrationRequired ?? false, registrationUrl: e.registrationUrl ?? "", published: e.published, imageUrl: e.imageUrl ?? "", flyerUrl: e.flyerUrl ?? "" });
    setImagePreview(e.imageUrl ?? null);
    setEditId(e._id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setForm(emptyForm);
    setEditId(null);
    setImagePreview(null);
  }

  const textFields = [
    { label: "Title", key: "title", col: 2 },
    { label: "Description", key: "description", col: 2 },
    { label: "Date", key: "date", type: "date", col: 1 },
    { label: "Time", key: "time", col: 1 },
    { label: "Location", key: "location", col: 1 },
    { label: "Category", key: "category", col: 1 },
    { label: "Address", key: "address", col: 2 },
  ] as const;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[28px] text-[#0A3D62]">Events</h1>
        <button onClick={openNew} className="flex items-center gap-2 font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-4 py-2.5 rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors">
          <Plus size={16} /> New event
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-[#EFE7D8] rounded-lg p-6 mb-6">
          <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[18px] text-[#0A3D62] mb-4">{editId ? "Edit event" : "New event"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {textFields.map((f) => (
              <div key={f.key} className={`col-span-${f.col}`}>
                <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">{f.label}</label>
                <input
                  type={"type" in f ? f.type : "text"}
                  value={form[f.key as keyof typeof form] as string}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full font-[family-name:var(--font-open-sans)] text-[14px] px-3 py-2.5 rounded-md border border-[#E6DFD1] bg-[#FBF8F1] text-[#2C3641] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            ))}

            {/* Cover image */}
            <div className="col-span-2">
              <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">Cover image</label>
              <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
              {imagePreview || form.imageUrl ? (
                <div className="relative">
                  <img src={imagePreview ?? form.imageUrl} alt="Cover" className="w-full h-[160px] object-cover rounded-md" />
                  <button type="button" onClick={() => imageRef.current?.click()} className="absolute bottom-2 right-2 flex items-center gap-1.5 text-[12px] font-[family-name:var(--font-montserrat)] font-semibold px-3 py-1.5 rounded bg-white/90 text-[#0A3D62] shadow">
                    <Upload size={12} /> Replace
                  </button>
                  {imageUploading && <div className="absolute inset-0 bg-white/70 rounded-md grid place-items-center text-[13px] text-[#8A7A55]">Uploading…</div>}
                </div>
              ) : (
                <button type="button" onClick={() => imageRef.current?.click()} className="w-full h-[100px] border-2 border-dashed border-[#E6DFD1] rounded-md bg-[#FBF8F1] flex items-center justify-center gap-2 text-[14px] text-[#9AA5AF] hover:border-[#D4AF37] transition-colors">
                  <Upload size={16} /> {imageUploading ? "Uploading…" : "Upload cover image"}
                </button>
              )}
            </div>

            {/* Flyer upload */}
            <div className="col-span-2">
              <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">Flyer / poster (PDF or image)</label>
              <input ref={flyerRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFlyerFile(f); }} />
              {form.flyerUrl ? (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-md border border-[#E6DFD1] bg-[#FBF8F1]">
                  <span className="text-[13px] text-[#5A6572] flex-1 truncate">{form.flyerUrl}</span>
                  <button type="button" onClick={() => flyerRef.current?.click()} className="shrink-0 text-[12px] font-[family-name:var(--font-montserrat)] text-[#8A7A55] hover:text-[#0A3D62]">Replace</button>
                </div>
              ) : (
                <button type="button" onClick={() => flyerRef.current?.click()} className="w-full h-[54px] border-2 border-dashed border-[#E6DFD1] rounded-md bg-[#FBF8F1] flex items-center justify-center gap-2 text-[14px] text-[#9AA5AF] hover:border-[#D4AF37] transition-colors">
                  <Upload size={16} /> {flyerUploading ? "Uploading…" : "Upload flyer"}
                </button>
              )}
            </div>

            <div className="col-span-2">
              <label className="block font-[family-name:var(--font-montserrat)] text-[12px] font-semibold text-[#0A3D62] mb-1">Registration URL <span className="text-[#9AA5AF] font-normal">(optional — shown as "Register" button when set)</span></label>
              <input
                type="url"
                placeholder="https://…"
                value={form.registrationUrl}
                onChange={(e) => setForm({ ...form, registrationUrl: e.target.value })}
                className="w-full font-[family-name:var(--font-open-sans)] text-[14px] px-3 py-2.5 rounded-md border border-[#E6DFD1] bg-[#FBF8F1] text-[#2C3641] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="col-span-2 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="reg" checked={form.registrationRequired} onChange={(e) => setForm({ ...form, registrationRequired: e.target.checked })} />
                <label htmlFor="reg" className="text-[14px] text-[#5A6572] font-[family-name:var(--font-montserrat)]">Registration required</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="pub" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                <label htmlFor="pub" className="text-[14px] text-[#5A6572] font-[family-name:var(--font-montserrat)]">Publish immediately</label>
              </div>
            </div>

            <div className="col-span-2 flex gap-3">
              <button type="submit" disabled={loading || imageUploading || flyerUploading} className="font-[family-name:var(--font-montserrat)] font-semibold text-[13.5px] px-5 py-2.5 rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors disabled:opacity-60">
                {loading ? "Saving…" : "Save event"}
              </button>
              <button type="button" onClick={closeForm} className="font-[family-name:var(--font-montserrat)] text-[13.5px] px-5 py-2.5 rounded-md border border-[#E6DFD1] text-[#5A6572] hover:border-[#0A3D62] transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-[#EFE7D8] rounded-lg overflow-hidden">
        <div className="grid grid-cols-[1fr_140px_180px_120px_100px] gap-4 px-6 py-3 bg-[#F4EFE4] font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.12em] uppercase text-[#8A7A55]">
          <div>Title</div><div>Date</div><div>Location</div><div>Category</div><div>Actions</div>
        </div>
        {events.length === 0 && (
          <div className="px-6 py-10 text-center text-[14px] text-[#9AA5AF]">No events yet. Create your first one above.</div>
        )}
        {events.map((e) => (
          <div key={e._id} className="grid grid-cols-[1fr_140px_180px_120px_100px] gap-4 px-6 py-4 border-t border-[#F1EADC] items-center">
            <div className="font-[family-name:var(--font-montserrat)] font-medium text-[14px] text-[#0A3D62]">{e.title}</div>
            <div className="text-[13.5px] text-[#6B7683]">{new Date(e.date).toLocaleDateString()}</div>
            <div className="text-[13.5px] text-[#6B7683] truncate">{e.location}</div>
            <div className="text-[13.5px] text-[#8A7A55]">{e.category}</div>
            <div className="flex gap-2">
              <button aria-label={`${e.published ? "Unpublish" : "Publish"} "${e.title}"`} onClick={() => togglePublish(e._id, e.published)} className="p-1.5 rounded text-[#9AA5AF] hover:text-[#0A3D62] transition-colors">
                {e.published ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
              <button aria-label={`Edit "${e.title}"`} onClick={() => startEdit(e)} className="p-1.5 rounded text-[#9AA5AF] hover:text-[#0A3D62] transition-colors"><Pencil size={15} /></button>
              <button aria-label={`Delete "${e.title}"`} onClick={() => deleteEvent(e._id)} className="p-1.5 rounded text-[#9AA5AF] hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
