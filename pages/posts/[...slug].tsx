import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { MDXRemote } from 'next-mdx-remote';
import BlogLayout from '@core/layout/BlogPost';
import getOgImage from 'lib/generate-opengraph-images';
import { getTweets } from 'lib/tweets';
import { getFileBySlug, getFiles, getBooks } from 'lib/mdx';
import MDXComponents from '@core/components/MDX/MDXComponents';
import Tweet from '@core/components/Tweet';
import { FrontMatterPost } from 'types/post';

interface BlogProps {
  post?: FrontMatterPost;
  ogImage: string;
  tweets: Record<string, any>; // TODO: write types for tweets
}

const Blog = ({ post, ogImage, tweets }: BlogProps) => {
  const { isFallback } = useRouter();

  if (isFallback || !post) {
    return <div>Loading...</div>;
  }

  const StaticTweet = ({ id }: { id: string }) => {
    return <Tweet tweet={tweets[id]} />;
  };

  return (
    <BlogLayout frontMatter={post.frontMatter} ogImage={ogImage}>
      <MDXRemote
        {...post.mdxSource}
        components={{
          ...MDXComponents,
          StaticTweet,
        }}
      />
    </BlogLayout>
  );
};

export default Blog;

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getFiles();
  const completedBooks = await getBooks('completed');
  const readingBooks = await getBooks('reading');

  return {
    paths: [
      ...posts.map((p) => ({
        params: {
          slug: [p.replace(/\.mdx/, '')],
        },
      })),
      ...completedBooks.map((book) => ({
        params: {
          slug: ['completed', book.slug],
        },
      })),
      ...readingBooks.map((book) => ({
        params: {
          slug: ['reading', book.slug],
        },
      })),
    ],
    fallback: false, // changed from true to false for SSG export
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slugArray = params!.slug as string[];
    let slug: string;
    let type: string | undefined;
    if (slugArray.length === 1) {
      slug = slugArray[0];
      type = undefined;
    } else if (slugArray.length === 2) {
      type = slugArray[0];
      slug = slugArray[1];
    } else {
      return { notFound: true };
    }
    const post = await getFileBySlug(slug, type);

    /**
     * Get tweets from API
     */
    const tweets =
      // TODO: write proper return types for getTweets
      post.tweetIDs.length > 0 ? await getTweets(post.tweetIDs) : {};

    const ogImage = await getOgImage({
      title: post.frontMatter.title,
      background: post.frontMatter.colorFeatured,
      color: post.frontMatter.fontFeatured,
    });
    return { props: { post, ogImage, tweets } };
  } catch (error) {
    // eslint-disable-next-line
    console.log(error);
    return { notFound: true };
  }
};
