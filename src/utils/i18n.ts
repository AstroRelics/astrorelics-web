import React, { createContext, useContext } from 'react';
import { CELESTIAL_BODIES } from '../config/celestialBodies';
import { SPACE_ARTIFACTS } from '../config/spaceArtifacts';
import {
  CelestialBodyConfig,
  CelestialBodyId,
  SpaceArtifactConfig,
  SpaceArtifactId,
} from '../types/experience';

export type Language = 'pt' | 'en';

const LANG_STORAGE_KEY = 'beyond_the_mission_lang_v1';

export function loadLanguage(): Language {
  if (typeof window === 'undefined') return 'pt';
  try {
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'en' || saved === 'pt') return saved;
  } catch {
    // noop
  }
  return 'pt';
}

export function saveLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // noop
  }
}

export interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

export const LanguageContext = createContext<LanguageContextValue>({
  lang: 'pt',
  setLang: () => {},
  toggleLang: () => {},
});

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}

const BODY_EN_TRANSLATIONS: Record<
  CelestialBodyId,
  Pick<CelestialBodyConfig, 'name' | 'subtitle' | 'description' | 'telemetry'>
> = {
  earth: {
    name: 'Earth',
    subtitle: 'Cradle of Space Exploration · Point of Origin',
    description:
      'Our ocean world protected by a thin atmospheric layer. From here launched every probe, lunar module, and rover sent to explore the Solar System.',
    telemetry: {
      classification: 'Rocky Planet · 1.00 AU',
      meanRadius: '6,371 km',
      gravity: '9.81 m/s²',
      orbitalContext: 'Deep Space Network & orbital laser tracking base',
      futureMissionsPreview: 'Deep Space Network & Lunar Laser Ranging',
    },
  },
  moon: {
    name: 'Moon',
    subtitle: 'Earth’s Natural Satellite · Silent Archive',
    description:
      'Rocky surface preserved in an airless vacuum. It holds descent stages, passive instruments, and laser reflectors from the Apollo missions that still reply to light pulses sent from Earth.',
    telemetry: {
      classification: 'Natural Satellite · 384,400 km',
      meanRadius: '1,737 km',
      gravity: '1.62 m/s²',
      orbitalContext: 'Synchronous rotation · Airless vacuum',
      futureMissionsPreview: 'Apollo 11, 14 & 15 Laser Retroreflectors',
    },
  },
  mars: {
    name: 'Mars',
    subtitle: 'The Red Planet · Frontier of the Rovers',
    description:
      'A cold iron-oxide desert with giant canyons and a thin atmosphere. Its plains hold historic rovers and probes that fell silent after global dust storms.',
    telemetry: {
      classification: 'Rocky Planet · 1.52 AU',
      meanRadius: '3,389 km',
      gravity: '3.71 m/s²',
      orbitalContext: 'Thin CO₂ atmosphere · Seasonal dust storms',
      futureMissionsPreview: 'Meridiani Planum & Jezero Crater Relics',
    },
  },
};

export function getLocalizedBody(
  id: CelestialBodyId,
  lang: Language
): CelestialBodyConfig {
  const base = CELESTIAL_BODIES[id];
  if (lang === 'pt') return base;
  return {
    ...base,
    ...BODY_EN_TRANSLATIONS[id],
  };
}

const ARTIFACT_EN_TRANSLATIONS: Record<
  SpaceArtifactId,
  Pick<
    SpaceArtifactConfig,
    | 'name'
    | 'shortName'
    | 'mission'
    | 'year'
    | 'statusBadge'
    | 'locationLabel'
    | 'coordinatesLabel'
    | 'description'
    | 'history'
    | 'importance'
    | 'specs'
  >
> = {
  j002e3_s_ivb: {
    name: 'J002E3 · S-IVB Rocket Stage (Apollo 12)',
    shortName: 'J002E3 (Apollo 12)',
    mission: 'Apollo 12 Mission · AS-507',
    year: '1969 · Rediscovered in 2002',
    statusBadge: 'Drifting in Space (Solar / Earth-Moon Orbit)',
    locationLabel: 'Earth–Moon Orbital Corridor / Solar Orbit',
    coordinatesLabel: 'L1 Lagrange Point · Temporary Capture (2002–2003)',
    description:
      'Third stage (S-IVB-507) of the Apollo 12 Saturn V rocket, 6.6 meters wide and 17.8 meters long. Built with a J-2 rocket engine, guidance ring, attitude thrusters, and white titanium-dioxide thermal paint.',
    history:
      'Launched on November 14, 1969, this rocket stage pushed the Apollo 12 astronauts toward the Moon. After 33 years drifting around the Sun, astronomer Bill Yeung spotted it orbiting Earth in September 2002 and cataloged it as suspected asteroid "J002E3". Light measurements revealed NASA’s white rocket paint: the 1969 rocket stage had briefly returned to visit Earth before escaping again in 2003.',
    importance:
      'Became the most famous case of "space archaeology" in history. It proved how human objects in deep space can be recaptured by Earth’s gravity decades later and taught scientists how to tell natural asteroids apart from space-age relics.',
    specs: [
      { label: 'Real Dimensions', value: '17.8 m × 6.60 m' },
      { label: 'Dry Mass', value: '~9,559 kg' },
      { label: 'Propulsion', value: '1× Rocketdyne J-2 Engine' },
      { label: 'Optical Signature', value: 'White Rocket Paint (TiO₂)' },
    ],
  },
  apollo_lrrr: {
    name: 'Laser Retroreflector (LRRR)',
    shortName: 'Lunar Reflector',
    mission: 'Apollo 11, 14 & 15',
    year: '1969 – Present (Active)',
    statusBadge: 'Active on the Lunar Surface for 55+ years',
    locationLabel: 'Moon · Sea of Tranquility (Tranquility Base)',
    coordinatesLabel: '0.6734° N · 23.4729° E (Apollo 11)',
    description:
      'Passive aluminum optical panel (46 cm × 46 cm) holding a 10 × 10 grid of 100 fused-silica glass corner-cube prisms. Includes an adjustable tilt stand, solar alignment compass, and bubble level.',
    history:
      'Placed by Buzz Aldrin and Neil Armstrong on July 20, 1969 in the Sea of Tranquility. Because it is 100% passive—requiring no batteries, wires, or electronics—it has survived the Moon’s extreme temperatures intact for over five decades.',
    importance:
      'The longest-running Apollo experiment, still used every day. Observatories on Earth fire laser pulses at its prisms and time the returning light to measure the Earth–Moon distance within millimeters, proving the Moon moves 3.8 cm away from Earth each year.',
    specs: [
      { label: 'Optical Grid', value: '100 Prisms (10 × 10)' },
      { label: 'Prism Material', value: 'High-Purity Quartz Glass' },
      { label: 'Panel Size', value: '46 cm × 46 cm' },
      { label: 'Power Needed', value: '0 W (100% Passive)' },
    ],
  },
  apollo_snoopy_lm: {
    name: 'Lunar Module "Snoopy" (Apollo 10)',
    shortName: '"Snoopy" Module',
    mission: 'Apollo 10 Mission · LM-4',
    year: 'May 1969 · Tracked in 2019',
    statusBadge: 'Drifting in Space (Solar Orbit)',
    locationLabel: 'Deep Space · Solar Orbit between Earth, Moon & Mars',
    coordinatesLabel: 'Heliocentric Orbit (~0.98 to 1.03 AU)',
    description:
      'Apollo 10 Lunar Module ascent stage nicknamed "Snoopy", wrapped in gold thermal foil and aluminum shielding, with 16 maneuvering thrusters, radar antenna, and triangular viewing windows.',
    history:
      'In May 1969, two months before Apollo 11, astronauts Thomas Stafford and Eugene Cernan flew "Snoopy" down to 14.4 km above the Moon in a full dress rehearsal for the first lunar landing. Its ascent stage was then sent into orbit around the Sun, becoming the only once-crewed spacecraft still drifting intact in deep space.',
    importance:
      'Tested every critical system that made the Apollo 11 Moon landing possible weeks later. After being lost for 50 years, astronomers tracked its probable solar orbit in 2019.',
    specs: [
      { label: 'Official Name', value: 'Grumman LM-4 "Snoopy"' },
      { label: 'Closest Lunar Pass', value: '14.4 km (47,400 ft)' },
      { label: 'Orbital Mass', value: '~2,150 kg (Ascent Stage)' },
      { label: 'Current Status', value: 'Intact Capsule in Solar Orbit' },
    ],
  },
  opportunity_rover: {
    name: 'Opportunity Rover (MER-B)',
    shortName: 'Opportunity Rover',
    mission: 'Mars Exploration Rover · MER-B',
    year: '2004 – 2018 (14 years, 138 days)',
    statusBadge: 'Silent on Mars after Global Dust Storm',
    locationLabel: 'Mars · Meridiani Planum (Perseverance Valley)',
    coordinatesLabel: '2.046° S · 5.478° W (Endeavour Crater)',
    description:
      'Six-wheeled solar-powered robotic geologist equipped with wing-like solar panels, a panoramic camera mast, a communications antenna, and a robotic arm with a rock-grinding tool and sensors.',
    history:
      'Landed on Mars on January 25, 2004 for a planned mission of just 90 Martian days and 1 km of driving. It exceeded its planned lifespan by more than 55 times: exploring for nearly 15 years and driving 45.16 km (a full marathon on another world) until a planet-wide dust storm blocked the Sun in June 2018.',
    importance:
      'Discovered tiny iron-rich spheres ("blueberries") and clay minerals that proved Mars once had liquid water on its surface, transforming our understanding of the Red Planet.',
    specs: [
      { label: 'Planned vs. Actual Life', value: '90 days → 5,111 Martian days' },
      { label: 'Distance Driven', value: '45.16 km (Mars Record)' },
      { label: 'Rover Mass', value: '185 kg' },
      { label: 'Reason for Silence', value: 'Global Dust Storm Blocking Sunlight' },
    ],
  },
  ingenuity_helicopter: {
    name: 'Ingenuity Mars Helicopter',
    shortName: 'Ingenuity',
    mission: 'Mars 2020 · Perseverance & Ingenuity',
    year: '2021 – 2024 (72 Flights)',
    statusBadge: 'Retired on Mars ("Valinor Hills")',
    locationLabel: 'Mars · Jezero Crater (Valinor Hills)',
    coordinatesLabel: '18.499° N · 77.315° E',
    description:
      'Ultralight autonomous helicopter (weighing just 1.8 kg on Earth) with twin counter-rotating carbon-fiber blades spinning at over 2,500 RPM, a top solar panel, and four landing legs.',
    history:
      'On April 19, 2021, Ingenuity achieved the first powered, controlled flight on another planet. Built as a 30-day test for just 5 flights, it served as an aerial scout for nearly three years and completed 72 flights before a rotor blade was damaged during landing in January 2024.',
    importance:
      'Proved that aircraft can fly in an atmosphere 100 times thinner than Earth’s, paving the way for future aerial explorers on Mars and Saturn’s moon Titan.',
    specs: [
      { label: 'Planned vs. Actual Flights', value: '5 flights → 72 flights' },
      { label: 'Blade Speed', value: '~2,537 RPM (Carbon Fiber)' },
      { label: 'Total Mass', value: '1.8 kg (1.2 m Wingspan)' },
      { label: 'Total Flight Time', value: '128.8 minutes (17.0 km)' },
    ],
  },
};

export function getLocalizedArtifact(
  id: SpaceArtifactId,
  lang: Language
): SpaceArtifactConfig {
  const base = SPACE_ARTIFACTS[id];
  if (lang === 'pt') return base;
  return {
    ...base,
    ...ARTIFACT_EN_TRANSLATIONS[id],
  };
}
