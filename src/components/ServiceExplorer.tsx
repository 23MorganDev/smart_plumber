import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Droplet,
  Droplets,
  Flame,
  Search,
  Shield,
  Wrench,
  Zap,
} from "lucide-react";
import { SERVICE_CATEGORIES, SERVICES } from "../data/plumberData";
import type { BookingContextValue } from "../App";

interface Props {
  context: BookingContextValue;
}

const CATEGORY_ICONS: Record<string, typeof Zap> = {
  "Emergency Repairs": Zap,
  "Pump & Pressure Systems": Zap,
  "Solar & Water Heating": Flame,
  "Water Storage & Tanks": Droplets,
  "Waste & Drainage Systems": Shield,
  "Leak Detection & Pipe Relining": Search,
  "Metering & Smart Systems": Droplet,
  "Drain Cleaning & Hydro Jetting": Droplets,
};

export function ServiceExplorer({ context }: Props) {
  const [category, setCategory] = useState<string>(SERVICE_CATEGORIES[0]);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set([SERVICES[0].id]));
  const reduce = useReducedMotion();

  const services = useMemo(
    () => SERVICES.filter((s) => s.category === category),
    [category],
  );

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="services" className="scroll-mt-24 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00A8E8]/25 bg-[#00A8E8]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0096D6]">
            <Droplet className="h-3.5 w-3.5" />
            Service Explorer
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B2545] sm:text-4xl md:text-5xl">
            Every service.
            <span className="block text-[#00A8E8]">Every price. In the open.</span>
          </h2>
          <p className="mt-4 text-[#134074]/75">
            Pick a category, expand a service, and see exactly what is included,
            what it typically costs in KSh, and the warranty behind it.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {SERVICE_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] ?? Wrench;
            const active = cat === category;
            const count = SERVICES.filter((s) => s.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setOpenIds(new Set([SERVICES.find((s) => s.category === cat)?.id ?? ""]));
                }}
                className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-all ${
                  active
                    ? "border-[#0B2545] bg-[#0B2545] text-white shadow-lg shadow-[#0B2545]/25"
                    : "border-[#0B2545]/12 bg-white text-[#134074] hover:border-[#00A8E8]/50 hover:bg-[#00A8E8]/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                    active ? "bg-white/20 text-white" : "bg-[#EEF4F8] text-[#134074]/70"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-8 grid gap-4 md:grid-cols-2"
          >
            {services.map((service) => {
              const open = openIds.has(service.id);
              return (
                <div
                  key={service.id}
                  className="overflow-hidden rounded-3xl border border-[#0B2545]/10 bg-white shadow-sm transition-shadow hover:shadow-[0_18px_50px_rgba(11,37,69,0.12)]"
                >
                  <button
                    onClick={() => toggle(service.id)}
                    className="flex w-full items-start gap-4 p-5 text-left sm:p-6"
                  >
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        service.emergency
                          ? "bg-gradient-to-br from-red-500 to-red-600 text-white"
                          : "bg-gradient-to-br from-[#00A8E8] to-[#134074] text-white"
                      }`}
                    >
                      {service.emergency ? (
                        <Zap className="h-5.5 w-5.5" />
                      ) : (
                        <Wrench className="h-5.5 w-5.5" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-extrabold text-[#0B2545]">
                          {service.title}
                        </span>
                        {service.emergency && (
                          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-red-600">
                            Emergency
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-[#134074]/70">
                        {service.tagline}
                      </span>
                      <span className="mt-3 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-[#EEF4F8] px-2.5 py-1 text-[11px] font-bold text-[#134074]">
                          {service.priceRange}
                        </span>
                        <span className="rounded-full bg-[#EEF4F8] px-2.5 py-1 text-[11px] font-bold text-[#134074]">
                          {service.turnaround}
                        </span>
                      </span>
                    </span>
                    <ChevronDown
                      className={`mt-1 h-5 w-5 shrink-0 text-[#134074]/50 transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-[#0B2545]/8 bg-[#F7FAFD]"
                      >
                        <div className="space-y-4 p-5 sm:p-6">
                          <div>
                            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#134074]/50">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              What is included
                            </p>
                            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                              {service.includes.map((item) => (
                                <li
                                  key={item}
                                  className="flex items-start gap-2 text-sm font-medium text-[#134074]/85"
                                >
                                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00A8E8]" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600">
                              <AlertTriangle className="h-3.5 w-3.5" />
                              Warning signs you need this
                            </p>
                            <ul className="mt-2 space-y-1.5">
                              {service.warningSigns.map((sign) => (
                                <li
                                  key={sign}
                                  className="flex items-start gap-2 text-sm font-medium text-[#134074]/70"
                                >
                                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                                  {sign}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#00A8E8]/20 bg-white p-4">
                            <span className="flex items-center gap-2 text-sm font-extrabold text-[#0B2545]">
                              <BadgeCheck className="h-4.5 w-4.5 text-[#00A8E8]" />
                              {service.warranty}
                            </span>
                            <button
                              onClick={() =>
                                context.requestService(
                                  service.category,
                                  "Within 48 Hours",
                                  `Requesting: ${service.title}`,
                                )
                              }
                              className="flex items-center gap-1.5 rounded-full bg-[#0B2545] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#134074]"
                            >
                              <CalendarClock className="h-3.5 w-3.5" />
                              Book This Service
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export const SERVICE_EXPLORER_ICONS = { Droplet };
