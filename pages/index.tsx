/* eslint-disable react/no-unescaped-entities */
import {
  Button,
  Flex,
  Grid,
  Icon,
  Text,
  VisuallyHidden,
  H1,
} from '@maximeheckel/design-system';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@core/layout';
import StickyProjectsSection from '@core/components/StickyProjects/StickyProjectsSection';
import BookShelf from '@core/components/BookShelf/BookShelf';
import { getAllFilesFrontMatter, getBooks } from 'lib/mdx';
import React from 'react';
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
              Hi <WavingHand /> I'm Rashid, a frontend engineer focused on
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
                insights from what I'm learning in JavaScript, animation, React,
                Framer Motion, and modern frontend development. I also write
                about key takeaways from books I've recently read. Click on any
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

      {/* Sticky Projects Section */}
      <StickyProjectsSection />

      <Grid gapX={4} gapY={2} templateColumns={templateColumnsMedium}>
        <Grid.Item col={2} css={{ marginTop: '20px' }}>
          <Text
            size="2"
            css={{
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: 'var(--text-tertiary, rgba(150,150,150,0.6))',
              paddingBottom: '8px',
            }}
          >
            Between the pages - what I&apos;ve read &amp; what I&apos;m reading
          </Text>
        </Grid.Item>
        <Grid.Item as="section" col={2} css={{ marginTop: '20px' }}>
          <BookShelf
            title="Currently Reading"
            books={readingBooks}
            type="reading"
          />
        </Grid.Item>
        <Grid.Item as="section" col={2}>
          <BookShelf
            title="Completed"
            books={completedBooks}
            type="completed"
          />
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
