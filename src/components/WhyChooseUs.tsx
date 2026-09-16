import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  Banknote,
  CheckCircle2,
  FileCheck,
  Gauge,
  Quote,
  ShieldCheck,
  Star,
  Timer,
  Truck,
  UserCheck,
} from "lucide-react";
import { TESTIMONIALS } from "../data/plumberData";

const SERVICE_OPTIONS = [
  { label: "Drain cleaning", base: 4800, min: 3500, max: 12000, unit: "clog" },
  { label: "Leak detection", base: 5000, min: 3500, max: 15000, unit: "diagnostic" },
  { label: "Water heater repair", base: 4500, min: 2500, max: 12000, unit: "repair" },
  { label: "Fixture install", base: 3500, min: 2000, max: 8000, unit: "fixture" },
  { label: "Pipe relining", base: 42000, min: 32000, max: 95000, unit: "project" },
  { label: "Full repipe", base: 98000, min: 65000, max: 250000, unit: "project" },
];

const URGENCY_FACTOR = [
  { label: "Flexible timeline", factor: 0.9, hint: "Best rate" },
  { label: "Within 48 hours", factor: 1 },
  { label: "Same-day rush", factor: 1.15 },
  { label: "Emergency dispatch", factor: 1.25, hint: "Priority response" },
];

const TIMELINE = [
  { label: "Request received", detail: "SmartPLUMBER dispatch confirms your job via SMS." },
  { label: "Technician dispatched", detail: `NCA-certified plumber en route from nearest hub (avg 24 min).` },
  { label: "On site & working", detail: "Flat-rate quote honored in KSh — you approve before work starts." },
];

function CostEstimator() {
  const [serviceIdx, setServiceIdx] = useState(1);
  const [urgencyIdx, setUrgencyIdx] = useState(0);
  const [units, setUnits] = useState(1);
  const reduce = useReducedMotion();

  const svc = SERVICE_OPTIONS[serviceIdx];
  const urgency = URGENCY_FACTOR[urgencyIdx];
  const low = Math.round(svc.base * urgency.factor * units);
  const high = Math.round(svc.base * 1.35 * urgency.factor * units);
  const estimate = high;

  const gaugePercent = Math.min(100, Math.round((estimate / 250000) * 100));

  return (
    <div className="rounded-3xl border border-[#0B2545]/10 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00A8E8] to-[#134074] text-white">
          <Banknote className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-lg font-extrabold text-[#0B2545]">Cost Estimator</h3>
          <p className="text-xs font-medium text-[#134074]/60">
            Rough estimate in seconds — final quote locked before work starts
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#134074]/60">
            Service type
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SERVICE_OPTIONS.map((opt, idx) => (
              <button
                key={opt.label}
                onClick={() => setServiceIdx(idx)}
                className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                  idx === serviceIdx
                    ? "border-[#00A8E8] bg-[#00A8E8]/10 text-[#0096D6]"
                    : "border-[#0B2545]/10 bg-[#F7FAFD] text-[#134074]/70 hover:border-[#00A8E8]/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#134074]/60">
            Urgency - {urgency.label}
            {urgency.hint ? (
              <span className="ml-2 font-semibold normal-case text-[#00A8E8]">
                {urgency.hint}
              </span>
            ) : null}
          </label>
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {URGENCY_FACTOR.map((u, idx) => (
              <button
                key={u.label}
                onClick={() => setUrgencyIdx(idx)}
                title={u.label}
                className={`rounded-xl border px-1 py-2.5 text-[10px] font-bold leading-tight transition-all ${
                  idx === urgencyIdx
                    ? "border-[#00A8E8] bg-[#00A8E8] text-white"
                    : "border-[#0B2545]/10 bg-[#F7FAFD] text-[#134074]/60 hover:border-[#00A8E8]/40"
                }`}
              >
                {u.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-bold text-[#134074]/70">
            <label className="uppercase tracking-wider text-[#134074]/60">
              {svc.unit === "project" ? "Project scope" : "Units / locations"}
            </label>
            <span className="text-base font-extrabold text-[#0B2545]">
              {units} {svc.unit}
              {units > 1 ? "s" : ""}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={4}
            value={units}
            onChange={(e) => setUnits(Number(e.target.value))}
            className="mt-2 w-full accent-[#00A8E8]"
            aria-label="Number of units"
          />
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-[#0B2545] to-[#134074] p-5 text-white">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7DD3FC]">
                Estimated range
              </p>
              <p className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                KSh {low.toLocaleString()} - KSh {high.toLocaleString()}
              </p>
              <p className="mt-1 text-xs font-medium text-[#CDE9FF]">
                Includes parts + labor. {urgency.hint ?? "Best-available scheduling."}
              </p>
            </div>
            <span className="text-3xl">
              <Banknote className="h-9 w-9 text-[#00A8E8]" />
            </span>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/15">
            <motion.div
              initial={false}
              animate={{ width: `${gaugePercent}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[#00C2FF] to-[#7DD3FC]"
            />
          </div>
        </div>

        <p className="flex items-start gap-2 text-[11px] font-medium leading-relaxed text-[#134074]/55">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
          Estimate is instant and non-binding. Your final flat-rate quote in KSh is
          locked before any work begins — no surprises on the invoice, ever. M-Pesa accepted.
        </p>
      </div>
    </div>
  );
}

function DispatchTracker() {
  const [stage, setStage] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setSeconds((s) => {
        const next = s + 1;
        if (next % 10 === 0) setStage((st) => (st + 1) % TIMELINE.length);
        return next;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const progress = stage === 0 ? 22 : stage === 1 ? 58 : 92;

  return (
    <div className="rounded-3xl border border-[#0B2545]/10 bg-[#0B2545] p-6 text-white shadow-xl sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#00A8E8]/20 text-[#00C2FF]">
            <Truck className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-extrabold">24/7 Dispatch Tracker</h3>
            <p className="text-xs font-medium text-[#7DD3FC]">
              Live simulation — emergency protocol Nairobi Metro
            </p>
          </div>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-sm font-bold text-[#7DD3FC]">
          {mins}:{secs}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {TIMELINE.map((step, idx) => {
          const done = idx < stage;
          const active = idx === stage;
          return (
            <div key={step.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-extrabold ${
                    done
                      ? "border-emerald-400 bg-emerald-400 text-[#0B2545]"
                      : active
                        ? "border-[#00C2FF] bg-[#00C2FF]/20 text-[#00C2FF]"
                        : "border-white/25 text-white/40"
                  }`}
                >
                  {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                </span>
                {idx < TIMELINE.length - 1 && (
                  <span
                    className={`my-1 w-0.5 flex-1 rounded ${idx < stage ? "bg-emerald-400" : "bg-white/15"}`}
                  />
                )}
              </div>
              <div className="pb-2">
                <p
                  className={`text-sm font-bold ${active ? "text-[#00C2FF]" : done ? "text-white" : "text-white/50"}`}
                >
                  {step.label}
                  {active && (
                    <span className="ml-2 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-[#00C2FF]" />
                  )}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-white/55">{step.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="h-full rounded-full bg-gradient-to-r from-[#00C2FF] to-emerald-400"
        />
      </div>
      <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-wider text-[#7DD3FC]">
        Avg response: 24 min — Westlands hub, Nairobi
      </p>
    </div>
  );
}

const TRUST_CARDS = [
  {
    icon: ShieldCheck,
    title: "NCA Certified & insured",
    detail: "Master plumbers with valid NCA registration, EPRA certified where applicable, bonded and insured. License #NCA-PL-2026-8842 on every invoice.",
  },
  {
    icon: FileCheck,
    title: "No-surprise guarantee",
    detail: "Flat-rate quote locked in KSh before work starts. If we find more, we call first — never just bill.",
  },
  {
    icon: Award,
    title: "2-year workmanship warranty",
    detail: "Every repair is backed in writing. If it fails on our watch, we return and fix it free.",
  },
  {
    icon: Timer,
    title: "On-time promise",
    detail: "A 2-hour arrival window, a live tech location link, and KSh 5,000 credit if we are late.",
  },
];

export function WhyChooseUs() {
  const reduce = useReducedMotion();
  return (
    <section id="why-us" className="scroll-mt-24 bg-[#EEF4F8] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00A8E8]/25 bg-[#00A8E8]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0096D6]">
            <UserCheck className="h-3.5 w-3.5" />
            Why Choose Us
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B2545] sm:text-4xl md:text-5xl">
            The plumber you can
            <span className="block text-[#00A8E8]">actually trust at 2 AM.</span>
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-2"
          >
            <DispatchTracker />
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-3xl bg-gradient-to-br from-[#00A8E8] to-[#0096D6] p-6 text-white shadow-xl sm:p-7"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
              <Gauge className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-2xl font-extrabold leading-tight">
              1,400+ five-star
              <br />
              Kenya-wide reviews
            </h3>
            <div className="mt-3 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-300 text-amber-300" />
              ))}
              <span className="ml-2 text-sm font-bold">4.9 average</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              Homeowners across Nairobi, Kiambu, Mombasa, Nakuru, Kisumu and Eldoret rated
              us on speed, price accuracy and tidiness.
            </p>
          </motion.div>

          {TRUST_CARDS.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: 0.12 + idx * 0.07 }}
              className="rounded-3xl border border-[#0B2545]/10 bg-white p-6 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#00A8E8]/10 text-[#0096D6]">
                <card.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-extrabold text-[#0B2545]">{card.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#134074]/70">{card.detail}</p>
            </motion.div>
          ))}

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="lg:col-span-2"
          >
            <CostEstimator />
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="rounded-3xl border border-[#0B2545]/10 bg-white p-6 shadow-sm lg:col-span-3"
          >
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#134074]/50">
              <BadgeCheck className="h-4 w-4 text-[#00A8E8]" />
              Verified customer stories
            </p>
            <div id="reviews" className="mt-5 grid scroll-mt-32 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TESTIMONIALS.map((t) => (
                <figure
                  key={t.name}
                  className="flex flex-col rounded-2xl border border-[#0B2545]/8 bg-[#F7FAFD] p-5"
                >
                  <Quote className="h-5 w-5 text-[#00A8E8]/50" />
                  <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-[#134074]/85">
                    {"“"}
                    {t.quote}
                    {"”"}
                  </blockquote>
                  <figcaption className="mt-4 border-t border-[#0B2545]/8 pt-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="mt-1.5 text-sm font-extrabold text-[#0B2545]">{t.name}</p>
                    <p className="flex items-center gap-1 text-xs font-medium text-[#134074]/55">
                      <BadgeCheck className="h-3 w-3 text-emerald-500" />
                      {t.neighborhood} — {t.service}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
