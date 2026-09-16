import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  Flame,
  Gauge,
  PhoneCall,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";
import { ISSUES } from "../data/plumberData";
import type { BookingContextValue } from "../App";

interface HeroProps {
  context: BookingContextValue;
}

function Waves() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-90" aria-hidden>
      <svg
        className="absolute bottom-0 h-full w-[200%] animate-[wave-drift_14s_linear_infinite]"
        viewBox="0 0 1440 180"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 90 C 240 30, 480 150, 720 90 C 960 30, 1200 150, 1440 90 L 1440 180 L 0 180 Z"
          fill="#FFFFFF"
          opacity="0.55"
        />
        <path
          d="M-180 120 C 60 60, 300 170, 540 110 C 780 50, 1020 170, 1260 110 C 1380 80, 1500 130, 1620 110 L 1620 180 L -180 180 Z"
          fill="#FFFFFF"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}

function RippleBubble({ top, left, size, delay }: { top: string; left: string; size: number; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute rounded-full border-2 border-white/50"
      style={{ top, left, width: size, height: size }}
      animate={
        reduce
          ? undefined
          : { y: [0, -26, 0], opacity: [0.15, 0.6, 0.15], scale: [1, 1.12, 1] }
      }
      transition={{ duration: 5, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

const HERO_STATS = [
  { icon: Star, value: "4.9/5", label: "1,400+ verified reviews across Kenya" },
  { icon: Gauge, value: "25 min", label: "emergency dispatch Nairobi" },
  { icon: ShieldCheck, value: "100%", label: "upfront KSh pricing guarantee" },
];

export function Hero({ context }: HeroProps) {
  const reduce = useReducedMotion();
  const goTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="top"
      className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-b from-[#0B2545] via-[#134074] to-[#00A8E8]/70 pt-32 pb-24 sm:pt-36"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_30%_20%,rgba(0,168,232,0.35),transparent_70%),radial-gradient(50%_40%_at_80%_40%,rgba(125,211,252,0.25),transparent_70%)]"
      />
      <RippleBubble top="18%" left="8%" size={110} delay={0} />
      <RippleBubble top="34%" left="85%" size={150} delay={1.2} />
      <RippleBubble top="60%" left="12%" size={70} delay={2.1} />
      <RippleBubble top="22%" left="70%" size={44} delay={0.7} />
      <Waves />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#7DD3FC]/40 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#A5E4FF] backdrop-blur"
          >
            <span className="flex h-2 w-2 items-center justify-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-[#00C2FF] opacity-70" />
              <span className="h-2 w-2 rounded-full bg-[#00C2FF]" />
            </span>
            Emergency line open 24/7 — Nairobi &amp; satellite towns
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Kenya's smartest plumbing <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#7DD3FC] via-[#00C2FF] to-[#A5E4FF] bg-clip-text text-transparent">
              service (2026).
            </span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mx-auto mt-5 max-w-[60ch] text-base leading-relaxed text-[#CDE9FF] sm:text-lg"
          >
            From midnight burst pipes to solar water heater installs, SmartPLUMBER
            dispatches NCA-certified plumbers in as fast as 25 minutes with
            100% upfront KSh pricing and M-Pesa payment.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <button
              onClick={() => goTo("#troubleshooter")}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#00A8E8] px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-[#00A8E8]/40 transition-transform hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto"
            >
              <Wrench className="h-5 w-5" />
              Diagnose an Issue
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => goTo("#request-service")}
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/70 bg-white/10 px-7 py-3.5 text-base font-bold text-white backdrop-blur transition-colors hover:bg-white hover:text-[#0B2545] active:scale-[0.98] sm:w-auto"
            >
              <PhoneCall className="h-5 w-5" />
              Request Service Now
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34 }}
          className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {HERO_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 backdrop-blur"
            >
              <stat.icon className="h-6 w-6 shrink-0 text-[#7DD3FC]" />
              <span>
                <span className="block text-lg font-extrabold leading-none text-white">
                  {stat.value}
                </span>
                <span className="mt-1 block text-xs font-medium text-[#CDE9FF]">
                  {stat.label}
                </span>
              </span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42 }}
          className="mx-auto mt-8 max-w-2xl"
        >
          <p className="text-center text-xs font-bold uppercase tracking-[0.16em] text-[#A5E4FF]">
            What is going on right now?
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {ISSUES.map((issue) => (
              <button
                key={issue.id}
                onClick={() => context.requestService(issue.expectedService, issue.urgencyLabel, issue.summary)}
                className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-[#E6F6FF] transition-colors hover:border-[#00C2FF] hover:bg-[#00A8E8] hover:text-white"
              >
                {issue.urgency === "critical" || issue.urgency === "high" ? (
                  <Flame className="mr-1 inline h-3 w-3 text-amber-300" />
                ) : null}
                {issue.symptom}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute right-4 bottom-16 hidden rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-center backdrop-blur md:block">
        <span className="flex items-center justify-center gap-1.5 text-xs font-bold text-white">
          <CalendarClock className="h-4 w-4 text-[#7DD3FC]" />
          Next opening: 10:20 AM
        </span>
      </div>
    </section>
  );
}
