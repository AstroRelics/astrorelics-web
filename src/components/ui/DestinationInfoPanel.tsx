import React, { useState } from 'react';
import {
  RotateCcw,
  Navigation,
  Move,
  Info,
  ArrowLeft,
  Sparkles,
  MapPin,
  History,
  Cpu,
  Award,
} from 'lucide-react';
import { SPACE_ARTIFACT_ORDER } from '../../config/spaceArtifacts';
import {
  CelestialBodyId,
  ExperienceState,
  SpaceArtifactId,
} from '../../types/experience';
import {
  getLocalizedArtifact,
  getLocalizedBody,
  useLanguage,
} from '../../utils/i18n';
import { LoadedCelestialAsset } from '../../utils/modelPreloader';
import { ArtifactCartoonIcon } from './ArtifactCartoonIcons';

interface DestinationInfoPanelProps {
  selectedId: CelestialBodyId;
  highlightedId: CelestialBodyId | null;
  activeArtifactId: SpaceArtifactId | null;
  experienceState: ExperienceState;
  loadedAsset: LoadedCelestialAsset | undefined;
  onResetOrientation: () => void;
  onTravelToHighlighted: (id: CelestialBodyId) => void;
  onSelectArtifact: (id: SpaceArtifactId) => void;
  onCloseArtifact: () => void;
  unidentifiedInvestigationMode?: boolean;
  unidentifiedSignalTitle?: string;
}

type ArtifactTab = 'overview' | 'history' | 'importance';

export const DestinationInfoPanel: React.FC<DestinationInfoPanelProps> = ({
  selectedId,
  highlightedId,
  activeArtifactId,
  experienceState,
  loadedAsset,
  onResetOrientation,
  onTravelToHighlighted,
  onSelectArtifact,
  onCloseArtifact,
  unidentifiedInvestigationMode = false,
  unidentifiedSignalTitle,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const [activeTab, setActiveTab] = useState<ArtifactTab>('overview');
  const currentBody = getLocalizedBody(selectedId, lang);
  const highlightedBody = highlightedId ? getLocalizedBody(highlightedId, lang) : null;
  const activeArtifact = activeArtifactId
    ? getLocalizedArtifact(activeArtifactId, lang)
    : null;
  const isTraveling = experienceState === 'traveling';

  if (unidentifiedInvestigationMode) {
    return (
      <div className="fixed bottom-0 inset-x-0 z-20 pointer-events-none px-4 pb-3.5 sm:px-7 sm:pb-5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          <div className="pointer-events-auto flex flex-wrap items-center gap-2.5">
            <div className="rounded-xl bg-[#07152D]/95 backdrop-blur-xl border border-amber-400/60 px-4 py-2.5 text-xs text-amber-100 flex items-center gap-2.5 shadow-[0_0_25px_rgba(245,158,11,0.25)]">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
              <div>
                <span className="font-display font-bold text-amber-300 uppercase tracking-wider text-[10px] block">
                  {isEn
                    ? 'Investigation Mode · Hidden Identity'
                    : 'Modo Investigação · Identidade Oculta'}
                </span>
                <span className="text-slate-100 font-medium">
                  {unidentifiedSignalTitle ??
                    (isEn ? 'Unidentified Signal' : 'Sinal Não Identificado')}{' '}
                  —{' '}
                  {isEn
                    ? 'Drag the 3D model in 360° and find the 3 glowing points.'
                    : 'Arraste o modelo 3D em 360° e procure os 3 pontos luminosos.'}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={isTraveling}
              onClick={onResetOrientation}
              className="h-10 px-3.5 rounded-xl bg-[#050C1A]/90 hover:bg-[#0D1F3D] border border-[#162847] hover:border-sky-400/40 text-xs font-medium text-sky-100 flex items-center gap-1.5 shadow-lg transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
              <span>{isEn ? 'Reset 3D angle' : 'Restaurar ângulo 3D'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-20 pointer-events-none px-4 pb-3.5 sm:px-7 sm:pb-5">
      <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
        {/* Se houver um Artefato 3D selecionado: exibe a Ficha Completa de Inspeção 3D e História */}
        {activeArtifact ? (
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
            {/* Botão esquerdo de retorno + instrução de rotação 360° */}
            <div className="pointer-events-auto flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                disabled={isTraveling}
                onClick={onCloseArtifact}
                className="h-10 px-4 rounded-xl bg-[#091A36]/95 hover:bg-[#102952] border border-sky-400/50 text-xs sm:text-sm font-display font-semibold text-white flex items-center gap-2 shadow-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-sky-400" />
                <span>
                  {isEn
                    ? `Back to ${getLocalizedBody(activeArtifact.relatedBodyId, lang).name}`
                    : `Voltar para ${getLocalizedBody(activeArtifact.relatedBodyId, lang).name}`}
                </span>
              </button>

              <button
                type="button"
                disabled={isTraveling}
                onClick={onResetOrientation}
                className="h-10 px-3.5 rounded-xl bg-[#050C1A]/90 hover:bg-[#0D1F3D] border border-[#162847] hover:border-sky-400/40 text-xs font-medium text-sky-100 flex items-center gap-1.5 shadow-lg transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                <span>{isEn ? 'Reset 3D angle' : 'Restaurar ângulo 3D'}</span>
              </button>

              <div className="rounded-xl bg-[#050C1A]/85 backdrop-blur-md border border-[#162847] px-3.5 py-2 text-xs text-slate-200 flex items-center gap-2 shadow-lg">
                <Move className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>
                  {isEn
                    ? 'Drag the 3D object in any direction to rotate it 360°'
                    : 'Arraste o objeto 3D em qualquer direção para girá-lo em 360°'}
                </span>
              </div>
            </div>

            {/* Painel principal de História, Importância e Especificações do Objeto 3D */}
            <section
              aria-label={
                isEn
                  ? `Details about ${activeArtifact.name}`
                  : `Detalhes sobre ${activeArtifact.name}`
              }
              className="pointer-events-auto w-full lg:max-w-xl rounded-2xl bg-[#050D1D]/92 backdrop-blur-xl border border-sky-400/40 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-fadeIn"
            >
              {/* Cabeçalho com Ícone Cartoonizado + Missão + Localização */}
              <div className="flex items-start gap-3.5">
                <div
                  className="w-14 h-14 rounded-2xl bg-[#081730] border-2 p-1.5 shrink-0 shadow-[0_0_20px_rgba(56,189,248,0.25)]"
                  style={{ borderColor: activeArtifact.accentColor }}
                >
                  <ArtifactCartoonIcon id={activeArtifact.id} className="w-full h-full" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-400/35 text-[10px] font-semibold uppercase tracking-wider text-sky-300">
                      {activeArtifact.mission}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {activeArtifact.year}
                    </span>
                  </div>

                  <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight mt-1">
                    {activeArtifact.name}
                  </h2>

                  <div className="flex items-center gap-1.5 text-[11px] text-sky-200/90 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{activeArtifact.locationLabel}</span>
                    <span className="text-slate-500 hidden sm:inline">·</span>
                    <span className="text-slate-400 font-mono text-[10px] hidden sm:inline">
                      {activeArtifact.coordinatesLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Abas de navegação: Descrição & Engenharia | História | Importância */}
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#030813] border border-slate-800/90 mt-3.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-display font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-[#0E254B] text-white border border-sky-400/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-sky-400" />
                  <span>{isEn ? 'Overview' : 'Descrição'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-display font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === 'history'
                      ? 'bg-[#0E254B] text-white border border-sky-400/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <History className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isEn ? 'History' : 'História'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('importance')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-display font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === 'importance'
                      ? 'bg-[#0E254B] text-white border border-sky-400/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isEn ? 'Importance' : 'Importância'}</span>
                </button>
              </div>

              {/* Conteúdo textual da aba ativa */}
              <div className="mt-3 text-xs sm:text-[13px] text-slate-200 leading-relaxed max-h-36 overflow-y-auto pr-1">
                {activeTab === 'overview' && <p>{activeArtifact.description}</p>}
                {activeTab === 'history' && <p>{activeArtifact.history}</p>}
                {activeTab === 'importance' && <p>{activeArtifact.importance}</p>}
              </div>

              {/* Grade de especificações técnicas reais */}
              <div className="mt-3.5 pt-3 border-t border-slate-800/90 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {activeArtifact.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="rounded-lg bg-[#081326]/90 border border-slate-800/80 px-2.5 py-1.5"
                  >
                    <div className="text-[10px] text-slate-400 truncate">{spec.label}</div>
                    <div className="text-[11px] font-semibold text-sky-100 mt-0.5 truncate">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          /* Visualização padrão quando explorando Terra, Lua ou Marte */
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <section
              aria-label={
                isEn
                  ? `Information about ${currentBody.name}`
                  : `Informações sobre ${currentBody.name}`
              }
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

                <button
                  type="button"
                  disabled={isTraveling}
                  onClick={onResetOrientation}
                  title={
                    isEn
                      ? 'Reset initial view orientation'
                      : 'Restaurar a orientação inicial da visualização'
                  }
                  className="shrink-0 h-8 px-3 rounded-lg bg-[#0A1933]/90 hover:bg-[#10264C] border border-sky-400/30 hover:border-sky-400/60 text-xs font-medium text-sky-100 flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                  <span>{isEn ? 'Reset orientation' : 'Restaurar orientação'}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-200/95 leading-relaxed mt-2.5">
                {currentBody.description}
              </p>

              <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-4">
                  <span>
                    <strong className="text-slate-400 font-normal">
                      {isEn ? 'Radius:' : 'Raio:'}
                    </strong>{' '}
                    {currentBody.telemetry.meanRadius}
                  </span>
                  <span>
                    <strong className="text-slate-400 font-normal">
                      {isEn ? 'Gravity:' : 'Gravidade:'}
                    </strong>{' '}
                    {currentBody.telemetry.gravity}
                  </span>
                </div>

                {loadedAsset?.source === 'provisional-sphere' && (
                  <span
                    title={
                      isEn
                        ? 'Procedural sphere active. Add the GLB file in 3d_models/ to replace it automatically.'
                        : 'Esfera procedural ativa. Adicione o arquivo GLB em 3d_models/ para substituí-la automaticamente.'
                    }
                    className="inline-flex items-center gap-1 text-[10px] text-sky-300/85 bg-sky-950/50 border border-sky-400/25 px-2 py-0.5 rounded"
                  >
                    <Info className="w-3 h-3 text-sky-400" />
                    {isEn ? 'Provisional sphere (GLB ready)' : 'Esfera provisória (pronta para GLB)'}
                  </span>
                )}
              </div>
            </section>

            <div className="flex flex-col items-stretch sm:items-end gap-2.5 pointer-events-auto">
              {highlightedBody && !isTraveling && (
                <div
                  role="region"
                  aria-live="polite"
                  className="rounded-xl bg-[#07162E]/92 backdrop-blur-md border border-sky-400/60 px-4 py-3 shadow-[0_0_25px_rgba(56,189,248,0.2)] flex items-center justify-between sm:justify-end gap-4 animate-fadeIn"
                >
                  <div>
                    <p className="text-[11px] text-sky-300 font-medium">
                      {isEn ? 'Focused destination:' : 'Destino em foco:'}{' '}
                      <strong className="text-white">{highlightedBody.name}</strong>
                    </p>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {isEn
                        ? 'Double-click the body or press the button to start travel.'
                        : 'Clique duas vezes no astro ou acione ao lado para iniciar a viagem.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onTravelToHighlighted(highlightedBody.id)}
                    className="shrink-0 h-8 px-3.5 rounded-lg bg-sky-400 hover:bg-sky-300 text-[#020611] font-display font-semibold text-xs flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>
                      {isEn
                        ? `Travel to ${highlightedBody.name}`
                        : `Viajar para ${highlightedBody.name}`}
                    </span>
                  </button>
                </div>
              )}

              <div className="rounded-full bg-[#050C1A]/82 backdrop-blur-md border border-[#162847] px-4 py-2 text-xs text-slate-200 flex items-center justify-center sm:justify-start gap-2.5 shadow-lg">
                <Move className="w-3.5 h-3.5 text-sky-400 shrink-0" aria-hidden="true" />
                <span>
                  {isEn ? (
                    <>
                      Click the <strong>Cartoon Pins</strong> (on worlds or drifting in space) to jump at light speed to the 3D object.
                    </>
                  ) : (
                    <>
                      Clique nos <strong>Pins Cartoonizados</strong> (nos astros ou à deriva no espaço) para saltar na velocidade da luz até o objeto 3D.
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Barra inferior fixa de Ícones Cartoonizados dos 5 Objetos Abandonados */}
        <div className="pointer-events-auto self-center w-full sm:w-auto overflow-x-auto no-scrollbar">
          <div
            role="group"
            aria-label={isEn ? 'NASA Relics & Space Objects' : 'Relíquias e Objetos Abandonados da NASA'}
            className="inline-flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[#040B18]/90 backdrop-blur-md border border-[#172B4D] shadow-[0_10px_32px_rgba(0,0,0,0.65)]"
          >
            <span className="hidden md:inline-flex items-center gap-1.5 pl-2.5 pr-1 text-[11px] font-display font-semibold uppercase tracking-wider text-sky-300/90">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              {isEn ? '3D Objects:' : 'Objetos 3D:'}
            </span>

            {SPACE_ARTIFACT_ORDER.map((id) => {
              const art = getLocalizedArtifact(id, lang);
              const isSelectedArt = activeArtifactId === id;
              const badgeTag =
                art.placementType === 'deep-space'
                  ? isEn
                    ? 'Drifting'
                    : 'À Deriva'
                  : art.relatedBodyId === 'moon'
                  ? isEn
                    ? 'Moon'
                    : 'Lua'
                  : isEn
                  ? 'Mars'
                  : 'Marte';

              return (
                <button
                  key={id}
                  type="button"
                  disabled={isTraveling}
                  onClick={() => onSelectArtifact(id)}
                  title={`${art.name} (${art.locationLabel})`}
                  className={`group relative flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                    isSelectedArt
                      ? 'bg-[#0E2752] border-sky-400 text-white shadow-[0_0_20px_rgba(56,189,248,0.35)] scale-[1.02]'
                      : 'bg-[#071327]/80 hover:bg-[#0C1E3B] border-slate-800/90 hover:border-sky-400/50 text-slate-200'
                  } ${isTraveling ? 'opacity-60 cursor-wait' : 'cursor-pointer'}`}
                >
                  <div className="w-7 h-7 rounded-lg bg-[#040A17] border border-slate-700/70 p-0.5 shrink-0 group-hover:scale-110 transition-transform">
                    <ArtifactCartoonIcon id={id} className="w-full h-full" />
                  </div>
                  <div className="pr-1">
                    <div className="text-xs font-display font-semibold leading-tight whitespace-nowrap">
                      {art.shortName}
                    </div>
                    <div className="text-[10px] text-sky-300/85 flex items-center gap-1 mt-0.5 whitespace-nowrap">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: art.accentColor }}
                      />
                      <span>{badgeTag}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
