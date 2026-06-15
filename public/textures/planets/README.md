# Planet Texture Assets

This directory stores local planet textures used by AI Solar Explorer.

The app looks for these filenames:

- `earth_day.jpg`
- `earth_clouds.png`
- `earth_night.jpg` (optional)
- `mars.jpg`
- `moon.jpg`
- `jupiter.jpg`
- `saturn.jpg`
- `saturn_ring.png`
- `sun.jpg` (optional)
- `venus.jpg` (optional)
- `mercury.jpg` (optional)

The current implementation safely falls back to procedural materials if any
file is missing, so the 3D scene remains usable without local textures.

Texture source notes:

- Current local textures are downloaded from the Solar System Scope texture
  resource pack: `https://www.solarsystemscope.com/textures/`.
- The Solar System Scope texture page states the pack is based on NASA elevation
  and imagery data and distributed under the Attribution 4.0 International
  license (CC BY 4.0).
- If replacing these files, prefer NASA / JPL public resources, NASA 3D
  Resources, Solar System Scope textures, or other clearly licensed educational
  visualization assets.
- Do not use NASA logos, NASA mission branding, or language implying NASA
  endorsement.

Disclaimer:

AI Solar Explorer is an independent educational prototype. It is not affiliated
with or endorsed by NASA.
