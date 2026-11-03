import React from 'react';
import { Compass, RefreshCw, AlertTriangle } from 'lucide-react';

interface LoadingScreenProps {
  progress: number;
  statusLabel: string;
  errorMessage: string | null;
  onRetry: () => void;
  onContinueWithFallback: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress,
  statusLabel,
  errorMessage,
  onRetry,
  onContinueWithFallback,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Carregando Beyond the Mission"
      className="fixed inset-0 z-50 bg-[#02040A] flex flex-col items-center justify-center px-6 text-center select-none"
    >
      {/* Brilho radial sutil ao fundo */}
      <div
        className="pointer-events-none absolute w-[420px] h-[420px] rounded-full opacity-25 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(56,189,248,0.22) 0%, rgba(2,4,10,0) 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-[#08152C] border border-sky-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.2)] mb-5">
          <Compass className="w-7 h-7 text-sky-400 animate-pulse" />
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-wider text-[#F4F7FB]">
          Beyond the Mission
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
          Exploração Espacial Interativa · Terra, Lua e Marte
        </p>

        {!errorMessage ? (
          <div className="w-full mt-8">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span className="truncate max-w-[80%] text-left">{statusLabel}</span>
              <span className="font-display font-semibold text-sky-400">{progress}%</span>
            </div>

            <div
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="w-full h-1.5 rounded-full bg-[#0B172E] overflow-hidden border border-slate-800/80"
            >
              <div
                className="h-full bg-sky-400 transition-all duration-300 ease-out shadow-[0_0_12px_#38BDF8]"
                style={{ width: `${Math.max(4, progress)}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 mt-3">
              Sincronizando modelos 3D, iluminação solar e efemérides orbitais...
            </p>
          </div>
        ) : (
          <div
            role="alert"
            className="w-full mt-7 p-5 rounded-2xl bg-[#081326] border border-red-400/40 text-left"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-display font-semibold text-white">
                  Falha ao carregar recursos 3D
                </h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{errorMessage}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={onRetry}
                className="h-9 px-4 rounded-lg bg-sky-400 hover:bg-sky-300 text-[#020611] font-display font-semibold text-xs flex items-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tentar novamente</span>
              </button>

              <button
                type="button"
                onClick={onContinueWithFallback}
                className="h-9 px-3.5 rounded-lg bg-[#0D1E3A] hover:bg-[#132B52] border border-sky-400/30 text-xs text-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                Usar modelos provisórios
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
