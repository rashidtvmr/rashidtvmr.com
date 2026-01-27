import siteConfig from '../config/site';

export const generatePersonSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author,
    alternateName: siteConfig.authorAliases,
    url: siteConfig.siteUrl,
    image: siteConfig.image,
    sameAs: [
      `https://twitter.com/${siteConfig.twitter.replace('@', '')}`,
      'https://github.com/rashidtvmr',
      'https://linkedin.com/in/rashidtvmr',
    ],
    jobTitle: 'Senior Frontend Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'Independent',
    },
    knowsAbout: [
      'React',
      'TypeScript',
      'JavaScript',
      'Frontend Engineering',
      'Web Performance',
      'Framer Motion',
      'Next.js',
    ],
    description: siteConfig.twitterDesc,
  };
};

export const generateWebsiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.title,
    alternateName: [
      'Rashidtvmr Blog',
      'RashidTV Blog',
      'Rashid Blog',
      'TVRashid Blog',
      'Raashid Blog',
    ],
    url: siteConfig.siteUrl,
    description: siteConfig.description,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.siteUrl}posts?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
};

export const generateBlogSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    url: siteConfig.siteUrl,
    name: siteConfig.title,
    description: siteConfig.description,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
      alternateName: siteConfig.authorAliases,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.author,
    },
  };
};

export const generateBlogPostSchema = (post: {
  title: string;
  subtitle: string;
  date: string;
  updated?: string;
  slug: string;
  keywords?: string[];
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.subtitle,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
      alternateName: siteConfig.authorAliases,
      url: siteConfig.siteUrl,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.author,
    },
    url: `${siteConfig.siteUrl}posts/${post.slug}/`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.siteUrl}posts/${post.slug}/`,
    },
    keywords: post.keywords?.join(', '),
    image: siteConfig.image,
  };
};

export const generateBreadcrumbSchema = (
  items: { name: string; url: string }[]
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

export const generateCanonicalUrl = (path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${cleanPath}`;
};

export const generateMetaTags = (options: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string[];
}) => {
  const title = options.title || siteConfig.title;
  const description = options.description || siteConfig.description;
  const image = options.image || siteConfig.image;
  const url = options.url || siteConfig.siteUrl;
  const type = options.type || 'website';

  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...(options.keywords || [])].join(', '),
    canonical: url,
    openGraph: {
      type,
      url,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: siteConfig.title,
    },
    twitter: {
      handle: siteConfig.twitter,
      site: siteConfig.twitter,
      cardType: 'summary_large_image',
      title,
      description,
      image,
    },
  };
};
