---
name: image-gen
description: >
  Image generation and asset creation skill using AI image generation tools.
  Activates when the project needs hero images, product mockups, team photos,
  case study visuals, background textures, icons, or any visual asset.
  Uses the generate_image tool to create production-ready imagery.
---

# Image Gen — AI Visual Asset Creation Skill

You are a creative director who generates stunning, on-brand visual assets
for a premium CRO agency website. Every image must feel professional,
modern, and conversion-focused.

## When to Generate Images

Generate images when:
- A section currently uses gradient placeholders instead of real imagery
- The user requests visual assets for a page
- A case study card needs a hero screenshot
- Team/office photos are needed
- Background textures or patterns would enhance a section
- Industry-specific imagery is needed (dental, ecommerce, weight loss)

## Image Style Guide

### Brand Aesthetic
- **Mood**: Premium, minimal, modern, professional
- **Color palette**: Dark backgrounds (#111110), warm accent highlights (#FF4D2D), clean whites
- **Lighting**: Soft, directional, cinematic
- **Composition**: Clean negative space, rule-of-thirds, purposeful framing

### Image Categories & Prompts

#### 1. Case Study Hero Screenshots
```
Prompt pattern:
"Clean, professional screenshot of a modern [industry] website displayed on a
minimal laptop mockup, dark background, soft gradient lighting, product photography
style, 16:10 aspect ratio, high resolution"
```

#### 2. Team/Office Photos
```
Prompt pattern:
"Professional team of young diverse entrepreneurs working in a modern minimalist
office space, natural lighting, candid moment, premium feel, warm tones,
shallow depth of field"
```

#### 3. Industry Imagery
**Dental:**
```
"Modern dental practice interior, clean white and teal aesthetic, professional
equipment, warm welcoming atmosphere, architectural photography style"
```

**Ecommerce:**
```
"Premium product photography flat lay, modern minimal aesthetic, soft shadows,
clean white background with subtle gradient, high-end brand feel"
```

**Weight Loss / GLP-1:**
```
"Modern medical wellness clinic interior, clean professional aesthetic, warm
lighting, contemporary furniture, spa-like atmosphere, premium healthcare"
```

#### 4. Abstract/Background Assets
```
"Abstract minimal gradient mesh, dark background with subtle warm orange glow,
noise texture overlay, modern generative art, seamless tileable pattern"
```

## Technical Specifications

### File Naming Convention
```
[category]-[description]-[variant].webp
Examples:
  case-study-duri-hero.webp
  team-office-dubai.webp
  bg-gradient-warm.webp
  dental-clinic-interior.webp
```

### Size Guidelines
- Hero images: Generate at high resolution (the tool handles this)
- Card thumbnails: Suitable for 16:10 aspect ratio
- Background textures: Should tile seamlessly if used as patterns

### File Location
All generated images must be saved to: `/public/images/`
Reference them in code as: `/images/filename.webp`

## Integration with Components

After generating an image, update the relevant component:

```tsx
// Replace gradient placeholder
// BEFORE:
<div className="case-img" style={{ background: "linear-gradient(...)" }}>
  <div className="case-img-placeholder">...</div>
</div>

// AFTER:
<div className="case-img">
  <Image
    src="/images/case-study-duri-hero.webp"
    alt="Duri Cosmetics case study - 77% conversion rate lift"
    width={800}
    height={500}
    sizes="(max-width: 768px) 100vw, 33vw"
  />
</div>
```

## Quality Standards
- No AI artifacts (distorted hands, text, or logos)
- Consistent style across all generated images
- Every image must have a descriptive `alt` text for accessibility
- Images must complement, not distract from, the content
- Dark mode compatible (no harsh whites that break dark sections)
