# Planet Texture Assets

This directory stores local planet textures used by Argonaut.

The app supports these filenames:

- `earth_day.jpg`
- `earth_clouds.png`
- `earth_night.jpg` (optional)
- `moon.jpg`
- `mars.jpg`
- `jupiter.jpg`
- `saturn.jpg`
- `saturn_ring.png`
- `uranus.jpg`
- `neptune.jpg`
- `pluto.jpg`
- `ceres.jpg`
- `sun.jpg` (optional)
- `venus.jpg` (optional)
- `mercury.jpg` (optional)

Outer worlds supported in v0.6.1:

- `uranus.jpg`
- `neptune.jpg`
- `pluto.jpg`
- `ceres.jpg`

Optional future moon textures:

- `io.jpg`
- `europa.jpg`
- `ganymede.jpg`
- `callisto.jpg`
- `titan.jpg`
- `enceladus.jpg`
- `triton.jpg`

If a file is missing, the scene safely falls back to procedural materials. The
Canvas should continue to render even when this directory is empty.

Texture source notes:

- The current local files are educational visualization textures from the Solar
  System Scope texture resource pack: `https://www.solarsystemscope.com/textures/`.
- The Solar System Scope texture page states that the pack is based on NASA
  elevation and imagery data and is distributed under the Attribution 4.0
  International license (CC BY 4.0).
- `pluto.jpg` uses the JPL Pluto Color Map image asset:
  `https://www.jpl.nasa.gov/images/pia11707-pluto-color-map/`.
- If replacing these files, prefer NASA / JPL public resources, NASA 3D
  Resources, Solar System Scope textures, or other clearly licensed educational
  visualization assets.
- These files are optional. If a texture is absent or fails to load, Argonaut
  uses procedural fallback materials for the target surface.
- Do not use unknown images or assets with unclear copyright restrictions.
- Do not use NASA logos, NASA mission branding, or language implying NASA
  affiliation or endorsement.

Disclaimer:

Argonaut is an independent educational prototype and is not affiliated with or
endorsed by NASA.

视觉贴图可使用公开 NASA/JPL 资源或本地教育用途贴图。寰宇星舟是独立教育原型，不隶属于 NASA，也不代表 NASA 背书。
