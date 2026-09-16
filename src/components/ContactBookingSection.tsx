import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  AlertCircle,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplets,
  Loader2,
  Lock,
  MapPin,
  PhoneCall,
  Send,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { BRAND, FAQS, SERVICES } from "../data/plumberData";
import type { BookingRequest } from "../types";
import type { BookingContextValue } from "../App";

interface Props {
  context: BookingContextValue;
}

const URGENCY_WINDOWS: Record<string, { eta: string; factor: string }> = {
  "Immediate Emergency": { eta: "45 min", factor: "1.25x priority — no surcharge" },
  "Today": { eta: "3-5 hrs", factor: "Same-day dispatch" },
  "Within 48 Hours": { eta: "24-48 hrs", factor: "Standard pricing" },
  "Flexible": { eta: "2-5 days", factor: "Off-peak discount" },
};

const URGENCY_OPTIONS = [
  "Immediate Emergency",
  "Today",
  "Within 48 Hours",
  "Flexible",
];

function FaqAccordion() {
  return (
    <div id="faq" className="scroll-mt-24">
      <Accordion type="single" collapsible className="space-y-3">
        {FAQS.map((faq, idx) => (
          <AccordionItem
            key={faq.q}
            value={`faq-${idx}`}
            className="rounded-2xl border border-[#0B2545]/10 bg-white px-5 shadow-sm"
          >
            <AccordionTrigger className="py-4 text-left text-sm font-extrabold text-[#0B2545] hover:no-underline sm:text-base">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="pb-5 text-sm leading-relaxed text-[#134074]/75">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export function ContactBookingSection({ context }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [service, setService] = useState(SERVICES[0].title);
  const [urgency, setUrgency] = useState("Within 48 Hours");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<BookingRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const userEdited = useRef(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (userEdited.current) return;
    if (context.appointment.service) setService(context.appointment.service);
    if (context.appointment.urgency) setUrgency(context.appointment.urgency);
    if (context.appointment.description) {
      setDescription((prev) => (prev ? prev : context.appointment.description));
    }
  }, [context.appointment]);

  const fieldRefs = useMemo(
    () => ({
      name: { value: name, set: setName },
      phone: { value: phone, set: setPhone },
      email: { value: email, set: setEmail },
      address: { value: address, set: setAddress },
    }),
    [name, phone, email, address],
  );
  void fieldRefs;

  const window = URGENCY_WINDOWS[urgency] ?? URGENCY_WINDOWS["Within 48 Hours"];

  const submit = () => {
    setError(null);
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("Please add your name, phone and address so we can reach you.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const request: BookingRequest = {
        id: `SP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        service,
        urgency,
        description: description.trim() || "General plumbing request",
        createdAt: new Date().toISOString(),
        etaWindow: window.eta,
      };
      try {
        const raw = localStorage.getItem("smartplumber_requests");
        const stored: BookingRequest[] = raw ? JSON.parse(raw) : [];
        localStorage.setItem(
          "smartplumber_requests",
          JSON.stringify([...stored, request]),
        );
      } catch {
        /* storage unavailable - proceed with in-memory confirmation */
      }
      setSubmitting(false);
      setConfirmed(request);
    }, 1100);
  };

  return (
    <section
      id="request-service"
      className="scroll-mt-20 bg-gradient-to-b from-white via-[#EEF4F8] to-[#0B2545] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00A8E8]/25 bg-[#00A8E8]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0096D6]">
            <CalendarCheck className="h-3.5 w-3.5" />
            Request Service
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B2545] sm:text-4xl md:text-5xl">
            Book your plumber
            <span className="block text-[#00A8E8]">in under 60 seconds.</span>
          </h2>
          <p className="mt-4 text-[#134074]/75">
            Tell us what you need and we'll send a flat-rate quote and a
            live dispatch link straight to your phone. Pay via M-Pesa.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div>
            {confirmed ? (
              <motion.div
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-xl sm:p-10"
              >
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <h3 className="mt-5 text-2xl font-extrabold text-[#0B2545]">
                  Request confirmed, {confirmed.name.split(" ")[0]}!
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#134074]/70">
                  Dispatch ID <span className="font-mono font-extrabold text-[#0B2545]">{confirmed.id}</span>{" "}
                  is live. A NCA-certified plumber will call{" "}
                  <span className="font-bold text-[#0B2545]">{confirmed.phone}</span> within 10
                  minutes to confirm arrival. Payment via M-Pesa Till.
                </p>
                <div className="mx-auto mt-6 grid max-w-md gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#F7FAFD] p-4 text-left">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#134074]/50">
                      <Clock className="h-3.5 w-3.5" /> ETA window
                    </p>
                    <p className="mt-1 text-lg font-extrabold text-[#0B2545]">
                      {confirmed.etaWindow}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#F7FAFD] p-4 text-left">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#134074]/50">
                      <ShieldCheck className="h-3.5 w-3.5" /> Price promise
                    </p>
                    <p className="mt-1 text-lg font-extrabold text-[#0B2545]">
                      Flat-rate KSh, locked
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setConfirmed(null);
                    setName("");
                    setPhone("");
                    setEmail("");
                    setAddress("");
                    setDescription("");
                    userEdited.current = false;
                  }}
                  className="mt-7 rounded-full border-2 border-[#0B2545]/15 px-6 py-2.5 text-sm font-bold text-[#134074] transition-colors hover:border-[#00A8E8] hover:text-[#0096D6]"
                >
                  Book another service
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="rounded-3xl border border-[#0B2545]/10 bg-white p-6 shadow-[0_20px_60px_rgba(11,37,69,0.1)] sm:p-8"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#134074]/60">
                      Full name *
                    </span>
                    <input
                      value={name}
                      onChange={(e) => {
                        userEdited.current = true;
                        setName(e.target.value);
                      }}
                      placeholder="Jane Wanjiku"
                      className="mt-1.5 w-full rounded-xl border border-[#0B2545]/12 bg-[#F7FAFD] px-4 py-3 text-sm font-medium text-[#0B2545] outline-none transition-colors placeholder:text-[#134074]/35 focus:border-[#00A8E8] focus:ring-2 focus:ring-[#00A8E8]/20"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#134074]/60">
                      Phone *
                    </span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      inputMode="tel"
                      className="mt-1.5 w-full rounded-xl border border-[#0B2545]/12 bg-[#F7FAFD] px-4 py-3 text-sm font-medium text-[#0B2545] outline-none transition-colors placeholder:text-[#134074]/35 focus:border-[#00A8E8] focus:ring-2 focus:ring-[#00A8E8]/20"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#134074]/60">
                      Email
                    </span>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@email.com"
                      inputMode="email"
                      className="mt-1.5 w-full rounded-xl border border-[#0B2545]/12 bg-[#F7FAFD] px-4 py-3 text-sm font-medium text-[#0B2545] outline-none transition-colors placeholder:text-[#134074]/35 focus:border-[#00A8E8] focus:ring-2 focus:ring-[#00A8E8]/20"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#134074]/60">
                      Street address *
                    </span>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Westlands, Nairobi"
                      className="mt-1.5 w-full rounded-xl border border-[#0B2545]/12 bg-[#F7FAFD] px-4 py-3 text-sm font-medium text-[#0B2545] outline-none transition-colors placeholder:text-[#134074]/35 focus:border-[#00A8E8] focus:ring-2 focus:ring-[#00A8E8]/20"
                    />
                  </label>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#134074]/60">
                      Service needed
                    </span>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="mt-1.5 w-full appearance-none rounded-xl border border-[#0B2545]/12 bg-[#F7FAFD] px-4 py-3 text-sm font-medium text-[#0B2545] outline-none transition-colors focus:border-[#00A8E8] focus:ring-2 focus:ring-[#00A8E8]/20"
                    >
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#134074]/60">
                      How urgent?
                    </span>
                    <div className="mt-1.5 grid grid-cols-2 gap-2">
                      {URGENCY_OPTIONS.map((opt) => {
                        const active = opt === urgency;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setUrgency(opt)}
                            className={`rounded-xl border px-2 py-2.5 text-xs font-bold transition-all ${
                              active
                                ? "border-[#0B2545] bg-[#0B2545] text-white"
                                : "border-[#0B2545]/12 bg-[#F7FAFD] text-[#134074]/70 hover:border-[#00A8E8]/50"
                            } ${opt === "Immediate Emergency" ? "col-span-2" : ""}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <label className="mt-5 block">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#134074]/60">
                    Describe the problem
                  </span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder={`e.g. Kitchen sink backing up, gurgling sounds... ${context.appointment.service ? "(prefilled from your diagnostic)" : ""}`}
                    className="mt-1.5 w-full resize-none rounded-xl border border-[#0B2545]/12 bg-[#F7FAFD] px-4 py-3 text-sm font-medium text-[#0B2545] outline-none transition-colors placeholder:text-[#134074]/35 focus:border-[#00A8E8] focus:ring-2 focus:ring-[#00A8E8]/20"
                  />
                </label>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={reduce ? false : { opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#00A8E8] to-[#0096D6] px-7 py-4 text-base font-bold text-white shadow-xl shadow-[#00A8E8]/35 transition-transform hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Confirming your request...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Request — Get Quote in 10 min
                    </>
                  )}
                </button>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] font-semibold text-[#134074]/55">
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Encrypted &amp; private
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Serving {BRAND.coverage.length} Kenya areas
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> {BRAND.insurance}
                  </span>
                </div>
              </form>
            )}
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl bg-gradient-to-br from-[#0B2545] to-[#134074] p-6 text-white shadow-xl sm:p-7">
              <h3 className="text-lg font-extrabold">Prefer to call or WhatsApp?</h3>
              <p className="mt-1 text-sm text-[#CDE9FF]">
                Our dispatch line is answered by plumbers, not bots — 24/7.
              </p>
              <a
                href={BRAND.hotlineHref}
                className="mt-4 flex items-center justify-between rounded-2xl bg-white/10 px-5 py-4 backdrop-blur transition-colors hover:bg-white/15"
              >
                <span className="flex items-center gap-3">
                  <PhoneCall className="h-5 w-5 text-[#00C2FF]" />
                  <span>
                    <span className="block text-base font-extrabold tracking-tight">
                      {BRAND.hotline}
                    </span>
                    <span className="block text-xs font-medium text-[#7DD3FC]">
                      Free dispatch estimate
                    </span>
                  </span>
                </span>
                <ChevronRight className="h-5 w-5 text-[#7DD3FC]" />
              </a>
              <a
                href={BRAND.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-between rounded-2xl bg-green-600/20 px-5 py-4 backdrop-blur transition-colors hover:bg-green-600/30"
              >
                <span className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-green-400" />
                  <span>
                    <span className="block text-base font-extrabold tracking-tight text-green-300">
                      WhatsApp Us
                    </span>
                    <span className="block text-xs font-medium text-green-200/70">
                      Quick chat — reply within 5 min
                    </span>
                  </span>
                </span>
                <ChevronRight className="h-5 w-5 text-green-300" />
              </a>
              <div className="mt-4 space-y-2.5 text-sm">
                {URGENCY_OPTIONS.map((opt) => {
                  const win = URGENCY_WINDOWS[opt];
                  const active = opt === urgency;
                  return (
                    <div
                      key={opt}
                      className={`flex items-center justify-between rounded-xl px-4 py-2.5 ${
                        active ? "bg-[#00A8E8]/20 ring-1 ring-[#00C2FF]/50" : "bg-white/5"
                      }`}
                    >
                      <span className="font-bold">
                        {opt === "Immediate Emergency" && (
                          <span className="mr-1.5 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
                        )}
                        {opt}
                      </span>
                      <span className="text-xs font-bold text-[#7DD3FC]">{win.eta}</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-[#7DD3FC]">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {BRAND.license} — fully insured and bonded.
              </p>
            </div>

            <div className="rounded-3xl border border-[#0B2545]/10 bg-white p-6 shadow-sm">
              <h3 className="text-base font-extrabold text-[#0B2545]">
                Frequently asked questions
              </h3>
              <p className="mb-4 mt-1 text-xs font-medium text-[#134074]/60">
                Straight answers before you book.
              </p>
              <FaqAccordion />
            </div>
          </div>
        </div>

        <footer className="mt-16 border-t border-white/10 pt-10 text-[#CDE9FF]">
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <span className="flex items-center gap-2 text-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00A8E8] text-white">
                  <Droplets className="h-4.5 w-4.5" />
                </span>
                <span className="text-base font-extrabold tracking-tight">
                  Smart<span className="text-[#00C2FF]">PLUMBER</span>
                </span>
              </span>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#CDE9FF]/80">
                NCA-certified master plumbers serving all of Kenya since 2008.
                100% upfront KSh pricing, M-Pesa payment and a 2-year
                workmanship warranty on every single job.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00C2FF]">
                Coverage area
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {BRAND.coverage.map((area) => (
                  <li key={area} className="flex items-center gap-1.5 font-medium text-[#CDE9FF]/85">
                    <span className="h-1 w-1 rounded-full bg-[#00C2FF]" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00C2FF]">
                24/7 emergency hotline
              </p>
              <a
                href={BRAND.hotlineHref}
                className="mt-3 block text-2xl font-extrabold tracking-tight text-white hover:text-[#00C2FF]"
              >
                {BRAND.hotline}
              </a>
              <p className="mt-2 text-sm text-[#CDE9FF]/80">
                Serving Kenya-wide· {BRAND.license}
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-[#CDE9FF]/60 sm:flex-row">
            <p>© {new Date().getFullYear()} SmartPLUMBER Kenya. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#00C2FF]" />
              {BRAND.insurance}
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
