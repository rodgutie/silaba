# Sílaba — DESIGN.md (v3: Oxford, navy + gold)

Direction: **editorial academic**. Feels like a university press or a scholarly journal, but modern and easy to use. Navy carries trust; gold adds heritage. Serif headings say "academia". Brand motif: the syllable dot "·" (sí·la·ba) in gold, used in the logo, as a gold dot grid on navy sections and in the seal.

Not based on reference sites (UXKIN not connected). Built from the brief and the rules below.

## Color

| Token | Value | Role |
|---|---|---|
| `navy-900` | #13294B | Hero, dark sections, primary buttons on light, headings accents |
| `navy-950` | #0B1A33 | Footer |
| `navy-700` | #1F3A66 | Profile banners, secondary dark surfaces |
| `navy-500` | #1F4E8C | Hover on navy buttons |
| `gold-500` | #C9A24A | Accent: CTA on navy (navy text), rules, logo dots, seal. Never as text on light backgrounds |
| `gold-700` | #8A6A1F | Gold text on light: eyebrows, labels, section numerals (4.6:1 on ivory) |
| `ivory` | #F7F5EF | Page background |
| `white` | #FFFFFF | Cards, alternating sections |
| `line` | #E2DDD0 | Hairlines, borders |
| `ink` | #141A26 | Body text |
| `muted` | #4A5568 | Secondary text |
| On navy | #FFFFFF text · #C9D2E1 secondary | |
| `success` | #1E7B4F | Free access |
| `warning` | #9A5B00 on #FBF1DC | May require subscription |

## Typography

- Headings: **Source Serif 4** 500–600, italic for emphasis words. Body/UI: **Inter** 400/500/600.
- Scale (desktop / phone): display 72/42 lh 1.02 · h1 48/34 · h2 44/30 lh 1.12 · h3 24/21 · lead 20/18 lh 1.55 · body 17 lh 1.6 · small 14 · eyebrow 13 caps +0.16em (gold-700 on light, gold-500 on navy).
- Section numerals: roman (I., II., III.) in serif, gold.

## Spacing and layout

- 8-based: 4 8 12 16 24 32 48 64 104 (section) 120.
- Content width 1200; editorial left column 120px for section numerals, collapses on phone.
- Rhythm: navy → white/ivory → hairline-ruled lists → navy → framed "convocatoria" → white → navy.

## Shape and depth

- Radius small and sober: 4 (buttons, inputs), 10 (cards, mockups), 999 (avatars, chips).
- Hairlines over shadows: 1px `line`, 1px gold for emphasis, double gold frame for certificates.
- One shadow for product mockups: 0 24px 60px rgba(19,41,75,.25).

## Components

- **Primary on light**: navy bg, white text; hover navy-500. **CTA on navy**: gold bg, navy text; hover #D9B65F. **Secondary**: 1px navy border. **Quiet**: underlined link.
- Focus: 3px gold outline, 3px offset.
- **Lists over cards**: courses, steps and plan features as hairline-ruled rows with serif titles.
- **Seal**: circular gold emblem with ring text, slow rotation (off with reduced motion).
- **Convocatoria frame**: double 1px gold border, white inside.

## Imagery and icons

- Product mockups as main imagery; real photos of pilot professors later (natural light, real classrooms, no stock clichés).
- Gold dot grid on navy only. Thin outline icons; no emoji.
