<div align="center">
  <img src="./logo_astrorelics.jpg" alt="AstroRelics Logo" width="620" />

  # 🚀 AstroRelics

  > **Abandoned but not Forgotten — Interactive 3D Space Archaeology across Earth, the Moon, Mars, and Deep Space.**

  [![Live Demo](https://img.shields.io/badge/▶%20Live%20Demo-astrorelics--web.vercel.app-0ea5e9?style=for-the-badge)](https://astrorelics-web.vercel.app/)
  [![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
  [![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## 🌐 Live Demo

Explore the live application directly in your browser on Vercel:

👉 **[https://astrorelics-web.vercel.app/](https://astrorelics-web.vercel.app/)**

---

## 📖 About the Project

**AstroRelics** is a real-time, interactive 3D web experience dedicated to **space archaeology**. Rather than presenting space history through static 2D photographs or dry descriptive tables, the platform puts the user in control of a navigable astronomical environment spanning the **Earth–Moon–Mars** orbital corridor.

The hardware humanity has left beyond Earth is not mere space debris: these artifacts are enduring monuments of engineering and active scientific instruments that continue to reveal insights about our solar system. In AstroRelics, users travel between celestial bodies via smooth orbital transitions and inspect five iconic NASA artifacts in 360° — anchored to real geographic coordinates or drifting through deep space.

---

## ✨ Key Features

- **3D Orbital Navigation & Hyperspace Jumps:** Travel between **Earth**, the **Moon**, and **Mars** with collision-free mathematical trajectories, a dynamic starfield, procedural GLSL nebulae, and a warp-speed visual transition.
- **360° Interactive Inspection:** Explore automatically normalized `.glb` 3D models with free rotation, dynamic solar lighting, and custom atmospheric shaders tailored to each celestial body.
- **Real Geographic Surface Projection:** Ground pins mapped from real-world latitude and longitude coordinates onto 3D spherical planetary meshes on lunar plains and Martian craters.
- **Scientific Telemetry & Historical Context:** A dedicated telemetry drawer displaying engineering specifications, operational status, mission history, and documented scientific impact.
- **Interactive Investigation Missions (*Echoes of Space*):** An interactive mode where users investigate anomalous signals, examine historical clues, and reconstruct real space mission records.
- **Procedural Audio & Bilingual Support (EN/PT):** Real-time synthesized spatial sound effects via the native Web Audio API, instant English/Portuguese language switching, an animated astrolabe loading screen, and an automatic compatibility fallback for devices without WebGL.

---

## 🪐 Celestial Bodies & Modeled Artifacts

### Celestial Bodies
| Body | 3D Model | Visual & Shader Treatment |
| :--- | :--- | :--- |
| **Earth** | `3d_models/Earth_1_12756.glb` | 23.5° axial tilt and sky-blue Rayleigh atmospheric scattering shader with twilight terminator |
| **Moon** | `3d_models/moon_small.glb` | High-roughness PBR regolith material with no atmosphere to emphasize the lunar vacuum |
| **Mars** | `3d_models/24881_Mars_1_6792.glb` | 25.19° axial tilt and subtle Fresnel halo simulating Mars's thin $CO_2$ atmosphere |

### 5 Historic NASA Artifacts
1. **J002E3 · Saturn V S-IVB Third Stage (Apollo 12)** — *Deep Space (Earth–Moon Corridor)*  
   Launched in 1969, lost for 33 years, and rediscovered in 2002 as a suspected asteroid until its titanium dioxide ($TiO_2$) white paint spectral signature revealed its human origin.
2. **LRRR Laser Ranging Retroreflector (Apollo 11, 14 & 15)** — *Moon · Mare Tranquillitatis*  
   A passive 100-prism fused-quartz optical array deployed in 1969 that remains active after more than 55 years, proving the Moon recedes from Earth at 3.8 cm per year.
3. **"Snoopy" Lunar Module (Apollo 10 · LM-4)** — *Deep Space (Heliocentric Orbit)*  
   The ascent stage from the May 1969 lunar landing dress rehearsal; the only crewed spacecraft still drifting intact and uninhabited around the Sun.
4. **Opportunity Rover (MER-B)** — *Mars · Meridiani Planum*  
   Engineered for a 90-sol mission, Opportunity operated for nearly 15 years and traveled 45.16 km across Mars before falling silent during the 2018 global dust storm.
5. **Ingenuity Mars Helicopter (Mars 2020)** — *Mars · Jezero Crater*  
   The first aircraft to achieve powered, controlled flight on another planet, completing 72 flights between 2021 and 2024 (far surpassing its original 5-flight plan).

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **3D Graphics & Shaders:** Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), custom GLSL
- **Audio & UI:** Native Web Audio API, Lucide React, and custom SVG vector illustrations

---

## 💻 Running the Project Locally

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (included with Node.js)
- A modern browser with **WebGL** support

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/AstroRelics/astrorelics-web.git

# 2. Navigate into the project directory
cd astrorelics-web

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Once `npm run dev` is running, open the local URL printed in your terminal (typically `http://localhost:5173`).

### Production Build

```bash
# Build optimized production assets into dist/
npm run build

# Preview the production build locally
npm run preview
```

---

## 📁 Project Structure

```text
astrorelics/
├── 3d_models/                  # .glb 3D models of celestial bodies and space artifacts
├── public/                     # Static assets (logos, ambient audio)
├── src/
│   ├── components/
│   │   ├── scene/              # 3D canvas, orbital controls, hyperspace jump, lighting & shaders
│   │   └── ui/                 # Top HUD, telemetry drawer, missions, loading screen & WebGL fallback
│   ├── config/
│   │   ├── celestialBodies.ts  # Physical, visual & shader configuration for Earth, Moon & Mars
│   │   ├── spaceArtifacts.ts   # Metadata, coordinates & specs for the 5 NASA artifacts
│   │   └── missions/           # Scripts and clues for the interactive investigation mode
│   ├── types/                  # TypeScript definitions for scene state and missions
│   └── utils/                  # Box3 model preloader, orbital math, i18n & procedural audio
├── index.html
├── package.json
└── vite.config.ts
```

---

## 📚 Scientific Data Sources

- [NASA Science 3D Resources](https://science.nasa.gov/3d-resources/) — Official 3D models of planets, moons, and spacecraft
- [NASA NSSDCA Planetary Fact Sheets](https://nssdc.gsfc.nasa.gov/planetary/factsheet/) — Physical and orbital telemetry
- [NASA JPL CNEOS](https://cneos.jpl.nasa.gov/) — Orbital records and spectral analysis of J002E3
- [NASA Mars Exploration Program](https://science.nasa.gov/mars/) — Opportunity and Ingenuity mission data
- [International Laser Ranging Service (ILRS)](https://ilrs.gsfc.nasa.gov/) — Lunar laser ranging telemetry for LRRR

---

## 📄 License

Distributed under the **MIT License**.
