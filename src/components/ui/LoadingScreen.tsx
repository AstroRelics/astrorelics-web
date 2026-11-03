import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface LoadingScreenProps {
  progress: number;
  statusLabel: string;
  errorMessage: string | null;
  onRetry: () => void;
  onContinueWithFallback: () => void;
  onFinishTransition?: () => void;
}

/**
 * Parâmetros geométricos exatos (no espaço 1672x941 do logo.png)
 * calibrados para o anel orbital inclinado e para a letra O central.
 */
const ORBIT_CX = 948;
const ORBIT_CY = 409;
const ORBIT_RX = 342;
const ORBIT_RY = 68;
const ORBIT_ANGLE_DEG = -26.8;
const ORBIT_ANGLE_RAD = (ORBIT_ANGLE_DEG * Math.PI) / 180;

// Anel secundário harmônico (arco externo direito do logo original)
const OUTER_ORBIT_CX = 1005;
const OUTER_ORBIT_CY = 385;
const OUTER_ORBIT_RX = 278;
const OUTER_ORBIT_RY = 62;
const OUTER_ORBIT_ANGLE_DEG = -31.5;

// Centro e raio exatos do anel circular da letra "O" em BEYOND
const LETTER_O_CX = 919;
const LETTER_O_CY = 485.8;
const LETTER_O_R = 52.8;

function getOrbitPoint(thetaRad: number) {
  const cosA = Math.cos(ORBIT_ANGLE_RAD);
  const sinA = Math.sin(ORBIT_ANGLE_RAD);
  const ux = ORBIT_RX * Math.cos(thetaRad);
  const uy = ORBIT_RY * Math.sin(thetaRad);

  return {
    x: ORBIT_CX + ux * cosA - uy * sinA,
    y: ORBIT_CY + ux * sinA + uy * cosA,
  };
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress,
  statusLabel,
  errorMessage,
  onRetry,
  onContinueWithFallback,
  onFinishTransition,
}) => {
  // Progresso visual suavizado para garantir que o giro do anel e a barra 0->100% sejam fluidos
  const [visualProgress, setVisualProgress] = useState<number>(0);
  // Fase de rotação contínua do anel (em radianos)
  const [orbitTheta, setOrbitTheta] = useState<number>(0);
  // Fade-out suave ao atingir 100%
  const [isExiting, setIsExiting] = useState<boolean>(false);

  const targetProgressRef = useRef<number>(progress);
  const finishTriggeredRef = useRef<boolean>(false);

  useEffect(() => {
    targetProgressRef.current = progress;
    if (progress < 100) {
      finishTriggeredRef.current = false;
      setIsExiting(false);
    }
  }, [progress]);

  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      // Velocidade angular do anel: ~1 volta completa a cada 2.1 segundos
      // Acelera sutilmente conforme o progresso se aproxima de 100%
      setOrbitTheta((prev) => (prev + dt * 3.05) % (Math.PI * 2));

      setVisualProgress((prev) => {
        const target = targetProgressRef.current;
        if (prev >= target) return prev;
        // Velocidade máxima ~42%/s para que mesmo em cache local a animação do logo dure ~2.4s
        const maxStep = dt * 42;
        const diff = target - prev;
        const step = Math.min(diff, Math.max(dt * 18, Math.min(maxStep, diff * dt * 5.5)));
        const next = Math.min(target, prev + step);
        return target >= 100 && next >= 99.5 ? 100 : next;
      });

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    if (
      !errorMessage &&
      progress >= 100 &&
      visualProgress >= 100 &&
      !finishTriggeredRef.current
    ) {
      finishTriggeredRef.current = true;
      const exitTimer = window.setTimeout(() => {
        setIsExiting(true);
      }, 180);
      const doneTimer = window.setTimeout(() => {
        onFinishTransition?.();
      }, 720);

      return () => {
        window.clearTimeout(exitTimer);
        window.clearTimeout(doneTimer);
      };
    }
  }, [errorMessage, progress, visualProgress, onFinishTransition]);

  const roundedProgress = Math.min(100, Math.max(0, Math.round(visualProgress)));

  // Posição (x, y) da estrela de 4 pontas que gira na ponta do anel orbital
  const starPos = getOrbitPoint(orbitTheta);
  // Segunda faísca diametralmente oposta no anel
  const secondaryPos = getOrbitPoint(orbitTheta + Math.PI);

  // Quando a estrela passa atrás do "Y" (entre ~192° e ~232°), atenua seu brilho para respeitar a oclusão 3D
  const normalizedDeg = (((orbitTheta * 180) / Math.PI) % 360 + 360) % 360;
  const isBehindLetterY = normalizedDeg > 192 && normalizedDeg < 232;
  const starScale = isBehindLetterY
    ? 0.35
    : 0.85 + 0.28 * Math.cos(orbitTheta); // Brilho máximo no ápice superior direito (theta ~ 0)
  const starOpacity = isBehindLetterY ? 0.2 : 0.98;

  // Offset normalizado (0..1000) para os traços SVG com pathLength="1000"
  // Em SVG <ellipse>, o ponto inicial t=0 fica em (+rx, 0), ou seja, theta = 0 rad.
  const normPhase = (orbitTheta / (Math.PI * 2)) * 1000;
  const oppositePhase = ((normPhase + 500) % 1000);

  // Comprimento do arco de progresso (0 a 1000) ao longo do anel orbital
  const orbitProgressLength = Math.max(15, (visualProgress / 100) * 1000);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Carregando Beyond the Mission"
      className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden select-none transition-opacity duration-500 ease-out ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Container principal com a arte oficial do logo e o anel orbital animado em SVG */}
      <div className="relative w-full max-w-[1180px] px-2 sm:px-6 flex flex-col items-center justify-center">
        <div className="relative w-full aspect-[1672/941] max-h-[72vh] flex items-center justify-center">
          <svg
            viewBox="0 0 1672 941"
            className="w-full h-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              {/* Filtro de brilho estelar para o anel giratório e a estrela de 4 pontas */}
              <filter id="orbitalGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="5.5" result="blur1" />
                <feGaussianBlur stdDeviation="14" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="softRingGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Gradiente luminoso para o anel de progresso */}
              <linearGradient id="orbitProgressGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#E2E8F0" stopOpacity="0.85" />
                <stop offset="85%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="100%" stopColor="#7DD3FC" stopOpacity="1" />
              </linearGradient>

              {/* ClipPaths no sistema local da elipse para separar metade traseira (v <= 0) e frontal (v >= 0) */}
              <clipPath id="orbitBackHalfClip">
                <rect x="-420" y="-160" width="840" height="160" />
              </clipPath>
              <clipPath id="orbitFrontHalfClip">
                <rect x="-420" y="0" width="840" height="160" />
              </clipPath>

              {/* Máscara para o anel circular da letra O, preservando o canal diagonal onde a órbita corta o O */}
              <mask id="letterOSplitMask">
                <rect x="830" y="400" width="180" height="180" fill="white" />
                <path
                  d="M 845 530 Q 925 495 1005 446"
                  fill="none"
                  stroke="black"
                  strokeWidth="17"
                  strokeLinecap="round"
                />
              </mask>

              {/* Vinheta suave nas bordas para fundir a imagem 1672x941 perfeitamente ao fundo #000000 */}
              <radialGradient id="edgeVignette" cx="50%" cy="50%" r="52%">
                <stop offset="78%" stopColor="black" stopOpacity="0" />
                <stop offset="100%" stopColor="black" stopOpacity="1" />
              </radialGradient>
            </defs>

            {/* 1. Imagem original de alta resolução do logo */}
            <image
              href="/logo.png"
              x="0"
              y="0"
              width="1672"
              height="941"
              preserveAspectRatio="xMidYMid meet"
            />

            {/* 2. Máscara de limpeza cirúrgica (#000000) que oculta o anel estático original da imagem
                   sem tocar na Lua nem nas letras de BEYOND THE MISSION */}
            <g fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round">
              {/* Caixa da estrela estática original no topo direito */}
              <rect x="1185" y="190" width="145" height="135" fill="#000000" stroke="none" />
              {/* Arco superior estático original */}
              <path
                d="M 820 434 L 860 405 L 900 377 L 940 350 L 980 327 L 1020 307 L 1060 289 L 1100 274 L 1140 262 L 1180 253 L 1220 248 L 1250 248"
                strokeWidth="28"
              />
              {/* Ramo descendente direito estático original (parando acima da letra N) */}
              <path
                d="M 1250 255 L 1243 290 L 1225 328 L 1202 362 L 1172 398 L 1145 424"
                strokeWidth="18"
              />
              <rect x="1110" y="415" width="50" height="22" fill="#000000" stroke="none" />
              <rect x="1110" y="430" width="32" height="28" fill="#000000" stroke="none" />
              {/* Arco inferior esquerdo estático (abaixo do Y até a entrada do O) */}
              <path
                d="M 640 562 L 670 575 L 710 573 L 750 563 L 790 550 L 830 535 L 858 524"
                strokeWidth="16"
              />
              {/* Canal interno da letra O e ponta direita do arco estático */}
              <path
                d="M 855 525 L 890 511 L 925 495 L 955 480 L 982 464 L 995 450 L 998 436"
                strokeWidth="10"
              />
              <rect x="988" y="432" width="20" height="25" fill="#000000" stroke="none" />
            </g>

            {/* 3. Anel secundário harmônico (arco externo direito girando suavemente atrás do N) */}
            <g transform={`translate(${OUTER_ORBIT_CX}, ${OUTER_ORBIT_CY}) rotate(${OUTER_ORBIT_ANGLE_DEG})`}>
              <ellipse
                cx="0"
                cy="0"
                rx={OUTER_ORBIT_RX}
                ry={OUTER_ORBIT_RY}
                pathLength={1000}
                fill="none"
                stroke="rgba(255, 255, 255, 0.06)"
                strokeWidth="1.1"
                strokeDasharray="460 540"
                strokeDashoffset={220}
              />
              <ellipse
                cx="0"
                cy="0"
                rx={OUTER_ORBIT_RX}
                ry={OUTER_ORBIT_RY}
                pathLength={1000}
                fill="none"
                stroke="rgba(226, 232, 240, 0.38)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeDasharray="160 840"
                strokeDashoffset={-normPhase}
              />
            </g>

            {/* 4. METADE TRASEIRA DO ANEL ORBITAL PRINCIPAL (passa atrás do Y e sobre a sombra da Lua) */}
            <g
              transform={`translate(${ORBIT_CX}, ${ORBIT_CY}) rotate(${ORBIT_ANGLE_DEG})`}
              clipPath="url(#orbitBackHalfClip)"
            >
              {/* Trilha orbital de base sutil */}
              <ellipse
                cx="0"
                cy="0"
                rx={ORBIT_RX}
                ry={ORBIT_RY}
                fill="none"
                stroke="rgba(255, 255, 255, 0.09)"
                strokeWidth="1.2"
              />

              {/* Preenchimento do Loading Progress ao longo do anel orbital */}
              <ellipse
                cx="0"
                cy="0"
                rx={ORBIT_RX}
                ry={ORBIT_RY}
                pathLength={1000}
                fill="none"
                stroke="url(#orbitProgressGrad)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeDasharray={`${orbitProgressLength} 1000`}
                strokeDashoffset={500}
                opacity="0.72"
              />

              {/* Cauda luminosa afilada do anel girando continuamente (Cometa Principal) */}
              <ellipse
                cx="0"
                cy="0"
                rx={ORBIT_RX}
                ry={ORBIT_RY}
                pathLength={1000}
                fill="none"
                stroke="rgba(255, 255, 255, 0.18)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeDasharray="340 660"
                strokeDashoffset={340 - normPhase}
              />
              <ellipse
                cx="0"
                cy="0"
                rx={ORBIT_RX}
                ry={ORBIT_RY}
                pathLength={1000}
                fill="none"
                stroke="rgba(255, 255, 255, 0.42)"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeDasharray="220 780"
                strokeDashoffset={220 - normPhase}
              />
              <ellipse
                cx="0"
                cy="0"
                rx={ORBIT_RX}
                ry={ORBIT_RY}
                pathLength={1000}
                fill="none"
                stroke="rgba(255, 255, 255, 0.78)"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeDasharray="115 885"
                strokeDashoffset={115 - normPhase}
                filter="url(#softRingGlow)"
              />
              <ellipse
                cx="0"
                cy="0"
                rx={ORBIT_RX}
                ry={ORBIT_RY}
                pathLength={1000}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="4.8"
                strokeLinecap="round"
                strokeDasharray="45 955"
                strokeDashoffset={45 - normPhase}
                filter="url(#orbitalGlow)"
              />

              {/* Arco secundário diametralmente oposto para manter o duplo feixe em rotação */}
              <ellipse
                cx="0"
                cy="0"
                rx={ORBIT_RX}
                ry={ORBIT_RY}
                pathLength={1000}
                fill="none"
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeDasharray="180 820"
                strokeDashoffset={180 - oppositePhase}
              />
              <ellipse
                cx="0"
                cy="0"
                rx={ORBIT_RX}
                ry={ORBIT_RY}
                pathLength={1000}
                fill="none"
                stroke="rgba(255, 255, 255, 0.65)"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeDasharray="70 930"
                strokeDashoffset={70 - oppositePhase}
              />
            </g>

            {/* 5. OCLUSORES DE PROFUNDIDADE 3D (Letras Y e N redesenhadas na posição exata para que a
                   metade traseira da órbita passe fisicamente por trás das letras) */}
            <polygon
              points="683,439 705,439 737.5,478 770,439 793,439 746,496 746,535 729,535 729,496"
              fill="#F1F3F6"
            />
            <polygon
              points="1062,439 1083,439 1148,511 1148,439 1165,439 1165,535 1145,535 1080,463 1080,535 1062,535"
              fill="#F1F3F6"
            />

            {/* 6. ANEL CIRCULAR DA LETRA "O" COM GIRO E PROGRESSO SINCRONIZADOS */}
            <g mask="url(#letterOSplitMask)">
              {/* Arco de progresso preenchendo o anel circular do O de 0% a 100% */}
              <circle
                cx={LETTER_O_CX}
                cy={LETTER_O_CY}
                r={LETTER_O_R}
                pathLength={100}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="15"
                strokeLinecap="butt"
                strokeDasharray={`${Math.max(4, visualProgress)} 100`}
                transform={`rotate(-90 ${LETTER_O_CX} ${LETTER_O_CY})`}
                opacity="0.95"
              />
              {/* Reflexo orbital girando continuamente sobre o anel da letra O */}
              <circle
                cx={LETTER_O_CX}
                cy={LETTER_O_CY}
                r={LETTER_O_R}
                pathLength={1000}
                fill="none"
                stroke="#BAE6FD"
                strokeWidth="15.5"
                strokeLinecap="round"
                strokeDasharray="160 840"
                strokeDashoffset={-normPhase}
                filter="url(#softRingGlow)"
                opacity="0.55"
              />
            </g>

            {/* 7. METADE FRONTAL DO ANEL ORBITAL PRINCIPAL (passa pela frente atravessando o canal da letra O) */}
            <g
              transform={`translate(${ORBIT_CX}, ${ORBIT_CY}) rotate(${ORBIT_ANGLE_DEG})`}
              clipPath="url(#orbitFrontHalfClip)"
            >
              {/* Trilha orbital frontal sutil */}
              <ellipse
                cx="0"
                cy="0"
                rx={ORBIT_RX}
                ry={ORBIT_RY}
                fill="none"
                stroke="rgba(255, 255, 255, 0.14)"
                strokeWidth="1.4"
              />

              {/* Preenchimento do Loading Progress no ramo frontal */}
              <ellipse
                cx="0"
                cy="0"
                rx={ORBIT_RX}
                ry={ORBIT_RY}
                pathLength={1000}
                fill="none"
                stroke="url(#orbitProgressGrad)"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeDasharray={`${orbitProgressLength} 1000`}
                strokeDashoffset={500}
                opacity="0.9"
              />

              {/* Cauda luminosa afilada do anel girando continuamente (Cometa Principal) */}
              <ellipse
                cx="0"
                cy="0"
                rx={ORBIT_RX}
                ry={ORBIT_RY}
                pathLength={1000}
                fill="none"
                stroke="rgba(255, 255, 255, 0.22)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="340 660"
                strokeDashoffset={340 - normPhase}
              />
              <ellipse
                cx="0"
                cy="0"
                rx={ORBIT_RX}
                ry={ORBIT_RY}
                pathLength={1000}
                fill="none"
                stroke="rgba(255, 255, 255, 0.52)"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeDasharray="220 780"
                strokeDashoffset={220 - normPhase}
              />
              <ellipse
                cx="0"
                cy="0"
                rx={ORBIT_RX}
                ry={ORBIT_RY}
                pathLength={1000}
                fill="none"
                stroke="rgba(255, 255, 255, 0.88)"
                strokeWidth="3.8"
                strokeLinecap="round"
                strokeDasharray="115 885"
                strokeDashoffset={115 - normPhase}
                filter="url(#softRingGlow)"
              />
              <ellipse
                cx="0"
                cy="0"
                rx={ORBIT_RX}
                ry={ORBIT_RY}
                pathLength={1000}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="5.2"
                strokeLinecap="round"
                strokeDasharray="45 955"
                strokeDashoffset={45 - normPhase}
                filter="url(#orbitalGlow)"
              />

              {/* Arco secundário diametralmente oposto */}
              <ellipse
                cx="0"
                cy="0"
                rx={ORBIT_RX}
                ry={ORBIT_RY}
                pathLength={1000}
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="2.0"
                strokeLinecap="round"
                strokeDasharray="180 820"
                strokeDashoffset={180 - oppositePhase}
              />
              <ellipse
                cx="0"
                cy="0"
                rx={ORBIT_RX}
                ry={ORBIT_RY}
                pathLength={1000}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeDasharray="70 930"
                strokeDashoffset={70 - oppositePhase}
                filter="url(#softRingGlow)"
              />
            </g>

            {/* 8. ESTRELA DE 4 PONTAS (FLARE DO LOGO) ORBITANDO JUNTO COM O ANEL */}
            <g
              transform={`translate(${starPos.x}, ${starPos.y}) scale(${starScale})`}
              opacity={starOpacity}
              filter="url(#orbitalGlow)"
            >
              {/* Halo difuso central */}
              <circle cx="0" cy="0" r="14" fill="rgba(255, 255, 255, 0.35)" />
              {/* Raios principais de difração horizontal e vertical (fiéis à estrela do logo) */}
              <path
                d="M 0 -58 Q 2.2 -6 8 0 Q 2.2 6 0 58 Q -2.2 6 -8 0 Q -2.2 -6 0 -58 Z"
                fill="#FFFFFF"
              />
              <path
                d="M -64 0 Q -6 2.2 0 8 Q 6 2.2 64 0 Q 6 -2.2 0 -8 Q -6 -2.2 -64 0 Z"
                fill="#FFFFFF"
              />
              {/* Raios diagonais sutis */}
              <path
                d="M -16 -16 Q -2 -1 0 0 Q 1 2 16 16 Q 2 1 0 0 Q -1 -2 -16 -16 Z"
                fill="rgba(255,255,255,0.8)"
              />
              <path
                d="M 16 -16 Q 1 -2 0 0 Q -2 1 -16 16 Q -1 2 0 0 Q 2 -1 16 -16 Z"
                fill="rgba(255,255,255,0.8)"
              />
              <circle cx="0" cy="0" r="5.5" fill="#FFFFFF" />
            </g>

            {/* Partícula luminosa secundária no polo oposto do anel */}
            <g
              transform={`translate(${secondaryPos.x}, ${secondaryPos.y})`}
              opacity={0.75}
              filter="url(#softRingGlow)"
            >
              <circle cx="0" cy="0" r="3.2" fill="#FFFFFF" />
              <path
                d="M 0 -18 L 1.5 0 L 0 18 L -1.5 0 Z M -20 0 L 0 1.5 L 20 0 L 0 -1.5 Z"
                fill="#FFFFFF"
              />
            </g>

            {/* Vinheta sutil nas extremidades */}
            <rect
              x="0"
              y="0"
              width="1672"
              height="941"
              fill="url(#edgeVignette)"
              pointerEvents="none"
            />
          </svg>
        </div>

        {/* HUD de Progresso Minimalista integrado abaixo de "THE MISSION" */}
        <div className="w-full max-w-md -mt-4 sm:-mt-8 px-4 flex flex-col items-center z-10">
          {!errorMessage ? (
            <div className="w-full">
              <div className="flex items-center justify-between text-[11px] sm:text-xs tracking-[0.2em] uppercase text-slate-300/90 mb-2.5 font-display">
                <span className="truncate max-w-[78%] text-left text-slate-300/80">
                  {statusLabel}
                </span>
                <span className="font-semibold text-white tabular-nums tracking-widest">
                  {String(roundedProgress).padStart(2, '0')}%
                </span>
              </div>

              {/* Barra de progresso inspirada no feixe orbital do logo */}
              <div
                role="progressbar"
                aria-valuenow={roundedProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                className="relative w-full h-[3px] rounded-full bg-white/10 overflow-visible"
              >
                <div
                  className="relative h-full rounded-full bg-gradient-to-r from-white/30 via-white to-sky-200 shadow-[0_0_16px_rgba(255,255,255,0.85)] transition-[width] duration-75 ease-linear"
                  style={{ width: `${Math.max(2, visualProgress)}%` }}
                >
                  {/* Estrela luminosa na ponta da barra de progresso */}
                  <span
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_12px_3px_rgba(255,255,255,0.95)]"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <p className="text-[10px] sm:text-[11px] tracking-[0.16em] uppercase text-slate-500 mt-3.5 text-center">
                Sincronizando modelos 3D · Iluminação Solar · Efemérides Orbitais
              </p>
            </div>
          ) : (
            <div
              role="alert"
              className="w-full mt-2 p-5 rounded-2xl bg-[#070B14]/95 border border-red-400/40 text-left backdrop-blur-md shadow-2xl"
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
                  className="h-9 px-4 rounded-lg bg-white hover:bg-slate-200 text-black font-display font-semibold text-xs flex items-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Tentar novamente</span>
                </button>

                <button
                  type="button"
                  onClick={onContinueWithFallback}
                  className="h-9 px-3.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/25 text-xs text-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Usar modelos provisórios
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
