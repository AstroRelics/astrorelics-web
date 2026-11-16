import {
  MissionId,
  MissionTelemetryDelta,
  MissionTelemetryState,
} from '../types/mission';

const STORAGE_KEY = 'beyond_the_mission_unlocked_endings_v1';

export type UnlockedEndingsMap = Partial<Record<MissionId, string[]>>;

export function loadUnlockedEndings(): UnlockedEndingsMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as UnlockedEndingsMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveUnlockedEnding(
  missionId: MissionId,
  endingId: string
): UnlockedEndingsMap {
  const current = loadUnlockedEndings();
  const list = current[missionId] ?? [];
  if (!list.includes(endingId)) {
    const updated: UnlockedEndingsMap = {
      ...current,
      [missionId]: [...list, endingId],
    };
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // noop
      }
    }
    return updated;
  }
  return current;
}

export function applyTelemetryDelta(
  current: MissionTelemetryState,
  delta?: MissionTelemetryDelta
): MissionTelemetryState {
  if (!delta) return current;

  const nextBattery = Math.max(
    1,
    Math.min(100, current.battery + (delta.batteryDelta ?? 0))
  );

  const nextTemperatureC =
    typeof delta.temperatureTargetC === 'number'
      ? delta.temperatureTargetC
      : Math.max(-95, Math.min(40, current.temperatureC + (delta.temperatureDeltaC ?? 0)));

  const nextScienceDataMb = Math.max(
    0,
    current.scienceDataMb + (delta.scienceDataDeltaMb ?? 0)
  );

  return {
    battery: nextBattery,
    temperatureC: nextTemperatureC,
    scienceDataMb: nextScienceDataMb,
  };
}
