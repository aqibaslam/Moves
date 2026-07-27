---
name: frontend-master
description: >
  Advanced frontend engineering skill for building blazing-fast, accessible,
  SEO-optimized React Server Components in Next.js 16+ with Payload CMS.
  Activates when writing any component, page, layout, or styling code.
---

# Frontend Master — Performance-First Engineering Skill

You are a senior frontend architect specializing in Next.js App Router,
React Server Components, and extreme web performance optimization.

## Architecture Principles

### 1. Server-First, Always
- **Default to React Server Components.** Only add `"use client"` when the component needs:
  - `useState`, `useEffect`, `useRef`
  - Browser APIs (`window`, `document`, `IntersectionObserver`)
  - Event handlers (`onClick`, `onScroll`, `onChange`)
- **Keep client components SMALL.** Extract interactivity into the smallest possible leaf component.
- **Never** wrap a large section in `"use client"` just because one button needs an onClick.

### 2. Data Fetching Strategy
```typescript
// ✅ CORRECT: Fetch in Server Components using Payload Local API
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function CaseStudies() {
  const payload = await getPayload({ config })
  const cases = await payload.find({
    collection: 'case-studies',
    limit: 6,
    sort: '-createdAt',
  })
  return <CaseGrid items={cases.docs} />
}

// ❌ WRONG: Client-side fetch
// "use client"
// useEffect(() => fetch('/api/case-studies')...)
```

### 3. Image Optimization
- Always use `next/image` with explicit `width` and `height`
- Use `priority` prop ONLY for above-the-fold hero images
- Set `loading="lazy"` for all below-fold images
- Prefer WebP/AVIF formats
- Use `sizes` prop to prevent downloading oversized images:
  ```tsx
  <Image
    src={src}
    alt={alt}
    width={800}
    height={600}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
  ```

### 4. CSS Architecture
- **Vanilla CSS only.** No Tailwind, no CSS-in-JS, no Styled Components.
- Use CSS custom properties (design tokens) defined in `globals.css`
- Use CSS Modules (`.module.css`) for component-specific styles when needed
- Prefer `clamp()` for fluid sizing over media queries where possible
- Use `@media` breakpoints: `960px` (tablet), `680px` (mobile)

### 5. Performance Checklist
Before any PR or deploy:
- [ ] Zero `"use client"` in page-level components
- [ ] All images use `next/image`
- [ ] No unused JavaScript shipped to client
- [ ] CSS animations use `transform` and `opacity` only (GPU-accelerated)
- [ ] No layout shifts (explicit dimensions on all media)
- [ ] `<Link>` from `next-view-transitions` for all internal navigation
- [ ] Prefetch critical routes

### 6. File Structure Convention
```
src/
├── app/
│   ├── globals.css          # Design tokens + global styles
│   ├── layout.tsx           # Root layout (Server Component)
│   ├── page.tsx             # Homepage (Server Component)
│   ├── (payload)/           # Payload CMS admin routes
│   ├── ecommerce/page.tsx   # Industry page
│   ├── dental/page.tsx      # Industry page
│   └── weight-loss/page.tsx # Industry page
├── components/
│   ├── Navigation.tsx       # Client Component (scroll detection)
│   ├── Footer.tsx           # Server Component
│   ├── CaseStudies.tsx      # Client Component (filtering)
│   ├── ScrollReveal.tsx     # Client Component (IntersectionObserver)
│   └── Popup.tsx            # Client Component (modal state)
└── lib/
    └── payload.ts           # Payload helpers
```

### 7. Semantic HTML Requirements
- One `<h1>` per page, inside the hero
- Logical heading hierarchy: `h1` → `h2` → `h3` (never skip levels)
- Use `<section>`, `<article>`, `<nav>`, `<footer>`, `<main>` semantically
- All buttons must have visible text or `aria-label`
- All links must have descriptive text (not "click here")
- Forms must have associated `<label>` elements

### 8. View Transitions Integration
```tsx
// Always use Link from next-view-transitions
import { Link } from 'next-view-transitions';

// For programmatic navigation
import { useTransitionRouter } from 'next-view-transitions';
const router = useTransitionRouter();
router.push('/dental');
```

### 9. Error Handling
- Create `error.tsx` boundaries for each route segment
- Create `loading.tsx` with skeleton UI matching the page layout
- Use `not-found.tsx` for custom 404 pages
- Never show raw error messages to users
