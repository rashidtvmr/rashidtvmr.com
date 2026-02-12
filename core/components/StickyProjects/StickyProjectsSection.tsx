'use client';

import { Flex, Text } from '@maximeheckel/design-system';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import Image from 'next/image';
import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface Project {
  title: string;
  category: string;
  date: string;
  description: string;
  image?: string;
  bg: string;
  link: string;
}

export const PROJECTS: Project[] = [
  {
    title: 'PureInsight™',
    category: 'React',
    date: '2020-2026',
    description: `Played a key role in the project's development from the start, establishing the initial codebase and ensuring quality through detailed code reviews. Actively picked up tasks and fixed bugs to maintain project progress. Regularly updated all packages to their latest versions, significantly boosting performance by implementing static pre-rendering for pages. Consistently followed best SEO practices and maintained Core Web Vitals (CWV) scores. Integrated Google Analytics. Managed significant React upgrades from version 16 to 17, then to 18.`,
    image: '/static/images/optimized/pi.webp',
    bg: 'linear-gradient(135deg, #14328c 0%, #2470c2 100%)',
    link: 'https://pureinsight.pureencapsulationspro.com/',
  },
  {
    title: 'Tyme',
    category: 'Frontend Architect (React)',
    date: '2025-2026',
    description:
      'A comprehensive platform for educational institutes, featuring advanced course management, interactive learning modules, and seamless user experiences built with React and modern web technologies.',
    image: '/static/images/optimized/tyme.webp',
    bg: 'linear-gradient(135deg, #0f67fe 0%, #fff 100%)',
    link: 'https://development.tymeinstitute.com/',
  },
  {
    title: 'Rialto',
    category: 'React',
    date: '2025',
    description:
      'A headless ecommerce engine built using React and Ruby on Rails, designed to be integrated into all Pure platforms for scalable and flexible online retail solutions.',
    bg: 'linear-gradient(135deg, #14328c 0%, #2470c2 100%)',
    link: 'https://pureinsight.pureencapsulationspro.com/',
  },
  {
    title: 'Keep Learning LMS',
    category: 'React',
    date: '2022',
    description:
      'A Learning Management System for intranet use, built using React and RTK Query to provide efficient course delivery and user tracking within corporate environments.',
    bg: 'linear-gradient(135deg, #212529 0%, #000 100%)',
    link: '#',
  },
  {
    title: 'Pure Patient Direct',
    category: 'React',
    date: '2023',
    image: '/static/images/optimized/ppd.webp',
    description:
      'A headless ecommerce engine built using React and Ruby on Rails, designed to be integrated into all Pure platforms for streamlined patient access to products.',
    bg: 'linear-gradient(135deg, #14328c 0%, #2470c2 100%)',
    link: 'https://patientdirect.pureencapsulationspro.com/',
  },
  {
    title: 'Pure Encapsulations Pro',
    category: 'VueJS',
    date: '2023',
    image: '/static/images/optimized/purepro.webp',
    description:
      'A headless ecommerce engine built using Vue.js and Ruby on Rails, designed to be integrated into all Pure platforms for professional-grade product management.',
    bg: 'linear-gradient(135deg, #14328c 0%, #2470c2 100%)',
    link: 'https://patientdirect.pureencapsulationspro.com/',
  },
  {
    title: 'Shareandremember',
    category: 'Frontend Team Lead',
    date: '2022-2023',
    image: '/static/images/optimized/srm.webp',
    description:
      'A platform for sharing and preserving memories, built using React and Ruby on Rails, focusing on user-generated content and intuitive frontend experiences.',
    bg: 'linear-gradient(135deg, #14328c 0%, #6e8b3d 100%)',
    link: 'https://shareandremember.com/',
  },
];

/** iOS-style tick sound using Web Audio API. */
const useTickSound = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTick = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(3200, now);
      osc1.frequency.exponentialRampToValueAtTime(800, now + 0.015);
      gain1.gain.setValueAtTime(0.4, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.04);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(150, now);
      gain2.gain.setValueAtTime(0.25, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.035);
    } catch {
      /* silent */
    }
  }, []);

  return playTick;
};

/* ────────────────────────────────────────────────────────────── */

const StickyProjectsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const prevIndexRef = useRef(0);
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);
  const playTick = useTickSound();
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    mass: 0.8,
  });

  useEffect(() => {
    const unsubscribe = smoothProgress.onChange((latest: number) => {
      // Don't override active index when user is navigating via keyboard
      if (isKeyboardNav) return;
      const index = Math.min(
        Math.floor(latest * PROJECTS.length),
        PROJECTS.length - 1
      );
      if (index !== prevIndexRef.current) {
        prevIndexRef.current = index;
        setActiveIndex(index);
        playTick();
      }
    });
    return () => unsubscribe();
  }, [smoothProgress, playTick, isKeyboardNav]);

  // Reset keyboard nav mode after a delay so scroll can take over again
  useEffect(() => {
    if (!isKeyboardNav) return;
    const timer = setTimeout(() => setIsKeyboardNav(false), 2000);
    return () => clearTimeout(timer);
  }, [isKeyboardNav, activeIndex]);

  /** Keyboard handler for roving tabindex (arrow key navigation) */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let newIndex = activeIndex;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          newIndex = Math.min(activeIndex + 1, PROJECTS.length - 1);
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = Math.max(activeIndex - 1, 0);
          break;
        case 'Home':
          e.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          newIndex = PROJECTS.length - 1;
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (PROJECTS[activeIndex].link !== '#') {
            window.open(PROJECTS[activeIndex].link, '_blank', 'noopener');
          }
          return;
        default:
          return;
      }

      if (newIndex !== activeIndex) {
        setIsKeyboardNav(true);
        setActiveIndex(newIndex);
        prevIndexRef.current = newIndex;
        playTick();
        // Move focus to the new active item
        itemRefs.current[newIndex]?.focus();
      }
    },
    [activeIndex, playTick]
  );

  const activeProject = PROJECTS[activeIndex];

  const springTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 400, damping: 35, mass: 0.5 };

  return (
    <section
      ref={sectionRef}
      aria-label="Projects I've worked on"
      style={{
        height: `${PROJECTS.length * 45}vh`,
        position: 'relative',
      }}
    >
      {/* Screen-reader live region for announcing active project */}
      <div
        aria-live="polite"
        aria-atomic="true"
        role="status"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {`Project ${activeIndex + 1} of ${PROJECTS.length}: ${
          activeProject.title
        }, ${activeProject.category}, ${activeProject.date}`}
      </div>

      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'var(--font-display)',
        }}
      >
        {/* ── Animated backgrounds ── */}
        {PROJECTS.map((project, i) => (
          <motion.div
            key={`bg-${i}`}
            aria-hidden="true"
            animate={{ opacity: i === activeIndex ? 1 : 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.6, ease: 'easeInOut' }
            }
            style={{
              position: 'absolute',
              inset: 0,
              background: project.bg,
              zIndex: 0,
            }}
          />
        ))}

        {/* ── Header ── */}
        <div
          style={{
            position: 'absolute',
            top: '5.5rem',
            left: '1.5rem',
            right: '1.5rem',
            zIndex: 5,
          }}
        >
          <Text
            as="h2"
            size="2"
            css={{
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            Projects I&apos;ve worked on
          </Text>
        </div>

        {/* ── Content area ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '0 1.5rem',
            overflow: 'hidden',
          }}
        >
          {/* Top fade */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '25%',
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />
          {/* Bottom fade */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '25%',
              background:
                'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />

          {/* Highlight band at center */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '1rem',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              height: 'clamp(68px, 11vw, 96px)',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '12px',
              borderTop: '1px solid rgba(255,255,255,0.12)',
              borderBottom: '1px solid rgba(255,255,255,0.12)',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />

          {/* Names list — roving tabindex listbox pattern */}
          <div
            ref={listRef}
            role="listbox"
            aria-label="Project list"
            aria-activedescendant={`project-item-${activeIndex}`}
            onKeyDown={handleKeyDown}
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              outline: 'none',
            }}
          >
            {PROJECTS.map((project, index) => {
              const distance = index - activeIndex;
              const absDistance = Math.abs(distance);
              const rowHeight = 'clamp(68px, 11vw, 96px)';

              // Y offset: each item is one row away from center
              const yOffset = distance * 110;

              const opacity = Math.max(1 - absDistance * 0.35, 0.05);
              const scale = prefersReducedMotion
                ? 1
                : Math.max(1 - absDistance * 0.06, 0.75);
              const blur = prefersReducedMotion
                ? 0
                : Math.min(absDistance * 2, 5);
              const isActive = index === activeIndex;

              return (
                <motion.div
                  key={project.title}
                  id={`project-item-${index}`}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  role="option"
                  aria-selected={isActive}
                  aria-label={`${project.title}, ${project.category}, ${project.date}`}
                  tabIndex={isActive ? 0 : -1}
                  onFocus={() => {
                    setIsKeyboardNav(true);
                    if (index !== activeIndex) {
                      setActiveIndex(index);
                      prevIndexRef.current = index;
                      playTick();
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: '50%',
                    height: rowHeight,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(0.5rem, 2vw, 1rem)',
                    paddingLeft: '0.5rem',
                    transformOrigin: 'left center',
                    willChange: prefersReducedMotion
                      ? 'auto'
                      : 'transform, opacity, filter',
                    outline: 'none',
                  }}
                  animate={{
                    y: `calc(-50% + ${yOffset}px)`,
                    opacity,
                    scale,
                    filter: `blur(${blur}px)`,
                  }}
                  transition={springTransition}
                >
                  {/* Focus ring — visible only on keyboard focus */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: '-4px',
                      borderRadius: '10px',
                      border: '2px solid transparent',
                      pointerEvents: 'none',
                      transition: 'border-color 0.15s ease',
                      ...(isActive ? {} : {}),
                    }}
                    className="project-focus-ring"
                  />

                  {/* Indicator bar */}
                  <motion.div
                    aria-hidden="true"
                    style={{
                      width: '3px',
                      borderRadius: '2px',
                      background: 'rgba(255,255,255,0.8)',
                      alignSelf: 'stretch',
                      flexShrink: 0,
                    }}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      scaleY: isActive ? 1 : 0.3,
                    }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : {
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                          }
                    }
                  />

                  {/* Title + Category stacked */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <motion.span
                      style={{
                        fontSize: 'clamp(1.4rem, 4vw, 3.5rem)',
                        fontWeight: 700,
                        lineHeight: 1.15,
                        letterSpacing: '-0.02em',
                        color: '#fff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {project.title}
                    </motion.span>

                    <motion.span
                      style={{
                        fontSize: 'clamp(0.55rem, 1.2vw, 0.8rem)',
                        color: 'rgba(255,255,255,0.75)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '2px',
                      }}
                      animate={{
                        opacity: isActive ? 0.9 : 0.5,
                      }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : {
                              type: 'spring',
                              stiffness: 500,
                              damping: 30,
                            }
                      }
                    >
                      {project.category}
                    </motion.span>
                  </div>

                  <motion.span
                    style={{
                      fontSize: 'clamp(0.6rem, 1vw, 0.85rem)',
                      color: 'rgba(255,255,255,0.75)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      paddingRight: '0.5rem',
                    }}
                    animate={{
                      opacity: isActive ? 0.85 : 0,
                      x: isActive ? 0 : 8,
                    }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : {
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                          }
                    }
                  >
                    [{project.date}]
                  </motion.span>
                </motion.div>
              );
            })}
          </div>

          {/* ── Image / Description card — bottom right ── */}
          <div
            style={{
              position: 'absolute',
              bottom: '2rem',
              right: '1.5rem',
              zIndex: 4,
              width: 'clamp(200px, 25vw, 360px)',
              height: 'clamp(120px, 15vw, 180px)',
              borderRadius: '12px',
              overflow: 'visible',
            }}
          >
            <AnimatePresence exitBeforeEnter>
              {activeProject.link !== '#' ? (
                <motion.a
                  key={activeIndex}
                  href={activeProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${activeProject.title} project`}
                  initial={
                    prefersReducedMotion
                      ? false
                      : { opacity: 0, scale: 0.9, y: 16 }
                  }
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.95, y: -10 }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.15 }
                      : {
                          type: 'spring',
                          stiffness: 400,
                          damping: 28,
                          mass: 0.5,
                        }
                  }
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    inset: 0,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    overflow: 'hidden',
                  }}
                  className="project-card-link"
                >
                  {/* Focus ring */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: '-4px',
                      borderRadius: '16px',
                      border: '2px solid transparent',
                      pointerEvents: 'none',
                      transition: 'border-color 0.15s ease',
                    }}
                    className="project-focus-ring"
                  />
                  {activeProject.image ? (
                    <Image
                      src={activeProject.image}
                      alt={`Screenshot of ${activeProject.title}`}
                      fill
                      style={{ objectFit: 'cover', borderRadius: '12px' }}
                    />
                  ) : (
                    <Flex
                      direction="column"
                      gap="2"
                      css={{
                        textAlign: 'center',
                        padding: '1rem',
                        overflow: 'hidden',
                      }}
                    >
                      <Text size="3" weight="4" css={{ color: '#fff' }}>
                        {activeProject.title}
                      </Text>
                      <Text
                        size="1"
                        css={{
                          color: 'rgba(255,255,255,0.85)',
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {activeProject.description}
                      </Text>
                    </Flex>
                  )}
                </motion.a>
              ) : (
                <motion.div
                  key={activeIndex}
                  role="img"
                  aria-label={`${activeProject.title} — ${activeProject.description}`}
                  initial={
                    prefersReducedMotion
                      ? false
                      : { opacity: 0, scale: 0.9, y: 16 }
                  }
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.95, y: -10 }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.15 }
                      : {
                          type: 'spring',
                          stiffness: 400,
                          damping: 28,
                          mass: 0.5,
                        }
                  }
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    inset: 0,
                  }}
                >
                  {/* Focus ring */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: '-4px',
                      borderRadius: '16px',
                      border: '2px solid transparent',
                      pointerEvents: 'none',
                      transition: 'border-color 0.15s ease',
                    }}
                    className="project-focus-ring"
                  />
                  <Flex
                    direction="column"
                    gap="2"
                    css={{
                      textAlign: 'center',
                      padding: '1rem',
                      overflow: 'hidden',
                    }}
                  >
                    <Text size="3" weight="4" css={{ color: '#fff' }}>
                      {activeProject.title}
                    </Text>
                    <Text
                      size="1"
                      css={{
                        color: 'rgba(255,255,255,0.85)',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {activeProject.description}
                    </Text>
                  </Flex>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Scroll hint */}
          <div
            style={{
              position: 'absolute',
              bottom: '0.75rem',
              left: '1.5rem',
              zIndex: 4,
            }}
          >
            <motion.div
              animate={prefersReducedMotion ? {} : { opacity: [0.3, 0.6, 0.3] }}
              transition={
                prefersReducedMotion
                  ? {}
                  : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <Text size="1" css={{ color: 'rgba(255,255,255,0.7)' }}>
                ↕ Scroll or use arrow keys to explore
              </Text>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Global focus styles for this component */}
      <style jsx global>{`
        [role='option']:focus-visible .project-focus-ring {
          border-color: rgba(255, 255, 255, 0.9) !important;
        }
        .project-card-link:focus-visible {
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.9);
        }
        .project-card-link:focus:not(:focus-visible) {
          box-shadow: none;
        }
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default StickyProjectsSection;
