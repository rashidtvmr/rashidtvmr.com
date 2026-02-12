'use client';

import { Flex, Text } from '@maximeheckel/design-system';
import {
  motion,
  AnimatePresence,
  PanInfo,
  useReducedMotion,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Book } from 'types/post';

const BOOK_W = 150;
const BOOK_H = 215;

/* ═══════════════════ Unified Carousel ═══════════════════ */

interface BookCarouselProps {
  books: Book[];
  type: 'reading' | 'completed';
  id: string;
}

const BookCarousel: React.FC<BookCarouselProps> = ({ books, type, id }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = books.length;
  const dragRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  /* Arrow key handler — works via event bubbling from any focused child */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    },
    [goNext, goPrev]
  );

  /* Mouse wheel navigation (shift+scroll or horizontal scroll) */
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let wheelTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleWheel = (e: WheelEvent) => {
      const delta = e.shiftKey ? e.deltaY : e.deltaX;
      if (delta === 0) return;
      e.preventDefault();
      if (wheelTimeout) return;
      if (delta > 0) {
        goNext();
      } else {
        goPrev();
      }
      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
      }, 250);
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [goNext, goPrev]);

  /* Swipe / drag handler */
  const handleDragEnd = useCallback(
    (_: any, info: PanInfo) => {
      const swipe = info.offset.x;
      const velocity = Math.abs(info.velocity.x);
      const threshold = velocity > 300 ? 20 : 50;
      if (swipe < -threshold) {
        goNext();
      } else if (swipe > threshold) {
        goPrev();
      }
    },
    [goNext, goPrev]
  );

  const getOffset = (i: number) => {
    let offset = i - activeIndex;
    if (offset > count / 2) offset -= count;
    if (offset < -count / 2) offset += count;
    return offset;
  };

  const VISIBLE_RANGE = 3;

  const springTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        type: 'spring' as const,
        stiffness: 280,
        damping: 28,
        mass: 0.9,
        restDelta: 0.001,
      };

  const liveRegionId = `${id}-live`;

  return (
    <div
      ref={containerRef}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${
        type === 'reading' ? 'Currently reading' : 'Completed'
      } books`}
      onKeyDown={handleKeyDown}
      style={{
        position: 'relative',
        width: '100%',
      }}
      className="bookshelf-carousel"
    >
      {/* Screen-reader live region */}
      <div
        id={liveRegionId}
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
        {`Book ${activeIndex + 1} of ${count}: ${books[activeIndex]?.title}`}
      </div>

      {/* Arrow buttons — hidden for mouse, visible on keyboard focus */}
      <button
        onClick={goPrev}
        aria-label="Previous book"
        className="bookshelf-nav-btn bookshelf-nav-btn--prev"
        style={{
          position: 'absolute',
          left: '8px',
          top: '50%',
          transform: 'translateY(-70%)',
          zIndex: 20,
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(8px)',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#fff',
          fontSize: '18px',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        onClick={goNext}
        aria-label="Next book"
        className="bookshelf-nav-btn bookshelf-nav-btn--next"
        style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-70%)',
          zIndex: 20,
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(8px)',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#fff',
          fontSize: '18px',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Carousel track – draggable */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        onDragStart={() => {
          dragRef.current = true;
        }}
        onDragEnd={(e, info) => {
          handleDragEnd(e, info);
          requestAnimationFrame(() => {
            dragRef.current = false;
          });
        }}
        style={{
          height: `${BOOK_H + 80}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: 'grab',
          touchAction: 'pan-y',
          userSelect: 'none',
        }}
        whileTap={{ cursor: 'grabbing' }}
        role="list"
        aria-label="Books"
      >
        {books.map((book, i) => {
          const offset = getOffset(i);
          const absOffset = Math.abs(offset);
          const isActive = offset === 0;
          const isVisible = absOffset <= VISIBLE_RANGE;

          const xPos = offset * 80;
          const scale = prefersReducedMotion
            ? isActive
              ? 1
              : 0.85
            : isActive
            ? 1
            : Math.max(1 - absOffset * 0.12, 0.55);
          const opacity = isVisible
            ? isActive
              ? 1
              : Math.max(1 - absOffset * 0.25, 0.15)
            : 0;
          const zIndex = 10 - absOffset;
          const rotateY = prefersReducedMotion ? 0 : offset * -5;

          return (
            <motion.div
              key={book.slug}
              role="listitem"
              aria-label={book.title}
              aria-current={isActive ? 'true' : undefined}
              layout={false}
              style={{
                position: 'absolute',
                width: `${BOOK_W}px`,
                height: `${BOOK_H}px`,
                borderRadius: '8px',
                overflow: 'visible',
                pointerEvents: isActive ? 'auto' : 'none',
                willChange: prefersReducedMotion
                  ? 'auto'
                  : 'transform, opacity',
              }}
              animate={{
                x: xPos,
                scale,
                opacity,
                zIndex,
                rotateY,
              }}
              transition={springTransition}
            >
              <Link
                href={`/posts/${type}/${book.slug}`}
                onClick={(e) => {
                  if (dragRef.current) e.preventDefault();
                }}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                tabIndex={isActive ? 0 : -1}
                aria-label={`${book.title}${
                  isActive ? '' : ' (use arrow keys to navigate)'
                }`}
                className="bookshelf-book-link"
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  outline: 'none',
                }}
              >
                <Image
                  src={book.cover}
                  alt=""
                  fill
                  style={{
                    objectFit: 'cover',
                    borderRadius: '8px',
                    boxShadow: isActive
                      ? '0 12px 32px rgba(0,0,0,0.45)'
                      : '0 4px 16px rgba(0,0,0,0.2)',
                    transition: 'box-shadow 0.35s ease',
                    pointerEvents: 'none',
                  }}
                  sizes="150px"
                  draggable={false}
                />
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Dots indicator — proper buttons */}
      <div
        role="tablist"
        aria-label="Book navigation"
        style={{
          display: 'flex',
          gap: '6px',
          justifyContent: 'center',
          paddingTop: '4px',
        }}
      >
        {books.map((book, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Go to book ${i + 1}: ${book.title}`}
            onClick={() => setActiveIndex(i)}
            className="bookshelf-dot"
            style={{
              width: i === activeIndex ? '18px' : '6px',
              height: '6px',
              borderRadius: '3px',
              cursor: 'pointer',
              border: 'none',
              padding: 0,
              background:
                i === activeIndex
                  ? 'var(--accent, #3b82f6)'
                  : 'var(--text-tertiary, rgba(150,150,150,0.4))',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        ))}
      </div>

      {/* Active book title */}
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={activeIndex}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={
            prefersReducedMotion
              ? { duration: 0.05 }
              : { duration: 0.22, ease: [0.4, 0, 0.2, 1] }
          }
          style={{
            minHeight: '100px',
            textAlign: 'center',
            paddingTop: '12px',
          }}
          aria-hidden="true"
        >
          <Text size="2" weight="4" css={{ color: 'var(--text-primary)' }}>
            {books[activeIndex]?.title}
          </Text>
        </motion.div>
      </AnimatePresence>

      {/* Scoped styles for a11y */}
      <style jsx global>{`
        /* Nav buttons: hidden by default, visible on keyboard focus */
        .bookshelf-nav-btn {
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .bookshelf-nav-btn:focus-visible {
          opacity: 1;
          outline: 2px solid var(--accent, #3b82f6);
          outline-offset: 2px;
        }
        .bookshelf-nav-btn:focus:not(:focus-visible) {
          outline: none;
          opacity: 0;
        }

        /* Book link focus indicator */
        .bookshelf-book-link:focus-visible {
          box-shadow: 0 0 0 3px var(--accent, #3b82f6);
          border-radius: 8px;
        }
        .bookshelf-book-link:focus:not(:focus-visible) {
          box-shadow: none;
        }

        /* Dot focus indicator */
        .bookshelf-dot:focus-visible {
          outline: 2px solid var(--accent, #3b82f6);
          outline-offset: 2px;
        }
        .bookshelf-dot:focus:not(:focus-visible) {
          outline: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .bookshelf-carousel *,
          .bookshelf-carousel *::before,
          .bookshelf-carousel *::after {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

/* ═══════════════════════ MAIN EXPORT ═══════════════════════ */

interface BookShelfProps {
  title: string;
  books: Book[];
  type: 'reading' | 'completed';
}

const BookShelf: React.FC<BookShelfProps> = ({ title, books, type }) => {
  const carouselId = `bookshelf-${type}`;

  return (
    <Flex direction="column" gap="4" alignItems="flex-start">
      <Text
        as="h3"
        id={carouselId}
        size="1"
        weight="4"
        css={{
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          color: 'var(--text-tertiary, rgba(150,150,150,0.6))',
          textAlign: 'left',
        }}
      >
        {title}
      </Text>
      <BookCarousel books={books} type={type} id={carouselId} />
    </Flex>
  );
};

export default BookShelf;
