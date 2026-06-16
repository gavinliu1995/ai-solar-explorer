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
- `sun.jpg` (optional)
- `venus.jpg` (optional)
- `mercury.jpg` (optional)

If a file is missing, the scene safely falls back to procedural materials. The
Canvas should continue to render even when this directory is empty.

Texture source notes:

- The current local files are educational visualization textures from the Solar
  System Scope texture resource pack: `https://www.solarsystemscope.com/textures/`.
- The Solar System Scope texture page states that the pack is based on NASA
  elevation and imagery data and is distributed under the Attribution 4.0
  International license (CC BY 4.0).
- If replacing these files, prefer NASA / JPL public resources, NASA 3D
  Resources, Solar System Scope textures, or other clearly licensed educational
  visualization assets.
- Do not use NASA logos, NASA mission branding, or language implying NASA
  affiliation or endorsement.

Disclaimer:

Argonaut is an independent educational prototype and is not affiliated with or
endorsed by NASA.
