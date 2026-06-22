# Argonaut / 寰宇星舟

Argonaut is an independent educational prototype for mission-guided solar system exploration.

## Features

- Mission Control deep-space console
- Mission Experience Loop with guided steps, completion feedback, and Captain's Log
- Grand Tour route-based exploration
- Tour Catalog with Grand Tour, Inner Worlds, Giant Planets, and Outer Frontier routes
- Journey Progress and Captain's Log
- Mission Archives with simplified spacecraft route visualizations
- Archive Expeditions, Discovery Cards, and related archive routes by target
- Complete Solar System Map from Mercury to Neptune
- Sun, Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, and Ceres
- Asteroid Belt and Kuiper Belt region targets
- Major Moon Systems for Jupiter, Saturn, Uranus, and Neptune
- Solar System / Celestial Sphere modes
- Constellation layer, ecliptic plane, and zodiac markers
- Local texture loading with procedural fallback materials
- Outer worlds support local textures for Uranus, Neptune, Pluto, and Ceres, with procedural fallbacks

## Roadmap

- v0.1 Mission Console
- v0.2 Mission Experience Loop
- v0.3 Celestial Context
- v0.4 Visual Reality
- v0.5 Complete Solar System
- v0.6 Grand Tour
- v0.7 Mission Archives

## Mission Archives

Archive mission routes are simplified educational visualizations and not precise mission trajectories. They are local static profiles for exploring representative spacecraft expeditions such as Voyager, Cassini, Juno, New Horizons, Parker Solar Probe, Perseverance, Tianwen-1, Galileo, Dawn, and Europa Clipper.

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
