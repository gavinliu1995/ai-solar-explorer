# Argonaut / 寰宇星舟

Argonaut is an independent educational prototype for mission-guided solar system exploration.

## Features

- Mission Control deep-space console
- Mission Experience Loop with guided steps, completion feedback, and Exploration Log
- Complete Solar System Map from Mercury to Neptune
- Sun, Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, and Ceres
- Asteroid Belt and Kuiper Belt region targets
- Major Moon Systems for Jupiter, Saturn, Uranus, and Neptune
- Solar System / Celestial Sphere modes
- Constellation layer, ecliptic plane, and zodiac markers
- Local texture loading with procedural fallback materials

## Local Textures

Optional texture files live in `public/textures/planets/`. If a file is missing, Argonaut falls back to procedural materials and the scene should continue to render.

Visual references may use public NASA/JPL resources or local educational textures. Argonaut is an independent educational prototype and is not affiliated with or endorsed by NASA.

视觉贴图可使用公开 NASA/JPL 资源或本地教育用途贴图。寰宇星舟是独立教育原型，不隶属于 NASA，也不代表 NASA 背书。

Do not use NASA logos or language implying NASA affiliation, authorization, or endorsement.

## Getting Started

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```
