/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const globby = require('globby');
const prettier = require('prettier');

(async () => {
  console.info(chalk.cyan('info'), ` - Generating sitemap`);

  const prettierConfig = await prettier.resolveConfig('./.prettierrc');
  const pages = await globby([
    'pages/*.js',
    'pages/*.tsx',
    'content/**/*.mdx',
    'content/completed/*.mdx',
    'content/reading/*.mdx',
    '!pages/_*.js',
    '!pages/_*.tsx',
    '!pages/api',
    '!pages/404.tsx',
  ]);

  const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
            ${pages
      .map((page) => {
        let path = page
          .replace('pages', '')
          .replace('content/', '/posts/')
          .replace('content/completed/', '/posts/completed/')
          .replace('content/reading/', '/posts/reading/')
          .replace('.js', '')
          .replace('.tsx', '')
          .replace('.ts', '')
          .replace('.mdx', '');
        const route = path === '/index' ? '' : path;

        // Determine priority based on page type
        let priority = '0.7';
        let changefreq = 'weekly';

        if (route === '' || route === '/posts' || route.includes('about-rashidtvmr')) {
          priority = '1.0';
          changefreq = 'daily';
        } else if (route.includes('/posts/')) {
          priority = '0.8';
          changefreq = 'monthly';
        }

        return `
                        <url>
                            <loc>${`https://raashid.me${route}/`}</loc>
                            <changefreq>${changefreq}</changefreq>
                            <priority>${priority}</priority>
                        </url>
                    `;
      })
      .join('')}
        </urlset>
    `;

  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  });

  // eslint-disable-next-line no-sync
  fs.writeFileSync('public/sitemap.xml', formatted);
})();
