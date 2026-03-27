import { useState, useCallback, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { projects } from '../../data/projects';
import type { Project } from '../../types/data';
import { CarouselCard } from './CarouselCard';
import { ProjectDetail } from './ProjectDetail';
import { sectionVariants, fadeUpVariant } from '../../styles/motion';

// Sort projects: featured first, then non-featured
const sortedProjects = [...projects].sort(
  (a, b) => Number(b.featured) - Number(a.featured),
);

/** Horizontal Embla carousel for project cards with drag/swipe, arrows, and dots. */
export function ProjectCarousel() {
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: false,
    loop: false,
    slidesToScroll: 1,
    duration: prefersReducedMotion ? 0 : 25,
  });

  // Arrow button visibility state
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Dot indicator state (mobile)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(
    () => emblaApi?.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi?.scrollNext(),
    [emblaApi],
  );

  // Subscribe to Embla events for button state and dot indicators
  useEffect(() => {
    if (!emblaApi) return;

    const updateState = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    // Initialize on mount
    setScrollSnaps(emblaApi.scrollSnapList());
    updateState();

    emblaApi.on('select', updateState);
    emblaApi.on('init', updateState);

    return () => {
      emblaApi.off('select', updateState);
      emblaApi.off('init', updateState);
    };
  }, [emblaApi]);

  return (
    <motion.section
      id="projects"
      role="region"
      aria-label="Projects"
      className="px-6 py-24"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="mx-auto max-w-5xl">
        <motion.h2
          className="text-2xl font-bold text-ink"
          variants={fadeUpVariant}
        >
          Projects
        </motion.h2>

        <motion.div className="relative mt-12" variants={fadeUpVariant}>
          {/* Prev arrow -- hidden on mobile, hidden when can't scroll prev */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center h-10 w-10 rounded-full bg-card shadow-md text-ink disabled:opacity-0 transition-opacity hover:bg-card/80"
            aria-label="Previous project"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Embla viewport -- no data-lenis-prevent; Embla uses pointer events, Lenis uses wheel events */}
          <div ref={emblaRef} className="overflow-hidden" style={{ overscrollBehaviorX: 'contain' }}>
            <div
              className="flex gap-4"
              style={{ touchAction: 'pan-y pinch-zoom' }}
            >
              {sortedProjects.map((project) => (
                <div
                  key={project.id}
                  className={
                    project.featured
                      ? 'flex-[0_0_85%] md:flex-[0_0_55%] min-w-0'
                      : 'flex-[0_0_85%] md:flex-[0_0_38%] min-w-0'
                  }
                >
                  <CarouselCard
                    project={project}
                    onClick={() => setDetailProject(project)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Next arrow -- hidden on mobile, hidden when can't scroll next */}
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center h-10 w-10 rounded-full bg-card shadow-md text-ink disabled:opacity-0 transition-opacity hover:bg-card/80"
            aria-label="Next project"
          >
            <ChevronRight size={20} />
          </button>
        </motion.div>

        {/* Dot indicators -- mobile only */}
        <div className="flex md:hidden justify-center gap-2 mt-4">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === selectedIndex ? 'bg-accent' : 'bg-silicon-200'
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Reuse existing ProjectDetail Dialog/Drawer */}
        <ProjectDetail
          project={detailProject}
          open={detailProject !== null}
          onOpenChange={(open) => {
            if (!open) setDetailProject(null);
          }}
        />
      </div>
    </motion.section>
  );
}
