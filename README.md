# Junaid Rasheed — Portfolio

My personal portfolio and blog: a place to share what I work on as a Principal Engineer and Software Architect — projects, writing, talks, and the skills behind them.

Built with [Nuxt 4](https://nuxt.com), [Nuxt UI](https://ui.nuxt.com), [Nuxt Content](https://content.nuxt.com), and [Tailwind CSS v4](https://tailwindcss.com).

## Tech Stack

- **Framework:** Nuxt 4 (Vue 3)
- **UI:** Nuxt UI v4 + Tailwind CSS v4
- **Content:** Nuxt Content v3 (Markdown + YAML, SQLite-backed)
- **Images:** Nuxt Image
- **Animation:** Motion for Vue
- **SEO:** Nuxt OG Image
- **Tooling:** ESLint, TypeScript / `vue-tsc`
- **Package manager:** pnpm

## Project Structure

```
app/
  components/      # UI and landing-page sections
  layouts/         # Default layout
  pages/           # Routes: index, about, projects, skills, blog/
  utils/           # Shared helpers (e.g. nav links)
  app.config.ts    # Theme colors and global config
  assets/css/      # Tailwind entry + theme tokens
content/
  index.yml        # Landing page: hero, about, experience, FAQ, skills
  about.yml        # About page
  projects.yml     # Projects listing
  speaking.yml     # Talks / speaking
  blog.yml         # Blog index metadata
  blog/            # Blog posts (Markdown)
content.config.ts  # Nuxt Content collection schemas
```

## Setup

Install dependencies:

```bash
pnpm install
```

## Development

Start the dev server on `http://localhost:3000`:

```bash
pnpm dev
```

## Editing Content

Most of the site is driven by content files — no component changes needed for routine updates:

- **Landing page** (hero, about, experience, FAQ, skills): `content/index.yml`
- **Blog posts:** add a Markdown file under `content/blog/`
- **Projects / speaking / about page:** the corresponding `content/*.yml`

Theme colors live in `app/assets/css/main.css` (custom color ramps) and `app/app.config.ts` (`ui.colors`). A change to `ui.colors` requires a dev server restart to take effect.

## Quality Checks

```bash
pnpm lint        # Lint
pnpm lint:fix    # Lint and auto-fix
pnpm typecheck   # Type-check
```

## Production

Build for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

See the [Nuxt deployment docs](https://nuxt.com/docs/getting-started/deployment) for hosting options.
