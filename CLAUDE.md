@AGENTS.md

# MW LINE A — Project Architecture & Rules

## Design System
- Background: `#ACA39A`
- Primary Line: `#CD7925`
- Secondary Line: `#BE8D4D`
- Typography: Helvetica Neue, fallback `Helvetica Neue, Helvetica, Arial, sans-serif`
- Aesthetic: Modernist Swiss editorial, technical transit diagram, industrial, zero SaaS clichés

## Tech Stack
- Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion
- Single-page data-driven architecture: `/data/project.ts`
- Native scrolling ONLY: No scroll-jacking, no forced snapping

## Critical Conventions
- All motion components using hooks must have `'use client'`.
- Desktop: Parallel lines run centrally; content offsets editorially.
- Mobile: Parallel lines shift to the left edge; content aligns right.
- Zero CMS: Layouts consume typed objects from `data/project.ts`. Optional fields omit if blank.
- Group animated components into modular client files inside `components/`, imported into
  server-rendered pages.
- Tailwind for base layout, responsive flex/grid, and typography. Framer Motion exclusively
  for motion/state transitions.
