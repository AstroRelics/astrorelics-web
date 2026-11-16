import { EchoesPersistedState, EchoesSignalId } from '../types/echoesMission';

const ECHOES_STORAGE_KEY = 'beyond_the_mission_echoes_state_v1';

export const DEFAULT_ECHOES_STATE: EchoesPersistedState = {
  reconstructedSignals: [],
  discoveredClues: {
    j002e3: [],
    lrrr: [],
    opportunity: [],
  },
  completedExperiments: [],
  analyzerCompletedJ002: false,
  finalLegacyMatched: {
    j002e3: null,
    lrrr: null,
    opportunity: null,
  },
  isArchiveCompleted: false,
};

export function loadEchoesState(): EchoesPersistedState {
  if (typeof window === 'undefined') return { ...DEFAULT_ECHOES_STATE };
  try {
    const raw = window.localStorage.getItem(ECHOES_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_ECHOES_STATE };
    const parsed = JSON.parse(raw) as Partial<EchoesPersistedState>;
    return {
      reconstructedSignals: Array.isArray(parsed.reconstructedSignals)
        ? parsed.reconstructedSignals
        : [],
      discoveredClues: {
        j002e3: Array.isArray(parsed.discoveredClues?.j002e3)
          ? parsed.discoveredClues!.j002e3
          : [],
        lrrr: Array.isArray(parsed.discoveredClues?.lrrr)
          ? parsed.discoveredClues!.lrrr
          : [],
        opportunity: Array.isArray(parsed.discoveredClues?.opportunity)
          ? parsed.discoveredClues!.opportunity
          : [],
      },
      completedExperiments: Array.isArray(parsed.completedExperiments)
        ? parsed.completedExperiments
        : [],
      analyzerCompletedJ002: Boolean(parsed.analyzerCompletedJ002),
      finalLegacyMatched: {
        j002e3: parsed.finalLegacyMatched?.j002e3 ?? null,
        lrrr: parsed.finalLegacyMatched?.lrrr ?? null,
        opportunity: parsed.finalLegacyMatched?.opportunity ?? null,
      },
      isArchiveCompleted: Boolean(parsed.isArchiveCompleted),
    };
  } catch {
    return { ...DEFAULT_ECHOES_STATE };
  }
}

export function saveEchoesState(next: EchoesPersistedState): EchoesPersistedState {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(ECHOES_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // noop
    }
  }
  return next;
}

export function resetEchoesState(): EchoesPersistedState {
  const fresh: EchoesPersistedState = {
    reconstructedSignals: [],
    discoveredClues: {
      j002e3: [],
      lrrr: [],
      opportunity: [],
    },
    completedExperiments: [],
    analyzerCompletedJ002: false,
    finalLegacyMatched: {
      j002e3: null,
      lrrr: null,
      opportunity: null,
    },
    isArchiveCompleted: false,
  };
  return saveEchoesState(fresh);
}

export function isSignalUnlocked(
  signalId: EchoesSignalId,
  state: EchoesPersistedState
): boolean {
  if (signalId === 'j002e3') return true;
  // Lua e Marte são liberados após identificar o J002E3
  return state.reconstructedSignals.includes('j002e3');
}
