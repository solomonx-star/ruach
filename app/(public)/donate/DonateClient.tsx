"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

const amounts = ["$25", "$50", "$100", "$250"];
const purposes = [
  { label: "General fund", note: "Wherever the need is greatest" },
  { label: "Missions", note: "Field workers & trips" },
  { label: "Community outreach", note: "Food, clinics, schools" },
  { label: "Youth ministry", note: "Camps & mentoring" },
  { label: "Building fund", note: "Auditorium expansion" },
];
const cardMethods = ["Credit card", "Debit card"];
const comingSoon = ["Apple Pay", "Google Pay", "PayPal"];

const CARD_OPTIONS = {
  style: {
    base: {
      fontFamily: "var(--font-open-sans), sans-serif",
      fontSize: "15px",
      color: "#2C3641",
      "::placeholder": { color: "#9AA5AF" },
    },
    invalid: { color: "#dc2626" },
  },
};

function DonateForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [giftType, setGiftType] = useState("One-time");
  const [amount, setAmount] = useState("$100");
  const [customAmount, setCustomAmount] = useState("");
  const [purpose, setPurpose] = useState("General fund");
  const [method, setMethod] = useState("Credit card");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const displayAmount = customAmount || amount;
  const numericAmount = parseFloat(displayAmount.replace(/[^0-9.]/g, "")) || 0;
  const cta = giftType === "Recurring monthly"
    ? `Give ${displayAmount} monthly to ${purpose}`
    : `Give ${displayAmount} to ${purpose}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (numericAmount <= 0) { setError("Please enter a valid amount."); return; }
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setLoading(true);
    setError(null);

    const res = await fetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        amount: numericAmount,
        currency: "usd",
        purpose,
        type: giftType === "Recurring monthly" ? "recurring" : "one-time",
        method: "stripe",
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Payment setup failed. Please try again.");
      setLoading(false);
      return;
    }

    const { clientSecret } = await res.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement, billing_details: { name, email } },
    });

    if (result.error) {
      setError(result.error.message ?? "Payment failed.");
    } else if (result.paymentIntent?.status === "succeeded") {
      setDone(true);
    }

    setLoading(false);
  }

  if (done) {
    return (
      <div className="bg-white border border-[#EFE7D8] rounded-lg px-[38px] py-14 text-center">
        <div className="w-14 h-14 rounded-full bg-[#F4EFE4] border border-[#D4AF37] grid place-items-center mx-auto mb-5 text-[#D4AF37] text-[22px]">✓</div>
        <h2 className="font-[family-name:var(--font-montserrat)] font-semibold text-[22px] text-[#0A3D62] mb-2">Thank you for your gift</h2>
        <p className="text-[#6B7683] text-[15px]">A receipt has been sent to <strong>{email}</strong>.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#EFE7D8] rounded-lg px-[38px] py-9 pb-10">
      {/* Gift type */}
      <div role="group" aria-label="Gift type" className="flex border border-[#E6DFD1] rounded-md overflow-hidden w-max mb-[30px]">
        {["One-time", "Recurring monthly"].map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGiftType(g)}
            aria-pressed={giftType === g}
            className={`font-[family-name:var(--font-montserrat)] font-semibold text-[14px] px-[26px] py-3 border-r border-[#E6DFD1] last:border-r-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-inset ${giftType === g ? "bg-[#0A3D62] text-white" : "bg-[#FBF8F1] text-[#5A6572] hover:bg-[#F4EFE4]"}`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Amount */}
      <p className="font-[family-name:var(--font-montserrat)] text-[12.5px] font-semibold text-[#0A3D62] mb-3" id="amount-label">Amount</p>
      <div role="group" aria-labelledby="amount-label" className="grid grid-cols-4 gap-3 mb-[14px]">
        {amounts.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => { setAmount(a); setCustomAmount(""); }}
            aria-pressed={amount === a && !customAmount}
            className={`text-center font-[family-name:var(--font-montserrat)] font-semibold text-[19px] py-5 rounded-md border-[1.5px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-1 ${amount === a && !customAmount ? "border-[#D4AF37] bg-[#FDF6E4] text-[#0A3D62]" : "border-[#E6DFD1] bg-[#FBF8F1] text-[#0A3D62] hover:border-[#D4AF37]"}`}
          >
            {a}
          </button>
        ))}
      </div>
      <input
        placeholder="Other amount"
        value={customAmount}
        onChange={(e) => { setCustomAmount(e.target.value); setAmount(""); }}
        className="w-full font-[family-name:var(--font-open-sans)] text-[15px] px-[14px] py-[14px] rounded-md border border-[#E6DFD1] bg-[#FBF8F1] text-[#2C3641] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 mb-[30px]"
        aria-label="Custom donation amount"
      />

      {/* Purpose */}
      <fieldset className="mb-[30px]">
        <legend className="font-[family-name:var(--font-montserrat)] text-[12.5px] font-semibold text-[#0A3D62] mb-3">Donation purpose</legend>
        <div className="grid gap-2.5">
          {purposes.map((p) => (
            <button
              key={p.label}
              type="button"
              role="radio"
              aria-checked={purpose === p.label}
              onClick={() => setPurpose(p.label)}
              className={`flex items-center gap-[14px] px-[18px] py-4 rounded-md border text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-1 ${purpose === p.label ? "border-[#D4AF37] bg-[#FDF6E4]" : "border-[#E6DFD1] bg-[#FBF8F1] hover:border-[#D4AF37]"}`}
            >
              <span className="w-4 h-4 rounded-full border-[1.5px] border-[#D4AF37] grid place-items-center shrink-0" aria-hidden="true">
                <span className={`w-2 h-2 rounded-full ${purpose === p.label ? "bg-[#D4AF37]" : ""}`} />
              </span>
              <span className="text-[15.5px] text-[#2C3641] font-medium">{p.label}</span>
              <span className="ml-auto text-[13.5px] text-[#9AA5AF]">{p.note}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Donor info */}
      <div className="grid grid-cols-2 gap-4 mb-[30px]">
        <div>
          <label className="block font-[family-name:var(--font-montserrat)] text-[12.5px] font-semibold text-[#0A3D62] mb-2" htmlFor="donor-name">Full name *</label>
          <input
            id="donor-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full font-[family-name:var(--font-open-sans)] text-[15px] px-[14px] py-[13px] rounded-md border border-[#E6DFD1] bg-[#FBF8F1] text-[#2C3641] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
          />
        </div>
        <div>
          <label className="block font-[family-name:var(--font-montserrat)] text-[12.5px] font-semibold text-[#0A3D62] mb-2" htmlFor="donor-email">Email *</label>
          <input
            id="donor-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full font-[family-name:var(--font-open-sans)] text-[15px] px-[14px] py-[13px] rounded-md border border-[#E6DFD1] bg-[#FBF8F1] text-[#2C3641] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
          />
        </div>
      </div>

      {/* Payment method */}
      <fieldset className="mb-[30px]">
        <legend className="font-[family-name:var(--font-montserrat)] text-[12.5px] font-semibold text-[#0A3D62] mb-3">Payment method</legend>
        <div className="flex flex-wrap gap-2.5">
          {cardMethods.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={method === m}
              onClick={() => setMethod(m)}
              className={`border rounded-md px-[18px] py-[13px] font-[family-name:var(--font-montserrat)] text-[14px] text-[#0A3D62] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-1 ${method === m ? "border-[#D4AF37] bg-[#FDF6E4]" : "border-[#E6DFD1] bg-[#FBF8F1] hover:border-[#D4AF37]"}`}
            >
              {m}
            </button>
          ))}
          {comingSoon.map((m) => (
            <span
              key={m}
              title="Coming soon"
              className="border rounded-md px-[18px] py-[13px] font-[family-name:var(--font-montserrat)] text-[14px] text-[#C0C8D0] border-[#E6DFD1] bg-[#F8F6F2] cursor-not-allowed select-none"
            >
              {m}
            </span>
          ))}
        </div>
      </fieldset>

      {/* Card element */}
      <div className="mb-[30px] px-[14px] py-[14px] rounded-md border border-[#E6DFD1] bg-[#FBF8F1]">
        <CardElement options={CARD_OPTIONS} />
      </div>

      {error && (
        <p role="alert" className="text-[13.5px] text-red-600 mb-4">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !stripe || numericAmount <= 0}
        className="w-full font-[family-name:var(--font-montserrat)] font-semibold text-[15.5px] py-[17px] rounded-md bg-[#D4AF37] text-[#0A3D62] hover:bg-[#E3C459] transition-colors disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2"
      >
        {loading ? "Processing…" : cta}
      </button>
      <p className="text-[13.5px] text-[#9AA5AF] mt-[14px] text-center">
        Secured by Stripe · SSL encrypted · receipt emailed automatically
      </p>
    </form>
  );
}

export default function DonateClient() {
  return (
    <div className="max-w-[1200px] mx-auto px-7 py-16 pb-6">
      <div className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[.2em] uppercase text-[#8A7A55] mb-4">Give</div>
      <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[46px] text-[#0A3D62] mb-10">
        Every gift is designated, receipted and reported
      </h1>
      <div className="max-w-[680px]">
        <Elements stripe={stripePromise}>
          <DonateForm />
        </Elements>
      </div>
    </div>
  );
}
