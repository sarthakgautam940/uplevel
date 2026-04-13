# Hero — perception upgrade checklist

Use this for **design QA**, **pre-ship audit**, and **regression checks** after any hero edit.  
**Pass = all boxes true** for luxury / conversion bar.

---

## 1. Gaze flow engine (mandatory sequence)

| # | Checkpoint | Pass? |
|---|------------|-------|
| 1.1 | Eye path matches: **brand (nav, external)** → **headline** → **sub** → **primary CTA** → **secondary CTA** → **right visual** → **metrics** | ☐ |
| 1.2 | **Contrast hierarchy** enforces order (headline brightest / largest; kicker lowest tier) | ☐ |
| 1.3 | **Motion sequence** matches spec (headline lead; sub +~150ms; CTA +~300ms; visual last) | ☐ |
| 1.4 | No competing focal points (single dominant headline block) | ☐ |

---

## 2. Visual hierarchy & depth (Z-axis)

| # | Checkpoint | Pass? |
|---|------------|-------|
| 2.1 | Clear **foreground / mid / back** planes (text in front; blur/atmosphere mid; field/particles back) | ☐ |
| 2.2 | **Not** everything on one flat plane (parallax or layered opacity proves depth) | ☐ |
| 2.3 | Right panel reads as **intentional system**, not empty decoration | ☐ |

---

## 3. Color psychology & contrast tiers

| # | Checkpoint | Pass? |
|---|------------|-------|
| 3.1 | Background = **deep navy/black gradient** (not flat fill) | ☐ |
| 3.2 | **Warm gold** reserved for **primary CTA** (scarcity / action signal) | ☐ |
| 3.3 | Text uses **near-white** primary, **muted blue-gray** secondary (no pure #fff / #000) | ☐ |
| 3.4 | **Tension gradients** present (radial / edge falls, not uniform grey) | ☐ |

---

## 4. Typography science

| # | Checkpoint | Pass? |
|---|------------|-------|
| 4.1 | Headline: **serif display**, large scale, **tight tracking** (authority + modernity) | ☐ |
| 4.2 | Sub: **sans**, comfortable **line-height** (1.65–1.8+) | ☐ |
| 4.3 | Micro lines: **uppercase + letterspacing** (kicker, metrics) | ☐ |
| 4.4 | Vertical rhythm: intentional **blocks** of space (luxury = space) | ☐ |

---

## 5. Spatial composition & negative space

| # | Checkpoint | Pass? |
|---|------------|-------|
| 5.1 | Content column **max-width** capped (does not stretch edge-to-edge) | ☐ |
| 5.2 | **Breathing room** above headline (authority pause) | ☐ |
| 5.3 | **Emotional asymmetry** — slight off-balance, not mirrored template | ☐ |
| 5.4 | Right column **not** a void; layered intelligence visible | ☐ |

---

## 6. Motion systems (attention choreography)

| # | Checkpoint | Pass? |
|---|------------|-------|
| 6.1 | **Entrance**: `power3.out`, no bounce, no gimmick easing | ☐ |
| 6.2 | **Scroll**: subtle parallax (headline / field / visual differ) | ☐ |
| 6.3 | **Cursor** (desktop): lagged glow or field response — **purposeful**, not random | ☐ |
| 6.4 | **Reduced motion**: respects `prefers-reduced-motion` (no essential info lost) | ☐ |
| 6.5 | **Performance**: no jank on mid laptop; no runaway `requestAnimationFrame` loops | ☐ |

---

## 7. Interaction & conversion framing

| # | Checkpoint | Pass? |
|---|------------|-------|
| 7.1 | **One** dominant CTA (gold, clear size hierarchy) | ☐ |
| 7.2 | Primary hover: **subtle scale + brightness** (not elastic bounce) | ☐ |
| 7.3 | Secondary: **low contrast**, text-forward, **arrow / rule** (not button clone) | ☐ |
| 7.4 | Copy feels **consultative / editorial**, not SaaS template or hype | ☐ |

---

## 8. Authority & trust signals

| # | Checkpoint | Pass? |
|---|------------|-------|
| 8.1 | Metrics strip **specific** (14 days / 4s / 24/7) with refined micro type | ☐ |
| 8.2 | Grain / noise present at **low** opacity (texture, not dirt) | ☐ |
| 8.3 | Optional structure (grid / ring / waveform) **very low** opacity — reads as craft | ☐ |

---

## 9. Technical constraints

| # | Checkpoint | Pass? |
|---|------------|-------|
| 9.1 | **Next.js App Router** + client boundaries respected (`"use client"` where needed) | ☐ |
| 9.2 | **GSAP** timelines cleaned up (`context` + `revert` on unmount) | ☐ |
| 9.3 | No layout shift CLS spikes on load | ☐ |
| 9.4 | Touch / coarse pointer: cursor effects **degrade gracefully** | ☐ |

---

## 10. Final bar (“$50k+ agency”)

| # | Checkpoint | Pass? |
|---|------------|-------|
| 10.1 | **Directional energy** — something pulls gaze forward (contrast, motion, or gradient pull) | ☐ |
| 10.2 | **Stillness + precision** — motion slow, never chaotic | ☐ |
| 10.3 | If it reads as a **generic template**, ship is blocked | ☐ |

---

**Audit notes** (date / reviewer / build):

- …

---

## Implementation map (code)

| Area | Where |
|------|--------|
| Gaze timeline + light scroll parallax | `src/components/HeroSection.tsx` |
| Right panel: **single energy anchor** (orb + beam + outer field + one ring) | `energyAnchorRef` inside `visualRef` |
| Orb entrance (scale + opacity only) | GSAP `fromTo` on `energyAnchorRef` |
| Subtle field “breathe” + slow ring spin | `globals.css` `.hero-orb-breathe`; CSS `spin` 40s on ring |
| Depth strip (blur between columns, desktop) | Absolute `left-0 w-[45%]` + `backdrop-filter` + gradient mask |
| Primary CTA hover (scale + brightness) | `src/components/MagneticButton.tsx` (primary wrapper) |
| Grain + scroll indicator | `HeroSection.tsx` |
