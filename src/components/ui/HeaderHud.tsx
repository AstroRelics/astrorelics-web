import React from 'react';
import { Volume2, VolumeX, Compass, Sparkles } from 'lucide-react';
import { CELESTIAL_BODIES, CELESTIAL_BODY_ORDER } from '../../config/celestialBodies';
import { CelestialBodyId, ExperienceState, TravelPhase } from '../../types/experience';

interface HeaderHudProps {
  selectedId: CelestialBodyId;
  targetTravelId: CelestialBodyId | null;
  experienceState: ExperienceState;
  travelPhase: TravelPhase;
  audioEnabled: boolean;
  reducedMotion: boolean;
  onSelectDestination: (id: CelestialBodyId) => void;
  onToggleAudio: () => void;
}

const TRAVEL_PHASE_LABELS: Record<TravelPhase, string> = {
  idle: 'Órbita Estável',
  acceleration: 'Aceleração Orbital...',
  cruise: 'Em Viagem Interplanetária...',
  arrival: 'Aproximação Final...',
};

export const HeaderHud: React.FC<HeaderHudProps> = ({
  selectedId,
  targetTravelId,
  experienceState,
  travelPhase,
  audioEnabled,
  reducedMotion,
  onSelectDestination,
  onToggleAudio,
}) => {
  const isTraveling = experienceState === 'traveling';
  const activeSelectorId = isTraveling && targetTravelId ? targetTravelId : selectedId;

  const handleKeyDownSelector = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    if (isTraveling) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % CELESTIAL_BODY_ORDER.length;
      onSelectDestination(CELESTIAL_BODY_ORDER[nextIndex]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex =
        (currentIndex - 1 + CELESTIAL_BODY_ORDER.length) % CELESTIAL_BODY_ORDER.length;
      onSelectDestination(CELESTIAL_BODY_ORDER[prevIndex]);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-20 pointer-events-none px-4 pt-3.5 sm:px-7 sm:pt-5">
      <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Identidade do projeto no canto superior esquerdo */}
        <div className="flex items-center justify-between sm:justify-start gap-3 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#08152C]/90 border border-sky-400/35 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.15)]">
              <Compass className="w-4 h-4 text-sky-400" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-display text-base sm:text-lg font-semibold tracking-wider text-[#F4F7FB] leading-none">
                Beyond the Mission
              </h1>
              <p className="text-[11px] text-slate-400 tracking-wide mt-0.5">
                Exploração Espacial Interativa
              </p>
            </div>
          </div>

          {/* Controle de áudio visível no canto direito no mobile */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={onToggleAudio}
              aria-pressed={audioEnabled}
              aria-label={audioEnabled ? 'Desativar efeitos sonoros' : 'Ativar efeitos sonoros'}
              className={`h-9 px-3 rounded-full backdrop-blur-md border text-xs font-medium flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                audioEnabled
                  ? 'bg-[#0A1E3C]/85 border-sky-400/60 text-sky-200'
                  : 'bg-[#050C1A]/80 border-slate-800/80 text-slate-300 hover:border-slate-600'
              }`}
            >
              {audioEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-sky-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{audioEnabled ? 'Som ativo' : 'Som'}</span>
            </button>
          </div>
        </div>

        {/* Seletor de destinos: acessível por teclado e toque único no celular */}
        <nav
          aria-label="Seletor de destinos espaciais"
          className="pointer-events-auto self-center sm:self-auto w-full sm:w-auto flex justify-center"
        >
          <div
            role="group"
            aria-label="Destinos: Terra, Lua e Marte"
            className="inline-flex items-center p-1 rounded-full bg-[#050C1A]/85 backdrop-blur-md border border-[#162847] shadow-[0_8px_30px_rgba(0,0,0,0.55)]"
          >
            {CELESTIAL_BODY_ORDER.map((id, idx) => {
              const body = CELESTIAL_BODIES[id];
              const isCurrent = activeSelectorId === id;

              return (
                <button
                  key={id}
                  type="button"
                  disabled={isTraveling}
                  aria-current={isCurrent ? 'page' : undefined}
                  onClick={() => onSelectDestination(id)}
                  onKeyDown={(e) => handleKeyDownSelector(e, idx)}
                  className={`relative px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-display font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                    isCurrent
                      ? 'bg-[#0D254C] text-white border border-sky-400/60 shadow-[0_0_16px_rgba(56,189,248,0.25)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  } ${isTraveling ? 'cursor-wait opacity-80' : 'cursor-pointer'}`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        isCurrent ? 'bg-sky-400' : 'bg-slate-600'
                      }`}
                    />
                    {body.name}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Controles superiores direitos (Desktop / Tablet): status de viagem + áudio */}
        <div className="hidden sm:flex items-center gap-2.5 pointer-events-auto">
          {isTraveling && (
            <div
              role="status"
              aria-live="polite"
              className="px-3 py-1.5 rounded-full bg-[#08152C]/85 border border-sky-400/40 backdrop-blur-md text-xs text-sky-300 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" />
              <span>{TRAVEL_PHASE_LABELS[travelPhase]}</span>
            </div>
          )}

          {reducedMotion && (
            <span
              title="Preferência de movimento reduzido detectada no sistema"
              className="px-2.5 py-1 rounded-full bg-[#061020]/80 border border-slate-700/70 text-[11px] text-slate-300"
            >
              Movimento reduzido
            </span>
          )}

          <button
            type="button"
            onClick={onToggleAudio}
            aria-pressed={audioEnabled}
            aria-label={audioEnabled ? 'Desativar efeitos sonoros' : 'Ativar efeitos sonoros'}
            className={`h-9 px-3.5 rounded-full backdrop-blur-md border text-xs font-medium flex items-center gap-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
              audioEnabled
                ? 'bg-[#0A1E3C]/90 border-sky-400/60 text-sky-100 shadow-[0_0_16px_rgba(56,189,248,0.2)]'
                : 'bg-[#050C1A]/80 border-[#162847] text-slate-300 hover:text-white hover:border-sky-400/40'
            }`}
          >
            {audioEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-sky-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{audioEnabled ? 'Áudio ativo' : 'Áudio desativado'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
