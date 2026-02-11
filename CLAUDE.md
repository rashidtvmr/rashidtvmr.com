# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog/portfolio site (raashid.me) built with **Next.js 14**, **TypeScript**, and **MDX** for content. Uses static site generation (SSG) for blog posts with AI-powered semantic search via OpenAI embeddings and Supabase vector database.

## Commands

```bash
# Development
pnpm dev                    # Dev server on port 8080
pnpm build                  # Production build (runs RSS + sitemap generation first)
pnpm build:static           # Static export (STATIC_EXPORT=true)

# Code Quality
pnpm lint                   # ESLint (.jsx, .ts, .tsx)
pnpm format                 # Prettier check
pnpm type-check             # TypeScript type checking

# Testing
pnpm test                   # Jest (watch in dev, coverage in CI)
pnpm test:watch             # Jest watch mode
pnpm cy:open                # Cypress E2E (interactive)
pnpm cy:run                 # Cypress E2E (headless Chrome)

# Content Generation
pnpm generate:rss           # Generate RSS feed
pnpm generate:sitemap       # Generate sitemap
pnpm generate:og            # Generate Open Graph images
```

**Package manager:** pnpm 8 | **Node version:** 18.16.0 (see .nvmrc)

## Architecture

### Content Pipeline
- Blog posts are `.mdx` files in `content/` with YAML frontmatter (title, subtitle, date, keywords, featured, etc.)
- `lib/mdx.ts` handles loading and parsing MDX files at build time via `getStaticProps`
- Dynamic route `pages/posts/[...slug].tsx` renders posts; supports nested paths for books (`/posts/completed/slug`, `/posts/reading/slug`)
- MDX components are mapped in `core/components/MDX/MDXComponents.tsx` — custom widgets live in `core/components/MDX/Widgets/`

### Key Directories
- `core/components/` — React components (Header, Footer, Search, Code, Charts, MDX overrides)
- `core/layout/` — Layout wrappers (`Layout.tsx` for pages, `BlogPost.tsx` for posts)
- `core/hooks/` — Custom hooks (useProgress, useScrollSpy, useGPUTier, etc.)
- `lib/` — Utilities, Stitches theme config, remark plugins, OpenAI streaming helpers
- `scripts/` — Build-time generators (RSS, sitemap, OG images, embeddings)
- `config/site.js` — Site metadata (title, description, keywords)

### API Routes (Edge Runtime)
- `pages/api/semanticsearch.ts` — AI search: OpenAI embeddings → Supabase vector match → GPT-3.5-turbo streaming completion
- Rate limited via Vercel KV (15 req/min per IP)

### Styling
- **@maximeheckel/design-system** provides theme context and styled components
- **Stitches** for CSS-in-JS; theme config in `lib/stitches.config.ts`

### Path Alias
- `@core/*` maps to `core/*` (configured in tsconfig.json)

## Code Conventions

- **ESLint:** `no-console` is an error
- **Prettier:** semicolons, single quotes, trailing commas (ES5)
- **TypeScript:** strict mode, `noUnusedLocals` and `noUnusedParameters` enforced
- Heavy components (Search, LightDarkSwitcher) use `next/dynamic` for code splitting

## Environment Variables

- `SUPABASE_API_KEY`, `SUPABASE_URL` — Vector search database
- `OPEN_AI_API_KEY`, `OPENAI_EMBEDDING_MODEL` — AI embeddings/completions
- `NEXT_PUBLIC_ENABLE_AI_SEARCH` — Feature flag for search UI
- `ANALYZE` — Enable bundle analyzer
- `STATIC_EXPORT` — Enable static export mode
