'use client';

import { Flex, Text } from '@maximeheckel/design-system';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
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
}

const BookCarousel: React.FC<BookCarouselProps> = ({ books, type }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = books.length;
  const dragRef = useRef(false);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  /* Keyboard navigation */
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    el.addEventListener('keydown', handler);
    return () => el.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  /* Mouse wheel navigation (shift+scroll or horizontal scroll) */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let wheelTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleWheel = (e: WheelEvent) => {
      // Use deltaX for horizontal scroll, or deltaY when shift is held
      const delta = e.shiftKey ? e.deltaY : e.deltaX;
      if (delta === 0) return;
      e.preventDefault();
      // Debounce to avoid rapid-fire navigation
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
      // Lower threshold if velocity is high (quick flick)
      const threshold = velocity > 300 ? 20 : 50;
      if (swipe < -threshold) {
        goNext();
      } else if (swipe > threshold) {
        goPrev();
      }
    },
    [goNext, goPrev]
  );

  /**
   * For each book, compute its shortest-path offset from activeIndex.
   * This allows wrapping (circular) and keeps each element with a
   * STABLE key so framer-motion animates position instead of remounting.
   */
  const getOffset = (i: number) => {
    let offset = i - activeIndex;
    // Wrap to shortest path around the circle
    if (offset > count / 2) offset -= count;
    if (offset < -count / 2) offset += count;
    return offset;
  };

  const VISIBLE_RANGE = 3;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      style={{
        position: 'relative',
        width: '100%',
        outline: 'none',
      }}
    >
      {/* Arrow buttons – visible on hover / pointer devices */}
      <button
        onClick={goPrev}
        aria-label="Previous book"
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
          opacity: 0.7,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
      >
        ‹
      </button>
      <button
        onClick={goNext}
        aria-label="Next book"
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
          opacity: 0.7,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
      >
        ›
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
          // Reset drag flag after a tick so click handlers can check it
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
      >
        {books.map((book, i) => {
          const offset = getOffset(i);
          const absOffset = Math.abs(offset);
          const isActive = offset === 0;
          const isVisible = absOffset <= VISIBLE_RANGE;

          // iOS-style positioning: center item is full size,
          // neighbours fan out with decreasing scale & opacity
          const xPos = offset * 80;
          const scale = isActive ? 1 : Math.max(1 - absOffset * 0.12, 0.55);
          const opacity = isVisible
            ? isActive
              ? 1
              : Math.max(1 - absOffset * 0.25, 0.15)
            : 0;
          const zIndex = 10 - absOffset;
          // Subtle 3D rotation for depth
          const rotateY = offset * -5;

          return (
            <motion.div
              key={book.slug}
              layout={false}
              style={{
                position: 'absolute',
                width: `${BOOK_W}px`,
                height: `${BOOK_H}px`,
                borderRadius: '8px',
                overflow: 'hidden',
                pointerEvents: isActive ? 'auto' : 'none',
                willChange: 'transform, opacity',
              }}
              animate={{
                x: xPos,
                scale,
                opacity,
                zIndex,
                rotateY,
              }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 28,
                mass: 0.9,
                // Slightly stagger non-active for depth feel
                restDelta: 0.001,
              }}
            >
              <Link
                href={`/posts/${type}/${book.slug}`}
                onClick={(e) => {
                  // Prevent navigation if user was dragging
                  if (dragRef.current) e.preventDefault();
                }}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={book.cover}
                  alt={book.title}
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

      {/* Dots indicator */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          justifyContent: 'center',
          paddingTop: '4px',
        }}
      >
        {books.map((_, i) => (
          <div
            key={i}
            onClick={() => setActiveIndex(i)}
            style={{
              width: i === activeIndex ? '18px' : '6px',
              height: '6px',
              borderRadius: '3px',
              cursor: 'pointer',
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
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{
            duration: 0.22,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{
            minHeight: '100px',
            textAlign: 'center',
            paddingTop: '12px',
          }}
        >
          <Text size="2" weight="4" css={{ color: 'var(--text-primary)' }}>
            {books[activeIndex]?.title}
          </Text>
        </motion.div>
      </AnimatePresence>
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
  return (
    <Flex direction="column" gap="4" alignItems="flex-start">
      <Text
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
      <BookCarousel books={books} type={type} />
    </Flex>
  );
};

export default BookShelf;
