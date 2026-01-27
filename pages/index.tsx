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
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@core/layout';
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
  // const { posts } = props;

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
        {/* <Grid.Item as="section" col={2}>
          <Flex alignItems="start" direction="column" gap="5">
            <H2>Newsletter</H2>
            <NewsletterForm large />
          </Flex>
        </Grid.Item> */}
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

// const Glow = styled(motion.div, {
//   position: 'absolute',
//   top: '0',
//   left: '0',
//   width: '100%',
//   height: '100%',
//   webkitFilter: 'blur(15px)',
//   filter: 'blur(15px)',
//   borderRadius: 'var(--border-radius-2)',
// });

// const Block = styled(Box, {
//   display: 'flex',
//   justifyContent: 'flex-start',
//   alignItems: 'start',
//   width: '100%',
//   borderRadius: 'var(--border-radius-2)',
//   marginLeft: '-8px',
//   padding: '16px 8px',
//   boxShadow: 'none',
//   backgroundColor: 'var(--article-block-background-color, "transparent")',
//   color: 'var(--article-block-color, var(--text-primary))',
//   transition: 'background-color 0.25s, box-shadow 0.25s, color 0.25s',

//   '&:focus': {
//     '--article-block-background-color': 'var(--emphasis)',
//     '--article-block-color': 'var(--accent)',
//   },

//   '@media (hover: hover) and (pointer: fine)': {
//     '&:hover': {
//       '--article-block-background-color': 'var(--emphasis)',
//       '--article-block-color': 'var(--accent)',
//     },
//   },
// });

export default IndexPage;
