export type CelestialBodyId = 'earth' | 'moon' | 'mars';

export type ExperienceState = 'loading' | 'exploring' | 'traveling' | 'error';

export type TravelPhase = 'idle' | 'acceleration' | 'cruise' | 'arrival';

export type ViewportTier = 'desktop' | 'tablet' | 'mobile';

export type OrbitalSlot = 'center' | 'left' | 'right';

export type SlotAssignmentMap = Record<CelestialBodyId, OrbitalSlot>;

export interface AtmosphereConfig {
  enabled: boolean;
  color: string;
  secondaryColor: string;
  intensity: number;
  fresnelPower: number;
  scale: number;
}

export interface MaterialTuningConfig {
  roughness: number;
  metalness: number;
  normalScale: number;
}

export interface BackgroundSlotMap {
  desktop: [number, number, number];
  tablet: [number, number, number];
  mobile: [number, number, number];
}

export interface CelestialBodyTelemetry {
  classification: string;
  meanRadius: string;
  gravity: string;
  orbitalContext: string;
  futureMissionsPreview: string;
}

export interface CelestialBodyConfig {
  id: CelestialBodyId;
  name: string;
  subtitle: string;
  description: string;
  /** Caminho principal do modelo 3D (GLB/GLTF) */
  modelPath: string;
  /** Caminhos alternativos verificados automaticamente para facilitar substituição */
  candidatePaths: string[];
  /** Raio normalizado em unidades de cena quando o corpo está selecionado em primeiro plano */
  foregroundRadius: number;
  /** Posição em primeiro plano para cada tipo de tela */
  foregroundPosition: BackgroundSlotMap;
  /** Raio normalizado em unidades de cena quando o corpo está ao fundo */
  backgroundRadius: number;
  /**
   * Posição 3D deste corpo quando OUTRO corpo está selecionado em primeiro plano.
   * As posições são calibradas para evitar sobreposição entre os planetas e os painéis da interface.
   */
  backgroundWhenSelectedIs: Partial<Record<CelestialBodyId, BackgroundSlotMap>>;
  /** Orientação inicial [pitch, yaw, roll] em radianos ao selecionar ou restaurar */
  initialRotation: [number, number, number];
  /** Inclinação axial em radianos */
  axialTilt: number;
  /** Velocidade de rotação sideral sutil quando em repouso */
  idleRotationSpeed: number;
  /** Configuração da camada atmosférica (Terra e Marte possuem; Lua não possui) */
  atmosphere: AtmosphereConfig;
  /** Ajustes de material PBR para evitar aparência plástica e preservar contraste com o Sol */
  materialTuning: MaterialTuningConfig;
  /** Dados contextuais e preparação estrutural para futuras missões e equipamentos */
  telemetry: CelestialBodyTelemetry;
}
