/* eslint-disable react/no-unescaped-entities */
import {
  Button,
  Flex,
  Grid,
  Icon,
  Text,
  VisuallyHidden,
  H1,
  H2,
} from '@maximeheckel/design-system';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@core/layout';
import { getAllFilesFrontMatter, getBooks } from 'lib/mdx';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { templateColumnsMedium } from 'styles/grid';
import { Book } from 'types/post';

const WavingHand = () => (
  <motion.div
    style={{
      marginBottom: '-20px',
      marginRight: '-45px',
      paddingBottom: '20px',
      paddingRight: '45px',
      display: 'inline-block',
    }}
    animate={{ rotate: 20 }}
    transition={{
      repeat: 7,
      repeatType: 'mirror',
      duration: 0.2,
      delay: 0.5,
      ease: 'easeInOut',
      type: 'tween',
    }}
  >
    👋🏻
  </motion.div>
);

const PROJECTS = [
  {
    title: 'PureInsight™ ',
    category: 'React',
    date: '2020-2026',
    description: `Played a key role in the project's development from the start, establishing the initial codebase and ensuring quality through detailed code reviews. Actively picked up tasks and fixed bugs to maintain project progress. Regularly updated all packages to their latest versions, significantly boosting performance by implementing static pre-rendering for pages. Consistently followed best SEO practices and maintained Core Web Vitals (CWV) scores. Integrated Google Analytics. Managed significant React upgrades from version 16 to 17, then to 18.`,
    image: '/static/images/pi.png',
    bg: 'linear-gradient(135deg, #14328c 0%, #2470c2 100%)',
    link: 'https://pureinsight.pureencapsulationspro.com/',
  },
  {
    title: 'Tyme',
    category: 'Frontend Architect (React)',
    date: '2025-2026',
    description: 'Short description of the project. Replace with your own.',
    image: '/static/images/tyme.png',
    bg: 'linear-gradient(135deg, #0f67fe 0%, #fff 100%)',
    link: 'https://development.tymeinstitute.com/',
  },
  {
    title: 'Rialto',
    category: 'React',
    date: '2025',
    description:
      'Headless ecommerce engine build using react and ror to be integrated into all pure platform',
    bg: 'linear-gradient(135deg, #14328c 0%, #2470c2 100%)',
    link: 'https://pureinsight.pureencapsulationspro.com/',
  },
  {
    title: 'Keep Learning LMS',
    category: 'React',
    date: '2022',
    description:
      'Headless ecommerce engine build using react and ror to be integrated into all pure platform',
    bg: 'linear-gradient(135deg, #212529 0%, #fff 100%)',
    link: '#',
  },
  {
    title: 'Pure Patient Direct',
    category: 'React',
    date: '2023',
    image: '/static/images/ppd.png',
    description:
      'Headless ecommerce engine build using react and ror to be integrated into all pure platform',
    bg: 'linear-gradient(135deg, #14328c 0%, #2470c2 100%)',
    link: 'https://patientdirect.pureencapsulationspro.com/',
  },

  {
    title: 'Pure Encapsulations Pro',
    category: 'VueJS',
    date: '2023',
    image: '/static/images/purepro.png',
    description:
      'Headless ecommerce engine build using react and ror to be integrated into all pure platform',
    bg: 'linear-gradient(135deg, #14328c 0%, #2470c2 100%)',
    link: 'https://patientdirect.pureencapsulationspro.com/',
  },
  {
    title: 'Shareandremember',
    category: 'Frontend Team Lead',
    date: '2022-2023',
    description:
      'Headless ecommerce engine build using react and ror to be integrated into all pure platform',
    bg: 'linear-gradient(135deg, #14328c 0%, #6e8b3d 100%)',
    link: 'https://shareandremember.com/',
  },
];

/**
 * iOS-style tick sound using Web Audio API.
 * Short percussive click — like the UIPickerView haptic.
 */
const useTickSound = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTick = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;

      // AudioContext starts suspended in most browsers — must resume
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Tick 1: sharp click
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

      // Tick 2: low thud layered underneath
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
      // Silent fail — audio not supported
    }
  }, []);

  return playTick;
};

/**
 * Maps distance from active index to iOS picker-wheel style transforms.
 * Items close to active are large/opaque, far items shrink and fade.
 */
const getPickerStyles = (index: number, activeIndex: number) => {
  const distance = index - activeIndex;
  const absDistance = Math.abs(distance);

  // iOS picker: active item is 1x, neighbors shrink progressively
  const scale = Math.max(1 - absDistance * 0.08, 0.7);
  // Opacity falls off with distance
  const opacity = Math.max(1 - absDistance * 0.3, 0.08);
  // Slight vertical offset for 3D wheel illusion
  const y = distance * 2;
  // Blur far items
  const blur = Math.min(absDistance * 1.5, 4);

  return { scale, opacity, y, blur };
};

const StickyProjectsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorTop, setIndicatorTop] = useState(0);
  const [indicatorHeight, setIndicatorHeight] = useState(0);
  const prevIndexRef = useRef(0);
  const playTick = useTickSound();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // iOS-style spring smoothing on the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 500,
    damping: 45,
    mass: 0.5,
  });

  useEffect(() => {
    const unsubscribe = smoothProgress.onChange((latest: number) => {
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
  }, [smoothProgress, playTick]);

  // Measure actual item position relative to sticky container
  useEffect(() => {
    const item = itemRefs.current[activeIndex];
    const container = stickyRef.current;
    if (item && container) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      setIndicatorTop(itemRect.top - containerRect.top);
      setIndicatorHeight(itemRect.height);
    }
  }, [activeIndex]);

  return (
    <div
      ref={sectionRef}
      style={{
        height: `${PROJECTS.length * 40}vh`,
        position: 'relative',
      }}
    >
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '0 1rem',
        }}
      >
        {/* Stacked backgrounds — all rendered, only active one is visible */}
        {PROJECTS.map((project, index) => (
          <motion.div
            key={`bg-${index}`}
            animate={{ opacity: index === activeIndex ? 1 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              background: project.bg,
              zIndex: 0,
            }}
          />
        ))}

        {/* Section header */}
        <div
          style={{
            position: 'absolute',
            top: '2rem',
            left: '1rem',
            right: '1rem',
            zIndex: 2,
          }}
        >
          <Text
            size="2"
            css={{
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            Projects I&apos;ve worked on
          </Text>
        </div>

        {/* Project list — left side, iOS picker style */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            maxWidth: '65%',
            paddingTop: '4rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {PROJECTS.map((project, index) => {
            const isActive = index === activeIndex;
            const { scale, opacity, y, blur } = getPickerStyles(
              index,
              activeIndex
            );

            return (
              <motion.div
                key={project.title}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                style={{
                  padding: '1rem 0',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '1.5rem',
                  cursor: 'default',
                  transformOrigin: 'left center',
                  willChange: 'transform, opacity, filter',
                }}
                animate={{
                  opacity,
                  scale,
                  y,
                  filter: `blur(${blur}px)`,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 600,
                  damping: 35,
                  mass: 0.4,
                }}
              >
                <motion.span
                  style={{
                    fontSize: 'clamp(1.8rem, 4.5vw, 4rem)',
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    paddingLeft: '.5em',
                  }}
                >
                  {project.title}
                </motion.span>

                {/* Category — slides in from right on active */}
                <motion.span
                  style={{
                    fontSize: 'clamp(0.7rem, 1.1vw, 0.85rem)',
                    color: 'rgba(255,255,255,0.7)',
                    whiteSpace: 'nowrap',
                  }}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    x: isActive ? 0 : -8,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                >
                  {project.category}
                </motion.span>

                {/* Date — right aligned */}
                <motion.span
                  style={{
                    fontSize: 'clamp(0.7rem, 1.1vw, 0.85rem)',
                    color: 'rgba(255,255,255,0.5)',
                    whiteSpace: 'nowrap',
                    marginLeft: 'auto',
                  }}
                  animate={{
                    opacity: isActive ? 0.6 : 0,
                    x: isActive ? 0 : 8,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                >
                  [{project.date}]
                </motion.span>
              </motion.div>
            );
          })}
        </div>

        {/* Active indicator line */}
        <motion.div
          style={{
            position: 'absolute',
            left: '1rem',
            width: '3px',
            borderRadius: '2px',
            background: 'rgba(255,255,255,0.8)',
            zIndex: 1,
          }}
          animate={{
            top: indicatorTop,
            height: indicatorHeight,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 35,
            mass: 0.5,
          }}
        />

        {/* Project image — bottom right, glass card */}
        <div
          style={{
            position: 'absolute',
            bottom: '3rem',
            right: '1rem',
            width: 'clamp(180px, 22vw, 320px)',
            height: 'clamp(180px, 22vw, 120px)',
            borderRadius: '16px',
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -15 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
                mass: 0.5,
              }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              {PROJECTS[activeIndex]?.image ? (
                <Image
                  onClick={() =>
                    window.open(PROJECTS[activeIndex].link, '_blank')
                  }
                  src={PROJECTS[activeIndex].image}
                  alt={PROJECTS[activeIndex].title}
                  fill
                  style={{ objectFit: 'fill', borderRadius: '16px' }}
                />
              ) : (
                <Flex
                  direction="column"
                  gap="2"
                  css={{ textAlign: 'center', padding: '1.5rem' }}
                >
                  <Text size="4" weight="4" css={{ color: '#fff' }}>
                    {PROJECTS[activeIndex].title}
                  </Text>
                  <Text size="2" css={{ color: 'rgba(255,255,255,0.7)' }}>
                    {PROJECTS[activeIndex].description}
                  </Text>
                </Flex>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            left: '1rem',
            zIndex: 1,
          }}
        >
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Text size="1" css={{ color: 'rgba(255,255,255,0.5)' }}>
              ↓ Scroll
            </Text>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  completedBooks: Book[];
  readingBooks: Book[];
}

const IndexPage = ({ completedBooks, readingBooks }: Props) => {
  return (
    <Layout footer header headerProps={{ offsetHeight: 256 }}>
      <Grid gapX={4} gapY={40} templateColumns={templateColumnsMedium}>
        <Grid.Item col={2}>
          <Flex alignItems="start" direction="column" gap="5">
            <H1>
              Hi <WavingHand /> I’m Rashid, a frontend engineer focused on
              building thoughtful, performant web experiences.{' '}
              <Text
                css={{
                  lineHeight: 'unset',
                  letterSpacing: '-0.5px',
                }}
                variant="secondary"
                size="7"
                weight="4"
              >
                Here, I share my experience as a frontend engineer along with
                insights from what I’m learning in JavaScript, animation, React,
                Framer Motion, and modern frontend development. I also write
                about key takeaways from books I’ve recently read. Click on any
                book cover in the <strong>Completed</strong> section below to
                explore articles inspired by that book.
              </Text>
            </H1>

            <Flex
              gap={4}
              css={{
                marginLeft: '-var(--space-3)',
                marginRight: '-var(--space-3)',
                marginBottom: 'var(--space-4)',
              }}
            >
              <Link href="/posts/resume/">
                <Button
                  variant="secondary"
                  endIcon={<Icon.External size="4" />}
                  style={{ textDecoration: 'none' }}
                  tabIndex={-1}
                >
                  My resume
                </Button>
                <VisuallyHidden as="p">Link to my resume</VisuallyHidden>
              </Link>
              <a
                href="https://twitter.com/rashidtvmr"
                style={{ textDecoration: 'none' }}
                tabIndex={-1}
              >
                <Button variant="secondary" endIcon={<Icon.Twitter size="4" />}>
                  @rashidtvmr
                </Button>
                <VisuallyHidden as="p">
                  Link redirects to my Twitter profile page
                  https://twitter.com/rashidtvmr.
                </VisuallyHidden>
              </a>
            </Flex>
          </Flex>
        </Grid.Item>
      </Grid>

      {/* Sticky Projects Section — full width, outside the grid */}
      <StickyProjectsSection />

      <Grid gapX={4} gapY={40} templateColumns={templateColumnsMedium}>
        <Grid.Item as="section" col={2}>
          <Flex direction="column" gap="4">
            <H2>Currently Reading</H2>
            <Flex gap="4" wrap="wrap">
              {readingBooks.map((book) => (
                <Link key={book.slug} href={`/posts/reading/${book.slug}`}>
                  <Image
                    src={book.cover}
                    alt={book.title}
                    width={150}
                    height={200}
                  />
                </Link>
              ))}
            </Flex>
          </Flex>
        </Grid.Item>
        <Grid.Item as="section" col={2}>
          <Flex direction="column" gap="4">
            <H2>Completed Books</H2>
            <Flex gap="4" wrap="wrap">
              {completedBooks.map((book) => (
                <Link key={book.slug} href={`/posts/completed/${book.slug}`}>
                  <Image
                    src={book.cover}
                    alt={book.title}
                    width={150}
                    height={200}
                  />
                </Link>
              ))}
            </Flex>
          </Flex>
        </Grid.Item>
      </Grid>
    </Layout>
  );
};

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter();
  const completedBooks = await getBooks('completed');
  const readingBooks = await getBooks('reading');

  return { props: { posts, completedBooks, readingBooks } };
}

export default IndexPage;
