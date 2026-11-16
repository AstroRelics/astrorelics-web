import type { MissionDefinition, MissionId } from '../../types/mission';
import type { Language } from '../../utils/i18n';
import { getOpportunityMission, OPPORTUNITY_MISSION_PT } from './opportunityMission';

export const INCOMING_MISSIONS_PT: MissionDefinition[] = [
  {
    id: 'apollo_snoopy_drift',
    title: 'Snoopy – A Órbita Solitária',
    subtitle: 'Módulo Lunar da Apollo 10 no Espaço Profundo',
    missionBadge: 'APOLLO 10 · NASA',
    locationLabel: 'Espaço Profundo (Órbita Solar)',
    yearLabel: '1969 – Presente',
    relatedBodyId: 'moon',
    relatedArtifactId: 'apollo_snoopy_lm',
    accentColor: '#FBBF24',
    comingSoon: true,
    introBriefing:
      'Após o voo de teste para o pouso na Lua em maio de 1969, a cabine "Snoopy" foi enviada para orbitar o Sol. Em breve você poderá comandar essa história.',
    initialTelemetry: {
      battery: 42,
      temperatureC: -18,
      scienceDataMb: 8,
    },
    paths: [],
    nodes: {},
    endings: {},
    endingOrder: [],
  },
  {
    id: 'ingenuity_final_flight',
    title: 'Ingenuity – O Último Voo em Marte',
    subtitle: 'O 72º Voo do Primeiro Helicóptero em Outro Planeta',
    missionBadge: 'HELICÓPTERO INGENUITY · NASA',
    locationLabel: 'Cratera Jezero, Marte',
    yearLabel: '2021 – 2024 (72 Voos)',
    relatedBodyId: 'mars',
    relatedArtifactId: 'ingenuity_helicopter',
    accentColor: '#38BDF8',
    comingSoon: true,
    introBriefing:
      'Sobre dunas de areia na Cratera Jezero, o pequeno helicóptero enfrenta seu 72º e último pouso. Em breve disponível.',
    initialTelemetry: {
      battery: 34,
      temperatureC: -55,
      scienceDataMb: 16,
    },
    paths: [],
    nodes: {},
    endings: {},
    endingOrder: [],
  },
];

export const INCOMING_MISSIONS_EN: MissionDefinition[] = [
  {
    ...INCOMING_MISSIONS_PT[0],
    title: 'Snoopy – The Lonely Orbit',
    subtitle: 'Apollo 10 Lunar Module in Deep Space',
    locationLabel: 'Deep Space (Solar Orbit)',
    yearLabel: '1969 – Present',
    introBriefing:
      'After the dress rehearsal for the first Moon landing in May 1969, the "Snoopy" cabin was sent into orbit around the Sun. Coming soon.',
  },
  {
    ...INCOMING_MISSIONS_PT[1],
    title: 'Ingenuity – The Final Flight on Mars',
    subtitle: 'Flight 72 of the First Helicopter on Another Planet',
    missionBadge: 'INGENUITY HELICOPTER · NASA',
    locationLabel: 'Jezero Crater, Mars',
    yearLabel: '2021 – 2024 (72 Flights)',
    introBriefing:
      'Above featureless sand dunes in Jezero Crater, the first interplanetary helicopter faces its 72nd and final landing. Coming soon.',
  },
];

export const MISSIONS: Record<MissionId, MissionDefinition> = {
  opportunity_deep_journey: OPPORTUNITY_MISSION_PT,
  apollo_snoopy_drift: INCOMING_MISSIONS_PT[0],
  ingenuity_final_flight: INCOMING_MISSIONS_PT[1],
};

export function getMissions(lang: Language): Record<MissionId, MissionDefinition> {
  const inc = lang === 'en' ? INCOMING_MISSIONS_EN : INCOMING_MISSIONS_PT;
  return {
    opportunity_deep_journey: getOpportunityMission(lang),
    apollo_snoopy_drift: inc[0],
    ingenuity_final_flight: inc[1],
  };
}

export const MISSION_ORDER: MissionId[] = [
  'opportunity_deep_journey',
  'apollo_snoopy_drift',
  'ingenuity_final_flight',
];
