import { CelestialBodyId, SpaceArtifactId } from './experience';

export type EchoesSignalId = 'j002e3' | 'lrrr' | 'opportunity';

export type EchoesInvestigationStep =
  | 'locate_clues'
  | 'experiment'
  | 'interpret'
  | 'resolved';

export interface EchoesHotspot3D {
  id: string;
  signalId: EchoesSignalId;
  indexNumber: 1 | 2 | 3;
  label: string;
  shortLabel: string;
  /** Coordenadas 3D locais dentro do grupo normalizado do modelo (raio ~1.0) */
  position3D: [number, number, number];
  /** Offset [pitch, yaw] em radianos para orientar suavemente o modelo 3D ao clicar */
  targetRotation: [number, number];
  observation: string;
  archiveReaction: string;
  evidenceTitle: string;
  evidenceDetail: string;
  triggersAnalyzer?: boolean;
}

export interface EchoesHypothesis {
  id: string;
  label: string;
  description: string;
  isCorrect: boolean;
  /** Orientação construtiva exibida se o jogador escolher esta hipótese incorreta */
  specificGuidance: string;
}

export interface EchoesHintTriplet {
  /** Nível 1: Indica a região onde olhar */
  regionHint: string;
  /** Nível 2: Indica a ação a realizar */
  actionHint: string;
  /** Nível 3: Orientação direta para avançar */
  directHint: string;
}

export interface EchoesTimelineMilestone {
  id: string;
  solOrDate: string;
  title: string;
  shortSummary: string;
  expandedDetail: string;
  isPlannedBenchmark?: boolean;
}

export interface EchoesSignalConfig {
  id: EchoesSignalId;
  signalCode: string;
  unidentifiedTitle: string;
  unidentifiedLocation: string;
  reconstructedTitle: string;
  reconstructedMission: string;
  reconstructedYear: string;
  legacySentence: string;
  legacyMatchId: string;
  legacyMatchLabel: string;
  centralQuestion: string;
  relatedBodyId: CelestialBodyId;
  relatedArtifactId: SpaceArtifactId;
  accentColor: string;
  introArchiveMessage: string;
  hotspots: EchoesHotspot3D[];
  experimentTitle: string;
  experimentInstruction: string;
  experimentEducationalNote: string;
  interpretationPrompt: string;
  hypotheses: EchoesHypothesis[];
  narrativeReward: string;
  historicalRevealSummary: string;
  hintsByStep: Record<Exclude<EchoesInvestigationStep, 'resolved'>, EchoesHintTriplet>;
  timelineMilestones?: EchoesTimelineMilestone[];
}

export interface EchoesPersistedState {
  reconstructedSignals: EchoesSignalId[];
  discoveredClues: Record<EchoesSignalId, string[]>;
  completedExperiments: EchoesSignalId[];
  analyzerCompletedJ002: boolean;
  finalLegacyMatched: Record<EchoesSignalId, string | null>;
  isArchiveCompleted: boolean;
}
