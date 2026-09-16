import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ServiceExplorer } from "./components/ServiceExplorer";
import { GalleryShowcase } from "./components/GalleryShowcase";
import { TroubleshooterWidget } from "./components/TroubleshooterWidget";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { ContactBookingSection } from "./components/ContactBookingSection";
import type { BookingRequest } from "./types";

export interface BookingContextValue {
  appointment: {
    service: string;
    urgency: string;
    description: string;
  };
  requestService: (service: string, urgency: string, description: string) => void;
}

const defaultContext: BookingContextValue = {
  appointment: { service: "", urgency: "", description: "" },
  requestService: () => {},
};

const BookingContext = React.createContext<BookingContextValue>(defaultContext);

function useBooking() {
  return React.useContext(BookingContext);
}

function BookingProvider({ children }: { children: React.ReactNode }) {
  const [appointment, setAppointment] = useState(defaultContext.appointment);
  const requestService = (service: string, urgency: string, description: string) => {
    setAppointment({ service, urgency, description });
    document.querySelector("#request-service")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <BookingContext.Provider value={{ appointment, requestService }}>
      {children}
    </BookingContext.Provider>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#0B2545] text-white shadow-xl transition-transform hover:-translate-y-1 active:scale-95"
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#0B2545]/10 bg-[#0B2545] py-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="text-base font-extrabold tracking-tight">SmartPLUMBER Kenya</h4>
            <p className="mt-2 text-sm leading-relaxed text-[#CDE9FF]/80">
              NCA-certified master plumbers serving Nairobi, Kiambu, Nanyuki &amp Nyeri .
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#00C2FF]">Services</h4>
            <ul className="mt-3 space-y-2 text-sm text-[#CDE9FF]/80">
              <li>Emergency Repairs</li>
              <li>Solar Water Heaters</li>
              <li>Leak Detection</li>
              <li>Pipe Relining</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#00C2FF]">Coverage</h4>
            <ul className="mt-3 space-y-2 text-sm text-[#CDE9FF]/80">
              <li>Nairobi Metro</li>
              <li>Kiambu County</li>
              <li>Nanyuki County</li>
              <li>Nyeri County</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#00C2FF]">Contact</h4>
            <p className="mt-3 text-sm text-[#CDE9FF]/80">
              📞 +254 700875348<br />
              ✉️ info@smartplumber.co.ke<br />
              🕐 24/7 Emergency Line
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-[#CDE9FF]/50">
          © {new Date().getFullYear()} SmartPLUMBER Kenya. All rights reserved. | NCA License #NCA-PL-2026-8842
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-white font-sans text-[#0B2545] antialiased">
        <Navbar />
        <Hero context={useBooking()} />
        <TroubleshooterWidget context={useBooking()} />
        <ServiceExplorer context={useBooking()} />
        <GalleryShowcase context={useBooking()} />
        <WhyChooseUs />
        <ContactBookingSection context={useBooking()} />
        <Footer />
        <ScrollToTop />
      </div>
    </BookingProvider>
  );
}