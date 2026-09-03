@AGENTS.md

# Project Context & Guidelines

## Tech Stack
- Framework: Next.js (App Router)
- UI/Runtime: React with TypeScript
- Styling: Tailwind CSS
- Animation: Framer Motion

## Conventions
1. Any component using Framer Motion hooks or motion elements (`motion.div`, `useScroll`, `useTransform`) MUST include the `'use client'` directive at the very top.
2. Group animated components into modular client files inside `components/` and import them into server-rendered pages.
3. Use Tailwind classes for base layouts, responsive flex/grid, and typography. Use Framer Motion exclusively for motion/state transitions.
