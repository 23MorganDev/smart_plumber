import { useEffect, useState } from "react";
import {
  Droplets,
  Menu,
  PhoneCall,
  ShieldCheck,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { BRAND, NAV_LINKS } from "../data/plumberData";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-[#0B2545] text-white">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-3 px-4 text-xs sm:px-6">
          <p className="hidden items-center gap-2 font-medium sm:flex">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Available now — avg response 24 min across Nairobi Metro
          </p>
          <a
            href={BRAND.hotlineHref}
            className="flex items-center gap-1.5 font-semibold tracking-wide text-[#7DD3FC] hover:text-white sm:font-bold"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            {BRAND.hotline}
          </a>
        </div>
      </div>

      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? "border-b border-[#0B2545]/10 bg-white/90 shadow-[0_8px_30px_rgba(11,37,69,0.08)] backdrop-blur-xl"
            : "bg-white/60 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 text-left"
            aria-label="SmartPLUMBER home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00A8E8] to-[#134074] text-white shadow-lg shadow-[#00A8E8]/30">
              <Droplets className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-[17px] font-extrabold tracking-tight text-[#0B2545]">
                Smart<span className="text-[#0096D6]">PLUMBER</span>
              </span>
              <span className="mt-[-2px] block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#134074]/60">
                Kenya's #1 Plumbing Service (2026)
              </span>
            </span>
          </button>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-[#134074]/80 transition-colors hover:bg-[#00A8E8]/10 hover:text-[#0096D6]"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 md:flex">
              <ShieldCheck className="h-3.5 w-3.5" />
              NCA Certified
            </span>
            <a
              href="#request-service"
              onClick={(e) => {
                e.preventDefault();
                go("#request-service");
              }}
              className="hidden rounded-full bg-[#0B2545] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#0B2545]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#134074] active:scale-[0.98] sm:block"
            >
              Request Service
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#0B2545]/10 text-[#0B2545] lg:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-[#0B2545]/10 bg-white px-4 py-3 lg:hidden"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#134074] hover:bg-[#00A8E8]/10"
              >
                {link.label}
              </button>
            ))}
            <a
              href="#request-service"
              onClick={(e) => {
                e.preventDefault();
                go("#request-service");
              }}
              className="mt-2 block rounded-xl bg-[#0B2545] px-4 py-3 text-center text-sm font-bold text-white"
            >
              Request Service
            </a>
          </motion.div>
        )}
      </nav>
    </header>
  );
}
