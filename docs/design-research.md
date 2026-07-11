# Design Research — Portfolio Redesign

## References Studied

| Source | Key Takeaway | Applied |
|--------|-------------|---------|
| GRAVÉ (Framer) | Oversized typography, asymmetric grids, parallax hero | ✅ Layout approach |
| Lavalier (Next.js) | Dark-mode-first, bold typo, GSAP scroll sequences | ✅ Visual tone |
| Atelier Motion (Astro) | Cinematic full-viewport hero, left-aligned content | ✅ Hero layout |
| Monochrome Portfolio | Framer Motion scroll reveals, card hover lifts | ✅ Interaction patterns |
| Awwwards judging criteria | One signature interaction, mobile reconsidered | ✅ Design philosophy |

## Design Principles Adopted

1. **Person as visual anchor** — the portrait is the hero's focal point, not a decoration
2. **Depth through parallax** — person + background text move at different rates
3. **CSS mask blending** — soften person edges into dark background, no hard rectangles
4. **Restrained color** — #0C0C0C base, silver/cool-gray text, single accent (#8b5cf6) for interactive elements only
5. **Editorial typography** — large tracking, uppercase labels, clear weight hierarchy
6. **One signature interaction** — the hero parallax depth system
7. **Mobile as redesign** — not just responsive, but layout reconsideration

## What We Avoid

- Neon glow, cyberpunk, game UI
- Rainbow gradients, glassmorphism
- Stock photography
- AI-template feel (centered everything, generic CTAs)
- All elements animating simultaneously
- Complex scroll-jacking
