import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Copy, Mail } from "lucide-react";
import { SectionHeading, SectionShell } from "./SectionShell";
import { APEX_BUSINESSES } from "@/src/data/businesses";

const field =
  "w-full min-w-0 rounded-md border border-[var(--apex-border)] bg-[var(--apex-bg)] px-4 py-3 text-base text-[var(--apex-text-primary)] placeholder:text-[var(--apex-text-secondary)] focus-visible:outline-2 focus-visible:outline-[#F28C28]";
const label = "mb-2 block text-sm font-medium text-[var(--apex-text-primary)]";
const primary =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#F28C28] px-5 py-3 text-sm font-semibold text-[#111418] hover:bg-[#FF9F43] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F28C28]";
const secondary =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[var(--apex-border)] px-4 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-[#F28C28]";
const recipient =
  (import.meta.env.VITE_APEX_ENQUIRY_EMAIL as string | undefined)?.trim() || "";

export function BusinessEnquirySection() {
  const [form, setForm] = useState({
    company: "",
    email: "",
    phone: "",
    division: APEX_BUSINESSES[0].name,
    message: "",
  });
  const [brief, setBrief] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLHeadingElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const wasPreview = useRef(false);
  useEffect(() => {
    if (brief) {
      resultRef.current?.focus({ preventScroll: true });
      wasPreview.current = true;
    } else if (wasPreview.current) {
      companyRef.current?.focus({ preventScroll: true });
    }
  }, [brief]);
  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !form.company.trim() ||
      !form.message.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      setError(
        "Please enter your name or organisation, a valid email address and your requirements.",
      );
      return;
    }
    setStatus("");
    setError("");
    setBrief(
      [
        "Apex Group Business Enquiry",
        `Division: ${form.division}`,
        `Organisation / Name: ${form.company.trim()}`,
        `Reply email: ${form.email.trim()}`,
        ...(form.phone.trim() ? [`Phone: ${form.phone.trim()}`] : []),
        "",
        "Requirements:",
        form.message.trim(),
      ].join("\n"),
    );
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(brief);
      setStatus("Enquiry copied.");
    } catch {
      setStatus(
        "Copy is unavailable. Select and copy the enquiry text manually.",
      );
    }
  }
  const mailto = `mailto:${encodeURIComponent(recipient).replace(/%40/g, "@")}?subject=${encodeURIComponent(`Apex Group enquiry — ${form.division}`)}&body=${encodeURIComponent(brief)}`;
  return (
    <SectionShell id="contact">
      <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
        <div>
          <SectionHeading
            id="contact"
            eyebrow="Business enquiries"
            title="Discuss your next requirement with Apex Group."
            description="Tell us about the products or services you need, your application and expected supply requirements. Choose the relevant business division to prepare your enquiry."
          />
          <div
            data-corporate-reveal
            className="border-l-2 border-[#F28C28] pl-4 text-sm leading-relaxed text-[var(--apex-text-secondary)]"
          >
            For quotations, product availability and technical specifications,
            include your preferred location and quantities wherever possible.
          </div>
        </div>
        <div
          data-corporate-reveal
          className="min-w-0 rounded-xl border border-[var(--apex-border)] apex-theme-surface p-5 sm:p-8"
        >
          {brief ? (
            <div className="space-y-5">
              <h3
                ref={resultRef}
                tabIndex={-1}
                className="font-display text-2xl font-semibold"
              >
                Your enquiry is ready
              </h3>
              <p className="text-sm leading-relaxed text-[var(--apex-text-secondary)]">
                This is a draft, not a submitted enquiry. Open your email
                application to send it.
                {!recipient &&
                  " Add the appropriate business email address before sending."}
              </p>
              <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-md border border-[var(--apex-border)] p-4 text-sm leading-relaxed">
                {brief}
              </pre>
              <div className="flex flex-wrap gap-3">
                <a href={mailto} className={primary}>
                  <Mail size={17} /> Open email draft
                </a>
                <button type="button" onClick={copy} className={secondary}>
                  <Copy size={17} /> Copy enquiry
                </button>
                <button
                  type="button"
                  className={secondary}
                  onClick={() => {
                    setBrief("");
                    setStatus("");
                  }}
                >
                  Edit enquiry
                </button>
              </div>
              <p role="status" className="text-sm">
                {status}
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <h3 className="font-display text-2xl font-semibold">
                Business enquiry
              </h3>
              <p className="text-sm text-[var(--apex-text-secondary)]">
                All fields except phone are required.
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="min-w-0">
                  <label htmlFor="enquiry-company" className={label}>
                    Name / Organisation
                  </label>
                  <input
                    ref={companyRef}
                    id="enquiry-company"
                    autoComplete="organization"
                    required
                    maxLength={160}
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    className={field}
                    placeholder="Your name or company"
                  />
                </div>
                <div className="min-w-0">
                  <label htmlFor="enquiry-email" className={label}>
                    Email address
                  </label>
                  <input
                    id="enquiry-email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={field}
                    placeholder="name@company.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="enquiry-phone" className={label}>
                  Phone (optional)
                </label>
                <input
                  id="enquiry-phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={40}
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={field}
                  placeholder="Phone with country code"
                />
              </div>
              <div>
                <label htmlFor="enquiry-division" className={label}>
                  Business division
                </label>
                <select
                  id="enquiry-division"
                  required
                  value={form.division}
                  onChange={(e) => update("division", e.target.value)}
                  className={field}
                >
                  {APEX_BUSINESSES.map((biz) => (
                    <option key={biz.id} value={biz.name}>
                      {biz.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="enquiry-message" className={label}>
                  Your requirements
                </label>
                <textarea
                  id="enquiry-message"
                  required
                  rows={5}
                  maxLength={1500}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className={`${field} resize-y`}
                  placeholder="Product, quantity, application or service required…"
                />
              </div>
              {error && (
                <p role="alert" className="text-sm font-medium">
                  {error}
                </p>
              )}
              <button type="submit" className={`${primary} w-full sm:w-auto`}>
                Prepare enquiry <ArrowRight size={17} />
              </button>
              <p className="text-xs leading-relaxed text-[var(--apex-text-secondary)]">
                Review your enquiry before sending it through your email
                application.
              </p>
            </form>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
