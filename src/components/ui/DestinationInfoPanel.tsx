import React from 'react';
import { RotateCcw, Navigation, Move, Info } from 'lucide-react';
import { CELESTIAL_BODIES } from '../../config/celestialBodies';
import { CelestialBodyId, ExperienceState } from '../../types/experience';
import { LoadedCelestialAsset } from '../../utils/modelPreloader';

interface DestinationInfoPanelProps {
  selectedId: CelestialBodyId;
  highlightedId: CelestialBodyId | null;
  experienceState: ExperienceState;
  loadedAsset: LoadedCelestialAsset | undefined;
  onResetOrientation: () => void;
  onTravelToHighlighted: (id: CelestialBodyId) => void;
}

export const DestinationInfoPanel: React.FC<DestinationInfoPanelProps> = ({
  selectedId,
  highlightedId,
  experienceState,
  loadedAsset,
  onResetOrientation,
  onTravelToHighlighted,
}) => {
  const currentBody = CELESTIAL_BODIES[selectedId];
  const highlightedBody = highlightedId ? CELESTIAL_BODIES[highlightedId] : null;
  const isTraveling = experienceState === 'traveling';

  return (
    <div className="fixed bottom-0 inset-x-0 z-20 pointer-events-none px-4 pb-4 sm:px-7 sm:pb-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        {/* Painel discreto do corpo selecionado */}
        <section
          aria-label={`Informações sobre ${currentBody.name}`}
          className={`pointer-events-auto w-full lg:max-w-md rounded-2xl bg-[#050C1A]/82 backdrop-blur-md border border-[#162847] p-4 sm:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.65)] transition-opacity duration-300 ${
            isTraveling ? 'opacity-60' : 'opacity-100'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38BDF8]" />
                <span className="text-[11px] font-medium text-sky-300/90 tracking-wide">
                  {currentBody.telemetry.classification}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F7FB] tracking-tight mt-0.5">
                {currentBody.name}
              </h2>
            </div>

            {/* Botão para restaurar a orientação inicial da visualização */}
            <button
              type="button"
              disabled={isTraveling}
              onClick={onResetOrientation}
              title="Restaurar a orientação inicial da visualização"
              className="shrink-0 h-8 px-3 rounded-lg bg-[#0A1933]/90 hover:bg-[#10264C] border border-sky-400/30 hover:border-sky-400/60 text-xs font-medium text-sky-100 flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
              <span>Restaurar orientação</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-200/95 leading-relaxed mt-2.5">
            {currentBody.description}
          </p>

          {/* Metadados compactos e indicação de modelo */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-4">
              <span>
                <strong className="text-slate-400 font-normal">Raio:</strong>{' '}
                {currentBody.telemetry.meanRadius}
              </span>
              <span>
                <strong className="text-slate-400 font-normal">Gravidade:</strong>{' '}
                {currentBody.telemetry.gravity}
              </span>
            </div>

            {loadedAsset?.source === 'provisional-sphere' && (
              <span
                title="Esfera procedural ativa. Adicione o arquivo GLB em 3d_models/ para substituí-la automaticamente."
                className="inline-flex items-center gap-1 text-[10px] text-sky-300/85 bg-sky-950/50 border border-sky-400/25 px-2 py-0.5 rounded"
              >
                <Info className="w-3 h-3 text-sky-400" />
                Esfera provisória (pronta para GLB)
              </span>
            )}
          </div>
        </section>

        {/* Coluna direita: Alvo destacado ao fundo (se houver) + Instrução de navegação */}
        <div className="flex flex-col items-stretch sm:items-end gap-2.5 pointer-events-auto">
          {/* Cartão exibido quando o usuário dá um clique simples em um corpo ao fundo */}
          {highlightedBody && !isTraveling && (
            <div
              role="region"
              aria-live="polite"
              className="rounded-xl bg-[#07162E]/92 backdrop-blur-md border border-sky-400/60 px-4 py-3 shadow-[0_0_25px_rgba(56,189,248,0.2)] flex items-center justify-between sm:justify-end gap-4 animate-fadeIn"
            >
              <div>
                <p className="text-[11px] text-sky-300 font-medium">
                  Destino em foco: <strong className="text-white">{highlightedBody.name}</strong>
                </p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Clique duas vezes no astro ou acione ao lado para iniciar a viagem.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onTravelToHighlighted(highlightedBody.id)}
                className="shrink-0 h-8 px-3.5 rounded-lg bg-sky-400 hover:bg-sky-300 text-[#020611] font-display font-semibold text-xs flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Viajar para {highlightedBody.name}</span>
              </button>
            </div>
          )}

          {/* Instrução inicial obrigatória */}
          <div className="rounded-full bg-[#050C1A]/82 backdrop-blur-md border border-[#162847] px-4 py-2 text-xs text-slate-200 flex items-center justify-center sm:justify-start gap-2.5 shadow-lg">
            <Move className="w-3.5 h-3.5 text-sky-400 shrink-0" aria-hidden="true" />
            <span>Arraste para explorar. Clique duas vezes em outro destino para viajar.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
