---
name: Cinematic Deep Space
colors:
  surface: '#131319'
  surface-dim: '#131319'
  surface-bright: '#39383f'
  surface-container-lowest: '#0e0e14'
  surface-container-low: '#1b1b21'
  surface-container: '#1f1f25'
  surface-container-high: '#2a2930'
  surface-container-highest: '#35343b'
  on-surface: '#e4e1ea'
  on-surface-variant: '#c7c4d8'
  inverse-surface: '#e4e1ea'
  inverse-on-surface: '#303037'
  outline: '#918fa1'
  outline-variant: '#464555'
  surface-tint: '#c3c0ff'
  primary: '#c3c0ff'
  on-primary: '#1d00a5'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#4d44e3'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#006a7c'
  on-tertiary-container: '#93e8ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#131319'
  on-background: '#e4e1ea'
  surface-variant: '#35343b'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: 0.1em
  display-lg-mobile:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-tech:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.2'
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The brand personality is immersive, cinematic, and frontier-pushing. It targets a tech-literate audience of creators and music enthusiasts who view AI as a collaborative cosmic force. The UI must evoke the feeling of being inside a high-end spacecraft or a futuristic music production suite floating in a nebula.

The design style is a sophisticated blend of **Glassmorphism** and **Futuristic Minimalism**. It utilizes deep atmospheric depth, where the background isn't just a color but a "space" containing particle fields and soft, distant light sources. UI elements should feel like holographic projections—translucent, glowing, and lightweight—rather than heavy physical objects. Visual hierarchy is established through "light-as-density," where more important elements emit a stronger inner glow or have a higher backdrop blur.

## Colors

The palette is rooted in the "Deepest Space Black" (#020205), which serves as the canvas for all interactions. 

- **Primary (Electric Indigo):** Used for core interactive states and primary branding moments. It represents the "current" of the AI.
- **Secondary (Neon Violet):** Used for creative flourishes, AI-generated content indicators, and secondary highlights.
- **Tertiary (Plasma Blue):** Reserved for technical indicators, active playback states, and data visualizations.
- **Accent (Warm Coral):** A high-energy contrast color used sparingly for critical actions (Record, Stop, Delete) or "Energy" markers in the music generation process.

Backgrounds should rarely be flat. Instead, use radial gradients of Indigo and Violet at 5-10% opacity to create "nebula" pockets behind content clusters.

## Typography

This design system uses a tri-font strategy to balance cinematic impact with technical clarity:

1.  **Sora (Display):** Geometric and wide, used for headlines. Always applied with increased letter-spacing (`0.05em` to `0.1em`) to enhance the futuristic, "stretched" aesthetic of space travel.
2.  **Inter (UI/Body):** A highly legible sans-serif for standard interface elements, settings, and descriptive text. It provides a grounded, professional feel amidst the atmospheric effects.
3.  **JetBrains Mono (Technical):** Used for metadata (BPM, Key, Duration), code snippets, or AI status readouts. It reinforces the "under-the-hood" intelligence of the app.

All headings should be treated with a subtle text-shadow of their own color (at 20% opacity) to create a "holographic bleed" effect.

## Layout & Spacing

The layout philosophy is **Atmospheric Fluidity**. Rather than rigid boxes, content should feel like it's floating in a structured vacuum.

- **Grid:** Use a 12-column fluid grid for desktop with generous 64px outer margins to give the content "room to breathe."
- **Rhythm:** An 8px linear scale is used for all padding and margins. 
- **Adaptation:** On mobile, margins shrink to 20px, and the grid collapses to a single column. Horizontal scrolling "cards" should be used for music libraries to maintain a cinematic filmstrip feel.
- **Negative Space:** Use intentionally large vertical gaps (64px+) between major sections to emphasize the "Deep Space" theme.

## Elevation & Depth

Depth is not communicated via traditional drop shadows, but through **Tonal Luminosity and Backdrop Blurs**:

1.  **Level 0 (Deepest):** The background (#020205) with intermittent "star" particles (0.5px white dots at varying opacities).
2.  **Level 1 (Panels):** Surface opacity at 4-8% with a `blur-2xl` (40px+) backdrop filter. Borders are 1px, top-down linear gradients (e.g., White at 20% to Transparent).
3.  **Level 2 (Active/Hover):** Surface opacity increases to 12%. The border color shifts to the Primary or Secondary color with a subtle outer glow (`box-shadow: 0 0 15px rgba(Primary, 0.3)`).
4.  **Level 3 (Popovers/Modals):** High contrast. Darker background (20% opacity), heavy blur, and a distinct "inner glow" on the top edge to simulate light hitting the edge of a glass pane.

## Shapes

The shape language is dominated by **Pills and Orbs**. There are no sharp corners in this design system, as sharp edges break the "fluid energy" metaphor.

- **Base Radius:** 16px (`rounded-2xl`) for cards and panels.
- **Pill Radius:** Use `rounded-full` for all buttons, chips, and input fields.
- **Interactive Elements:** Circular buttons (Orbs) are used for playback controls (Play/Pause/Skip), often featuring a pulsing glow animation when active.

## Components

### Buttons
- **Primary:** Pill-shaped, Electric Indigo background with a subtle inner "plasma" glow. On hover, the outer glow intensifies.
- **Ghost:** Translucent with a 1px Indigo border. Used for secondary actions.

### Translucent Chat Panels
For AI interactions, use a "glass-pane" style. Messages appear as floating bubbles with a `40px` backdrop blur. The AI's responses should have a faint Neon Violet border to distinguish them from user input.

### Animated Waveforms
Music playback is represented by a dynamic, multi-colored waveform. Use Plasma Blue for the played portion and a low-opacity Indigo for the upcoming track. The waveform should "pulse" or vibrate vertically based on the frequency data of the audio.

### Pulsing Energy Orbs
Used for the "AI is thinking" state. A central orb of Plasma Blue that expands and contracts with a soft-focus blur (30px), casting light on surrounding UI elements.

### Input Fields
Pill-shaped with a 5% white fill. When focused, the border transitions to a gradient of Indigo to Violet, and the text-cursor becomes a glowing Plasma Blue line.