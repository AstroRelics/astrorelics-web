import { CelestialBodyId, SpaceArtifactId } from './experience';

export type MissionId =
  | 'opportunity_deep_journey'
  | 'apollo_snoopy_drift'
  | 'ingenuity_final_flight';

export type MissionPathId = 'hematite' | 'lakebed' | 'crater';

export type MissionEnvironmentMood = 'normal' | 'dust' | 'freeze' | 'heat' | 'alert';

export interface MissionTelemetryState {
  /** Nível de bateria em porcentagem (0 a 100) */
  battery: number;
  /** Temperatura interna/ambiente em graus Celsius */
  temperatureC: number;
  /** Dados científicos acumulados em MB */
  scienceDataMb: number;
}

export interface MissionTelemetryDelta {
  batteryDelta?: number;
  temperatureDeltaC?: number;
  temperatureTargetC?: number;
  scienceDataDeltaMb?: number;
}

export interface MissionChoice {
  code: 'A' | 'B' | 'C';
  label: string;
  consequenceHint?: string;
  /** ID do próximo nó da missão (se não for decisão final) */
  nextNodeId?: string;
  /** ID do final desbloqueado (usado no Passo 4) */
  endingId?: string;
  telemetryDelta?: MissionTelemetryDelta;
}

export interface MissionNode {
  id: string;
  pathId: MissionPathId;
  stepNumber: 1 | 2 | 3 | 4;
  stepStageLabel: string;
  title: string;
  subtitle?: string;
  narrative: string;
  environmentMood?: MissionEnvironmentMood;
  environmentBadge?: string;
  choices: MissionChoice[];
}

export interface MissionPathConfig {
  id: MissionPathId;
  number: 1 | 2 | 3;
  title: string;
  focusBadge: string;
  description: string;
  accentColor: string;
  startNodeId: string;
  endingNumbers: number[];
}

export interface MissionEnding {
  id: string;
  number: number;
  pathId: MissionPathId;
  pathTitle: string;
  title: string;
  subtitle: string;
  epilogue: string;
  scientificVerdict: string;
  accentColor: string;
}

export interface MissionDefinition {
  id: MissionId;
  title: string;
  subtitle: string;
  missionBadge: string;
  locationLabel: string;
  yearLabel: string;
  relatedBodyId: CelestialBodyId;
  relatedArtifactId: SpaceArtifactId;
  accentColor: string;
  comingSoon?: boolean;
  introBriefing: string;
  initialTelemetry: MissionTelemetryState;
  paths: MissionPathConfig[];
  nodes: Record<string, MissionNode>;
  endings: Record<string, MissionEnding>;
  endingOrder: string[];
}
