import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  MapPin,
  X,
  Wrench,
  Clock,
  Calendar,
  ArrowRight,
  Layers,
} from "lucide-react";
import { GALLERY_PROJECTS, GALLERY_CATEGORIES } from "../data/galleryData";
import type { GalleryProject, GalleryCategory } from "../types";
import type { BookingContextValue } from "../App";

type FilterOption = "All" | GalleryCategory;

export function GalleryShowcase({ context }: { context: BookingContextValue }) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
  const [selectedProject, setSelectedProject] = useState<GalleryProject | null>(null);
  const [compareMode, setCompareMode] = useState<"before" | "after">("after");

  const filtered =
    activeFilter === "All"
      ? GALLERY_PROJECTS
      : GALLERY_PROJECTS.filter((p) => p.category === activeFilter);

  const filters: FilterOption[] = ["All", ...GALLERY_CATEGORIES];

  const handleBook = (project: GalleryProject) => {
    context.requestService(
      project.category,
      "medium",
      `I saw your "${project.title}" project and would like similar work. Location reference: ${project.location}.`
    );
    setSelectedProject(null);
  };

  return (
    <section id="gallery" className="relative overflow-hidden bg-[#0B2545] py-20 sm:py-28">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#00C2FF]/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#00A8E8]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00C2FF]/20 bg-[#00C2FF]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#00C2FF]">
            <Camera className="h-3.5 w-3.5" />
            Project Gallery
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Our Plumbing Work
            <span className="block text-[#00C2FF]">Showcase</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#CDE9FF]/70">
            Browse completed projects across water storage, drainage, bathroom piping,
            solar heating, and commercial installations. Every job backed by our warranty.
          </p>
        </motion.div>

        {/* Filter Pills */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                activeFilter === f
                  ? "bg-[#00C2FF] text-[#0B2545] shadow-lg shadow-[#00C2FF]/25"
                  : "border border-white/10 bg-white/5 text-[#CDE9FF]/80 hover:bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-[#00C2FF]/30 hover:shadow-xl hover:shadow-[#00C2FF]/10"
                onClick={() => {
                  setSelectedProject(project);
                  setCompareMode("after");
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#00C2FF]/20 px-2.5 py-0.5 text-[11px] font-semibold text-[#7DD3FC] backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.beforeImage && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase text-white backdrop-blur-sm">
                      <Layers className="h-3 w-3" />
                      Before/After
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-white leading-tight">
                    {project.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-[#CDE9FF]/60">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {project.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {project.duration}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal / Lightbox */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#0B2545] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Image area */}
              <div className="relative aspect-[16/9] overflow-hidden">
                {selectedProject.beforeImage && selectedProject.afterImage ? (
                  <>
                    <img
                      src={
                        compareMode === "before"
                          ? selectedProject.beforeImage
                          : selectedProject.afterImage
                      }
                      alt={selectedProject.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1 rounded-full bg-black/60 p-1 backdrop-blur-sm">
                      <button
                        onClick={() => setCompareMode("before")}
                        className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                          compareMode === "before"
                            ? "bg-[#00C2FF] text-[#0B2545]"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        Before
                      </button>
                      <button
                        onClick={() => setCompareMode("after")}
                        className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                          compareMode === "after"
                            ? "bg-[#00C2FF] text-[#0B2545]"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        After
                      </button>
                    </div>
                  </>
                ) : (
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00C2FF]">
                      {selectedProject.category}
                    </span>
                    <h3 className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
                      {selectedProject.title}
                    </h3>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#CDE9FF]/80">
                    <MapPin className="h-3 w-3" />
                    {selectedProject.location}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-[#CDE9FF]/70">
                  {selectedProject.description}
                </p>

                {/* Specs Grid */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {selectedProject.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="rounded-xl border border-white/5 bg-white/5 p-3"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#00C2FF]/70">
                        {spec.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Meta row */}
                <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-[#CDE9FF]/60">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Duration: {selectedProject.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Completed: {selectedProject.completionDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5" />
                    Materials: {selectedProject.materials.join(", ")}
                  </span>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#00C2FF]/10 px-3 py-1 text-xs font-semibold text-[#7DD3FC]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleBook(selectedProject)}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00C2FF] px-6 py-3.5 text-sm font-bold text-[#0B2545] shadow-lg shadow-[#00C2FF]/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#00C2FF]/30 active:scale-[0.98]"
                >
                  <ArrowRight className="h-4 w-4" />
                  Book Similar Project
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
