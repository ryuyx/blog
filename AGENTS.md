# AGENTS.md — Blog (Astro 6 + Tailwind CSS v4)

## Build / Lint / Format Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Type-check (`astro check`), build (`astro build`), index with pagefind, copy pagefind output to `public/` |
| `pnpm preview` | Preview production build |
| `pnpm sync` | Sync Astro content collection types |
| `pnpm lint` | Lint with ESLint (flat config, `eslint.config.js`) |
| `pnpm format` | Auto-format with Prettier |
| `pnpm format:check` | Check formatting without writing |

- Package manager: **pnpm** (`pnpm@10.33.2`). Never use `npm` or `yarn`.
- Node: `>=22.12.0`
- **No test framework** is configured (no vitest/jest). There are no test files.
- The build script (`astro check && astro build && ...`) already runs TypeScript checking. There is no standalone `typecheck` script.

## Code Style Guidelines

### Imports

- Use `@/` path alias for all local imports (maps to `./src/*`).
- Astro built-in modules use `astro:*` prefix: `astro:content`, `astro:i18n`, `astro:assets`, `astro:transitions`, `astro/env`, `astro/middleware`, `astro/types`.
- Third-party packages are imported by name (e.g., `import dayjs from "dayjs"`).
- SVG icon components from `@/assets/icons/` (e.g., `import IconSearch from "@/assets/icons/IconSearch.svg"`).
- Import types with `import type { ... }` when only using for type annotations.
- Relative imports (`./Component.astro`) used for sibling files in the same directory.
- Order: Astro builtins → third-party → `@/` aliases → relative imports.

### Formatting (Prettier — `.prettierrc`)

- Double quotes only, no single quotes.
- Semicolons required.
- Trailing commas where valid (ES5-compatible: no trailing commas on function params).
- `printWidth: 80`, `tabWidth: 2`.
- `arrowParens: "avoid"` — single parameter: `x => x`, multiple: `(a, b) => a + b`.
- `endOfLine: "lf"`.
- Plugins: `prettier-plugin-astro` (overrides `*.astro` to use `astro` parser), `prettier-plugin-tailwindcss` (auto-sorts Tailwind classes).
- Run `pnpm format` before committing.

### TypeScript

- Strict mode via `astro/tsconfigs/strict`.
- Use `interface` for object shapes, `type` for unions/intersections/utility types.
- Component props always typed as `type Props = { ... }` — destructured via `Astro.props`.
- Prefer `satisfies` keyword over `as` casts (e.g., `satisfies UIStrings`).
- Prefer `const` over `let`. Prefer arrow functions over `function` declarations.
- No `any` — use `unknown` and type guards if needed.
- Use `import.meta.env.DEV` / `import.meta.env.BASE_URL` for environment checks.
- Public environment variables: `import.meta.env.PUBLIC_*` (schema defined in `astro.config.ts` via `envField`).
- Path alias `@/*` resolves to `./src/*`, `@/site.config` resolves to `./site.config`.

### Naming Conventions

| Item | Convention | Example |
|---|---|---|
| `.astro` component files | PascalCase | `Card.astro`, `Header.astro` |
| `.ts` utility files | camelCase | `getSortedPosts.ts`, `postFilter.ts` |
| Page directories | kebab-case | `[...slug]/`, `[...page].astro` |
| TypeScript interfaces | PascalCase | `SiteConfig`, `UIStrings` |
| TypeScript type aliases | PascalCase | `ResolvedSiteConfigOutput` |
| Functions | camelCase | `getPostUrl`, `slugifyStr` |
| SVG icon assets | PascalCase with type prefix | `IconSearch.svg`, `IconMoon.svg` |
| Constants | UPPER_SNAKE_CASE or `const` | `LOCALE_COOKIE`, `DEFAULT_LOCALE` |
| Exports | Prefer `export default` for single-value modules (config, i18n). Named exports for utility functions. |

### Astro Component Patterns

- Frontmatter block: `---` with imports, then `type Props`, then `const { ... } = Astro.props`, then logic.
- Template follows after `---` with no blank line between `---` and template.
- Use `Astro.currentLocale` for i18n locale, `Astro.url` for current URL, `Astro.site` for site URL.
- Use `Astro.rewrite()` to redirect to 404 for disabled features or missing content.
- Use `class:list={[...]}` for conditional Tailwind classes.
- Use `transition:name` and `transition:persist` for View Transitions.
- Client scripts in `<script>` tags at bottom of component (no `is:inline` by default; use `is:inline` for critical inline scripts that must run before paint).
- Use `data-astro-rerun` attribute on scripts that need to re-run after navigation.

### Error Handling

- Throw `new Error(...)` for missing critical resources (missing about page, font path resolution failure).
- Optional chaining (`?.`) and nullish coalescing (`??`) instead of `&&` guards where possible.
- Early returns via `Astro.rewrite()` to redirect to 404 when features are disabled.
- Post visibility: `postFilter()` handles drafts and scheduled posts — uses `data.draft ?? false` and `import.meta.env.DEV` to show non-draft posts in dev. In production, checks `pubDatetime` against `scheduledPostMargin`.

### CSS / Styling

- Tailwind CSS v4 via `@tailwindcss/vite` plugin.
- CSS in `src/styles/`: `global.css` (@import "tailwindcss"), `theme.css` (CSS custom properties for light/dark), `typography.css` (prose styles).
- Dark mode via `[data-theme=dark]` attribute on `<html>` — custom variant `@custom-variant dark`.
- Custom utilities defined with `@utility` directive: `max-w-app`, `app-layout`, `active-nav`.
- Prefer Tailwind utility classes over custom CSS. Keep component-specific styles in the component using Tailwind.

### i18n

- Supported locales: `"zh"` (default), `"en"`.
- UI strings defined in `src/i18n/lang/en.ts` and `zh.ts`, typed via `UIStrings` interface.
- Use `useTranslations(locale)` to get strings for the current locale.
- Template strings use `{{placeholder}}` syntax — use `tplStr` from `@/i18n` for formatting.
- Locale detection in `src/middleware.ts`: checks cookie `x-locale`, then `Accept-Language` header, falls back to `"zh"`.

### Configuration

- User-editable config: `site.config.ts` (uses `defineSiteConfig` helper from `src/types/config.ts`).
- Internal resolved config: `src/config.ts` (applies defaults, exports fully-resolved `ResolvedSiteConfigOutput`).
- Content collections defined in `src/content.config.ts` using `defineCollection` with Zod schemas.

### Content Collections

- Posts stored in `src/content/posts/` (`.md`, `.mdx`), pages in `src/content/pages/`.
- Post schema: `author`, `pubDatetime`, `modDatetime?`, `title`, `featured?`, `draft?`, `tags`, `ogImage?`, `description`, `canonicalURL?`, `hideEditPost?`, `timezone?`, `lang?`.
- Use `getCollection("posts")` from `astro:content` to query posts.
- Posts can be organized in locale subdirectories (`zh/`, `en/`).