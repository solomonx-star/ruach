import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { Resource } from "@/models/Resource";

export const metadata: Metadata = { title: "Resources" };

interface ResourceItem {
  _id: string;
  title: string;
  note?: string;
  type: string;
  fileUrl: string;
  fileSize?: string;
}

export default async function ResourcesPage() {
  let resources: ResourceItem[] = [];
  try {
    await connectDB();
    const raw = await Resource.find({ published: true }).sort({ createdAt: -1 }).lean();
    resources = JSON.parse(JSON.stringify(raw));
  } catch {
    // DB unavailable — show empty state
  }

  return (
    <div className="max-w-[1200px] mx-auto px-7 py-16 pb-6">
      <div className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[.2em] uppercase text-[#8A7A55] mb-4">Resource Centre</div>
      <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[46px] text-[#0A3D62] mb-4">Download and use freely</h1>
      <p className="text-[17.5px] leading-[1.75] text-[#4A5561] max-w-[680px] mb-10">
        Bible studies, sermon notes, flyers and ministry forms. No sign-in required — take what you need for your small group.
      </p>

      {resources.length === 0 ? (
        <p className="text-[#6B7683] text-[16px]">No resources available yet. Check back soon.</p>
      ) : (
        <div className="bg-white border border-[#EFE7D8] rounded-lg overflow-hidden">
          <div className="grid grid-cols-[1fr_160px_130px_150px] gap-6 px-7 py-4 bg-[#F4EFE4] font-[family-name:var(--font-montserrat)] text-[11px] tracking-[.14em] uppercase text-[#8A7A55]">
            <div>Resource</div>
            <div>Type</div>
            <div>Size</div>
            <div />
          </div>
          {resources.map((r) => (
            <div key={r._id} className="grid grid-cols-[1fr_160px_130px_150px] gap-6 px-7 py-5 border-t border-[#F1EADC] items-center">
              <div>
                <div className="font-[family-name:var(--font-montserrat)] font-semibold text-[16px] text-[#0A3D62]">{r.title}</div>
                {r.note && <div className="text-[14px] text-[#8A7A55] mt-1">{r.note}</div>}
              </div>
              <div className="text-[14.5px] text-[#5A6572]">{r.type}</div>
              <div className="text-[14.5px] text-[#9AA5AF]">{r.fileSize ?? "—"}</div>
              <a
                href={r.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-montserrat)] font-semibold text-[13px] px-4 py-2.5 rounded-md border-[1.5px] border-[#D4AF37] text-[#0A3D62] hover:bg-[#D4AF37] transition-colors inline-block text-center"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
