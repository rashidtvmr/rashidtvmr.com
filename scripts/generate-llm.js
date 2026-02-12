/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const root = process.cwd();

/**
 * Reads all MDX files from a directory, extracts the `llm` frontmatter field,
 * and writes a corresponding llm.txt file into public/ at the matching URL path.
 *
 * URL mapping:
 *   content/<slug>.mdx           → public/posts/<slug>/llm.txt
 *   content/completed/<slug>.mdx → public/posts/completed/<slug>/llm.txt
 *   content/reading/<slug>.mdx   → public/posts/reading/<slug>/llm.txt
 */

const allPaths = [];

function processDir(dir, urlPrefix) {
    const folder = path.join(root, dir);
    if (!fs.existsSync(folder)) return 0;

    const files = fs.readdirSync(folder).filter((f) => f.endsWith('.mdx'));
    let count = 0;

    for (const file of files) {
        const filePath = path.join(folder, file);
        const source = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(source);

        // Use explicit `llm` frontmatter if present, otherwise auto-generate
        const llmContent =
            data.llm ||
            [
                `# ${data.title || file.replace('.mdx', '')}`,
                data.subtitle ? `\n> ${data.subtitle}` : '',
                data.keywords && data.keywords.length
                    ? `\nKeywords: ${data.keywords.join(', ')}`
                    : '',
                '\n---\n',
                content.trim(),
            ]
                .filter(Boolean)
                .join('\n');

        const slug = file.replace('.mdx', '');
        const outDir = path.join(root, 'public', urlPrefix, slug);
        fs.mkdirSync(outDir, { recursive: true });

        const outFile = path.join(outDir, 'llm.txt');
        fs.writeFileSync(outFile, llmContent, 'utf8');

        const urlPath = `/${urlPrefix}/${slug}/llm.txt`;
        allPaths.push({ title: data.title || slug, url: urlPath });
        count++;
    }

    return count;
}

(async () => {
    console.info(chalk.cyan('info'), ` - Generating llm.txt files`);

    let total = 0;

    total += processDir('content', 'posts');
    total += processDir('content/completed', 'posts/completed');
    total += processDir('content/reading', 'posts/reading');

    // Root llm.txt — dynamically lists every generated page
    const lines = [
        '# raashid.me',
        '',
        'Personal website and blog of Mohammed Rashid, a Senior Frontend Developer.',
        '',
        'Topics: React, Next.js, Vue.js, JavaScript, TypeScript, Web Performance,',
        'Framer Motion, Animation, Frontend Architecture, Book Reviews.',
        '',
        'This site exposes llm.txt at every page path.',
        'Append /llm.txt to any URL to get an LLM-friendly plain-text version.',
        '',
        `## All pages (${allPaths.length})`,
        '',
        ...allPaths.map((p) => `- [${p.title}](${p.url})`),
    ];

    fs.writeFileSync(
        path.join(root, 'public', 'llm.txt'),
        lines.join('\n'),
        'utf8'
    );
    total++;

    console.info(
        chalk.green('done'),
        ` - Generated ${total} llm.txt file(s)`
    );
})();
