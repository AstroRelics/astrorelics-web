import React, { useState } from 'react';
import { Compass, MonitorOff } from 'lucide-react';
import { CELESTIAL_BODIES, CELESTIAL_BODY_ORDER } from '../../config/celestialBodies';
import { CelestialBodyId } from '../../types/experience';

export const WebGLFallbackScreen: React.FC = () => {
  const [selectedId, setSelectedId] = useState<CelestialBodyId>('earth');
  const activeBody = CELESTIAL_BODIES[selectedId];

  return (
    <main className="min-h-screen w-full bg-[#02040A] text-[#F4F7FB] flex flex-col justify-between p-6 sm:p-10">
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#08152C] border border-sky-400/40 flex items-center justify-center">
            <Compass className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider">Beyond the Mission</h1>
            <p className="text-xs text-slate-400">Modo Informativo de Compatibilidade</p>
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto w-full my-auto py-10">
        <div className="rounded-2xl bg-[#071124] border border-sky-400/30 p-6 sm:p-8 shadow-2xl">
          <div className="flex items-start gap-3 text-amber-300 bg-amber-950/30 border border-amber-400/30 rounded-xl p-4 mb-6">
            <MonitorOff className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed text-slate-200">
              <strong className="text-white block mb-0.5">
                Renderização 3D (WebGL) indisponível neste navegador
              </strong>
              Seu navegador ou dispositivo está com a aceleração gráfica WebGL desativada. Abaixo
              você pode consultar o catálogo interativo de destinos espaciais. Para visualizar os
              modelos 3D e a viagem em hiperespaço, ative a aceleração de hardware nas configurações
              do navegador.
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Destinos">
            {CELESTIAL_BODY_ORDER.map((id) => {
              const body = CELESTIAL_BODIES[id];
              const isSelected = id === selectedId;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedId(id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-display font-semibold transition-colors ${
                    isSelected
                      ? 'bg-sky-400 text-[#020611]'
                      : 'bg-[#0C1C38] text-slate-200 hover:bg-[#132B52]'
                  }`}
                >
                  {body.name}
                </button>
              );
            })}
          </div>

          <article className="border-t border-slate-800 pt-6">
            <span className="text-xs text-sky-400 font-medium">
              {activeBody.telemetry.classification}
            </span>
            <h2 className="font-display text-3xl font-bold mt-1">{activeBody.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{activeBody.subtitle}</p>
            <p className="text-sm sm:text-base text-slate-200 mt-4 leading-relaxed">
              {activeBody.description}
            </p>

            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-800/80 text-xs">
              <div className="bg-[#040A17] p-3.5 rounded-xl border border-slate-800/70">
                <dt className="text-slate-400">Raio Médio</dt>
                <dd className="text-white font-display font-semibold text-sm mt-1">
                  {activeBody.telemetry.meanRadius}
                </dd>
              </div>
              <div className="bg-[#040A17] p-3.5 rounded-xl border border-slate-800/70">
                <dt className="text-slate-400">Gravidade Superficial</dt>
                <dd className="text-white font-display font-semibold text-sm mt-1">
                  {activeBody.telemetry.gravity}
                </dd>
              </div>
              <div className="bg-[#040A17] p-3.5 rounded-xl border border-slate-800/70">
                <dt className="text-slate-400">Contexto Orbital</dt>
                <dd className="text-white font-display font-semibold text-sm mt-1">
                  {activeBody.telemetry.orbitalContext}
                </dd>
              </div>
            </dl>
          </article>
        </div>
      </section>

      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500">
        Beyond the Mission · Exploração Espacial Interativa
      </footer>
    </main>
  );
};
