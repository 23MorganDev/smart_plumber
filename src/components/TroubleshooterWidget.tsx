import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Droplets,
  Flame,
  Gauge,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { ISSUES, URGENCY_ORDER } from "../data/plumberData";
import type { TroubleshootIssue } from "../types";
import type { BookingContextValue } from "../App";

interface Props {
  context: BookingContextValue;
}

const URGENCY_META: Record<
  string,
  { label: string; bar: string; chip: string; gaugePercent: number; hint: string }
> = {
  critical: {
    label: "CRITICAL",
    bar: "bg-red-500",
    chip: "bg-red-50 text-red-700 border-red-200",
    gaugePercent: 100,
    hint: "Possible flooding or safety hazard. Shut off water now and call dispatch.",
  },
  high: {
    label: "HIGH",
    bar: "bg-amber-500",
    chip: "bg-amber-50 text-amber-700 border-amber-200",
    gaugePercent: 75,
    hint: "Needs attention within hours. Follow the safety steps below.",
  },
  medium: {
    label: "MODERATE",
    bar: "bg-sky-500",
    chip: "bg-sky-50 text-sky-700 border-sky-200",
    gaugePercent: 48,
    hint: "Schedule a service visit in the next day or two.",
  },
  low: {
    label: "LOW",
    bar: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    gaugePercent: 22,
    hint: "Flag it for preventive maintenance on your next visit.",
  },
};

function SeverityGauge({ issue }: { issue: TroubleshootIssue }) {
  const meta = URGENCY_META[issue.urgency];
  const order = URGENCY_ORDER[issue.urgency];
  return (
    <div className="rounded-2xl border border-[#0B2545]/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${meta.chip}`}
        >
          {issue.urgency === "critical" || issue.urgency === "high" ? (
            <Flame className="h-3.5 w-3.5" />
          ) : (
            <Gauge className="h-3.5 w-3.5" />
          )}
          {issue.urgencyLabel}
        </span>
        <span className="text-xs font-semibold text-[#134074]/60">
          Service within: <span className="font-extrabold text-[#0B2545]">{issue.etaLabel}</span>
        </span>
      </div>
      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[#EEF4F8]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${meta.gaugePercent}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${meta.bar}`}
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-[#134074]/50">
        {["low", "high", "critical"].map((level, i) => (
          <span key={level} className={order === i || (level === "critical" && order === 0) ? "text-[#0B2545]" : undefined}>
            {level}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm font-medium text-[#134074]/80">{meta.hint}</p>
    </div>
  );
}

export function TroubleshooterWidget({ context }: Props) {
  const [selectedId, setSelectedId] = useState<string>(ISSUES[0].id);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const reduce = useReducedMotion();

  const issue = useMemo(
    () => ISSUES.find((i) => i.id === selectedId) ?? ISSUES[0],
    [selectedId],
  );

  const toggleStep = (idx: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const allDone = issue.diySteps.length > 0 && checked.size === issue.diySteps.length;

  return (
    <section id="troubleshooter" className="scroll-mt-24 bg-[#EEF4F8] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00A8E8]/25 bg-[#00A8E8]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0096D6]">
            <Wrench className="h-3.5 w-3.5" />
            Smart Troubleshooter
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B2545] sm:text-4xl md:text-5xl">
            Tell us what's wrong.
            <span className="block text-[#00A8E8]">We'll tell you what to do.</span>
          </h2>
          <p className="mt-4 text-[#134074]/75">
            Pick your symptom for an instant urgency rating, DIY first-aid safety
            steps, and a one-click path to a certified plumber.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-[#0B2545]/10 bg-white p-4 shadow-[0_20px_60px_rgba(11,37,69,0.12)]">
              <p className="px-2 pb-3 pt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#134074]/60">
                Choose your symptom
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {ISSUES.map((item) => {
                  const active = item.id === selectedId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedId(item.id);
                        setChecked(new Set());
                      }}
                      className={`group flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all ${
                        active
                          ? "border-[#00A8E8] bg-gradient-to-r from-[#00A8E8]/10 to-transparent shadow-sm"
                          : "border-[#0B2545]/8 hover:border-[#00A8E8]/40 hover:bg-[#EEF4F8]/60"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          active ? "bg-[#00A8E8] text-white" : "bg-[#EEF4F8] text-[#134074]"
                        }`}
                      >
                        <Droplets className="h-4.5 w-4.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-[#0B2545]">
                          {item.symptom}
                        </span>
                        <span className="block text-[11px] font-semibold text-[#134074]/55">
                          {item.summary}
                        </span>
                      </span>
                      {active && (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00A8E8] text-white">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={issue.id}
              initial={reduce ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <SeverityGauge issue={issue} />

              <div className="rounded-3xl border border-[#0B2545]/10 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <ShieldAlert className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#0B2545]">
                      DIY First-Aid Checklist
                    </h3>
                    <p className="text-xs font-medium text-[#134074]/60">
                      Follow in order while your tech is on the way
                    </p>
                  </div>
                </div>
                <div className="mt-5 space-y-2.5">
                  {issue.diySteps.map((step, idx) => {
                    const done = checked.has(idx);
                    return (
                      <button
                        key={step.title}
                        onClick={() => toggleStep(idx)}
                        className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                          done
                            ? "border-emerald-200 bg-emerald-50/70"
                            : step.critical
                              ? "border-red-200 bg-red-50/60 hover:border-red-300"
                              : "border-[#0B2545]/8 bg-[#EEF4F8]/40 hover:border-[#00A8E8]/40"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                            done
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : step.critical
                                ? "border-red-400 text-transparent"
                                : "border-[#134074]/30"
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </span>
                        <span>
                          <span
                            className={`block text-sm font-bold ${
                              step.critical ? "text-red-700" : "text-[#0B2545]"
                            }`}
                          >
                            {step.title}
                            {step.critical && (
                              <AlertTriangle className="ml-1.5 inline h-3.5 w-3.5" />
                            )}
                          </span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-[#134074]/70">
                            {step.detail}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    What NOT to do
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {issue.notToDo.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-sm font-medium text-amber-800/90">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-[#0B2545] to-[#134074] p-6 text-white shadow-xl sm:p-7">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-lg font-extrabold">Repair scope</h3>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#CDE9FF]">
                      {issue.repairScope}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    context.requestService(
                      issue.expectedService,
                      issue.urgencyLabel,
                      issue.summary,
                    )
                  }
                  className="group mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#00A8E8] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#00A8E8]/40 transition-transform hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto"
                >
                  <CheckCircle2 className="h-4.5 w-4.5" />
                  {allDone
                    ? "Checklist complete - Book Certified Plumber"
                    : "Book Certified Plumber with this diagnostic"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
