import React from 'react';
import { SpaceArtifactId } from '../../types/experience';

interface ArtifactCartoonIconProps {
  id: SpaceArtifactId;
  className?: string;
}

/**
 * Ícones vetorizados personalizados em estilo cartoon espacial (traços expressivos,
 * cores vibrantes e detalhes icônicos de cada equipamento real da NASA).
 */
export const ArtifactCartoonIcon: React.FC<ArtifactCartoonIconProps> = ({
  id,
  className = 'w-9 h-9',
}) => {
  switch (id) {
    case 'j002e3_s_ivb':
      // Foguete S-IVB Apollo 12 (J002E3) cartoonizado com padrão xadrez preto/branco, campânula J-2 e halo de "asteroide misterioso"
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          {/* Estrelinhas e órbita pontilhada de objeto à deriva */}
          <ellipse
            cx="32"
            cy="33"
            rx="27"
            ry="11"
            transform="rotate(-24 32 33)"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.65"
          />
          <circle cx="11" cy="16" r="2.2" fill="#FDE047" />
          <circle cx="53" cy="48" r="2" fill="#38BDF8" />

          {/* Corpo inclinado do estágio S-IVB */}
          <g transform="rotate(26 32 32)">
            {/* Campânula do motor J-2 na base */}
            <path
              d="M27 46 L23 55 H41 L37 46 Z"
              fill="#64748B"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path d="M25 51 H39" stroke="#CBD5E1" strokeWidth="1.8" />

            {/* Módulos APS laterais */}
            <rect
              x="16"
              y="36"
              width="5"
              height="9"
              rx="2"
              fill="#E2E8F0"
              stroke="#0F172A"
              strokeWidth="2.2"
            />
            <rect
              x="43"
              y="36"
              width="5"
              height="9"
              rx="2"
              fill="#E2E8F0"
              stroke="#0F172A"
              strokeWidth="2.2"
            />

            {/* Cilindro principal branco TiO2 */}
            <rect
              x="20"
              y="12"
              width="24"
              height="35"
              rx="3"
              fill="#F8FAFC"
              stroke="#0F172A"
              strokeWidth="2.6"
            />
            {/* Sombra lateral cartoon */}
            <rect x="37" y="13.5" width="5.5" height="32" fill="#CBD5E1" />

            {/* Anel superior IBM Instrument Unit preto/branco */}
            <rect x="21" y="13" width="22" height="5" fill="#1E293B" />
            <rect x="25" y="13" width="5" height="5" fill="#F8FAFC" />
            <rect x="35" y="13" width="5" height="5" fill="#F8FAFC" />

            {/* Faixa xadrez inferior da Apollo 12 */}
            <rect x="21" y="39" width="22" height="7" fill="#1E293B" />
            <rect x="24" y="40" width="4.5" height="5" fill="#F8FAFC" />
            <rect x="33.5" y="40" width="4.5" height="5" fill="#F8FAFC" />

            {/* Marcação USA vermelha/azul estilizada */}
            <rect x="29.5" y="21" width="5" height="14" rx="1.5" fill="#38BDF8" opacity="0.3" />
            <circle cx="32" cy="24.5" r="1.6" fill="#EF4444" />
            <circle cx="32" cy="28.5" r="1.6" fill="#0F172A" />
            <circle cx="32" cy="32.5" r="1.6" fill="#EF4444" />

            {/* Domo aberto no topo */}
            <ellipse
              cx="32"
              cy="12"
              rx="12"
              ry="3.2"
              fill="#F59E0B"
              stroke="#0F172A"
              strokeWidth="2.4"
            />
          </g>
        </svg>
      );

    case 'apollo_lrrr':
      // Retrorefletor Laser Apollo (LRRR) cartoonizado com grade de prismas brilhantes e raio laser verde/ciano
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          {/* Sombra lunar na base */}
          <ellipse cx="32" cy="55" rx="22" ry="4" fill="#0F172A" opacity="0.55" />

          {/* Pés de apoio lunares */}
          <path
            d="M16 44 L12 53 M48 44 L52 53"
            stroke="#94A3B8"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <ellipse
            cx="12"
            cy="53.5"
            rx="5"
            ry="2.3"
            fill="#E2E8F0"
            stroke="#0F172A"
            strokeWidth="2"
          />
          <ellipse
            cx="52"
            cy="53.5"
            rx="5"
            ry="2.3"
            fill="#E2E8F0"
            stroke="#0F172A"
            strokeWidth="2"
          />

          {/* Alça superior UHT */}
          <path
            d="M25 17 V12 H39 V17"
            stroke="#E2E8F0"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Moldura inclinada do painel LRRR */}
          <rect
            x="13"
            y="17"
            width="36"
            height="31"
            rx="4"
            fill="#E2E8F0"
            stroke="#0F172A"
            strokeWidth="2.6"
          />
          <rect
            x="16.5"
            y="20.5"
            width="29"
            height="24"
            rx="2"
            fill="#1E293B"
            stroke="#0F172A"
            strokeWidth="2"
          />

          {/* Matriz cartoon 3x3 de prismas corner-cube brilhantes */}
          {[21.5, 31, 40.5].map((cx) =>
            [25, 32.5, 40].map((cy) => (
              <g key={`${cx}-${cy}`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r="3.2"
                  fill="#38BDF8"
                  stroke="#BAE6FD"
                  strokeWidth="1.2"
                />
                <path d={`M${cx - 1.5} ${cy - 1} L${cx + 1.5} ${cy + 1.2}`} stroke="#FFFFFF" strokeWidth="1" />
              </g>
            ))
          )}

          {/* Prateleira lateral da bússola solar + nível de bolha verde */}
          <rect
            x="49"
            y="28"
            width="9"
            height="11"
            rx="2"
            fill="#CBD5E1"
            stroke="#0F172A"
            strokeWidth="2.2"
          />
          <circle cx="53.5" cy="33.5" r="2.6" fill="#4ADE80" stroke="#0F172A" strokeWidth="1.4" />

          {/* Feixe Laser vindo da Terra e refletindo nos prismas */}
          <path
            d="M6 6 L31 31 L56 7"
            stroke="#22D3EE"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="31" cy="31" r="4.5" fill="#A5F3FC" opacity="0.85" />
          <circle cx="31" cy="31" r="2.2" fill="#FFFFFF" />
        </svg>
      );

    case 'apollo_snoopy_lm':
      // Módulo Lunar "Snoopy" (Apollo 10) cartoonizado com base dourada Kapton, cabine facetada e janelas brilhantes
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          {/* Pernas de pouso abertas */}
          <path
            d="M18 40 L9 53 M46 40 L55 53 M24 44 L20 54 M40 44 L44 54"
            stroke="#94A3B8"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <ellipse cx="9" cy="54" rx="4.8" ry="2" fill="#FBBF24" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="55" cy="54" rx="4.8" ry="2" fill="#FBBF24" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="20" cy="55" rx="4" ry="1.7" fill="#FBBF24" stroke="#0F172A" strokeWidth="1.8" />
          <ellipse cx="44" cy="55" rx="4" ry="1.7" fill="#FBBF24" stroke="#0F172A" strokeWidth="1.8" />

          {/* Antena parabólica no topo */}
          <line x1="23" y1="15" x2="18" y2="9" stroke="#E2E8F0" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="17" cy="8.5" r="4" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />

          {/* Estágio de Descida Dourado (Kapton Foil) */}
          <rect
            x="16"
            y="34"
            width="32"
            height="13"
            rx="2.5"
            fill="#F59E0B"
            stroke="#0F172A"
            strokeWidth="2.6"
          />
          <rect x="21" y="34" width="22" height="13" fill="#FBBF24" />
          {/* Escadinha central */}
          <rect x="29" y="35" width="6" height="14" rx="1" fill="#334155" stroke="#0F172A" strokeWidth="1.8" />
          <path d="M30 38 H34 M30 41.5 H34 M30 45 H34" stroke="#E2E8F0" strokeWidth="1.5" />

          {/* Cabine de Subida ("Snoopy") */}
          <path
            d="M18 34 L15 23 L23 14 H41 L49 23 L46 34 Z"
            fill="#E2E8F0"
            stroke="#0F172A"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          {/* Janelas triangulares icônicas brilhando em ciano */}
          <polygon
            points="21,25 28,21 27,27"
            fill="#38BDF8"
            stroke="#0F172A"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <polygon
            points="43,25 36,21 37,27"
            fill="#38BDF8"
            stroke="#0F172A"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Escotilha frontal */}
          <rect
            x="28.5"
            y="26.5"
            width="7"
            height="6.5"
            rx="1.2"
            fill="#475569"
            stroke="#0F172A"
            strokeWidth="1.8"
          />
          {/* Propulsores RCS laterais */}
          <circle cx="14.5" cy="25" r="2.5" fill="#FBBF24" stroke="#0F172A" strokeWidth="1.8" />
          <circle cx="49.5" cy="25" r="2.5" fill="#FBBF24" stroke="#0F172A" strokeWidth="1.8" />
        </svg>
      );

    case 'opportunity_rover':
      // Rover Opportunity cartoonizado com "olhos" binoculares Pancam, asas solares azuis e 6 rodas
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          {/* Asas de painéis solares abertas em perspectiva */}
          <polygon
            points="6,34 22,26 42,26 58,34 46,42 18,42"
            fill="#1D4ED8"
            stroke="#0F172A"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Linhas de células fotovoltaicas */}
          <path d="M15 34 H49 M24 29 L20 40 M40 29 L44 40" stroke="#60A5FA" strokeWidth="1.5" opacity="0.8" />

          {/* Corpo térmico dourado (WEB) */}
          <rect
            x="22"
            y="33"
            width="20"
            height="10"
            rx="2"
            fill="#F59E0B"
            stroke="#0F172A"
            strokeWidth="2.4"
          />

          {/* Suspensão Rocker-Bogie e 3 rodas visíveis em primeiro plano */}
          <path
            d="M23 42 L15 50 M32 42 L32 52 M41 42 L49 50"
            stroke="#CBD5E1"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {[
            [15, 51],
            [32, 53],
            [49, 51],
          ].map(([wx, wy], i) => (
            <g key={i}>
              <circle cx={wx} cy={wy} r="5.2" fill="#334155" stroke="#0F172A" strokeWidth="2.4" />
              <circle cx={wx} cy={wy} r="2.2" fill="#94A3B8" />
            </g>
          ))}

          {/* Mastro Pancam e cabeça expressiva com 2 lentes grandes */}
          <rect
            x="29.5"
            y="16"
            width="5"
            height="17"
            fill="#F8FAFC"
            stroke="#0F172A"
            strokeWidth="2.2"
          />
          <rect
            x="20"
            y="9"
            width="24"
            height="10"
            rx="3.5"
            fill="#F8FAFC"
            stroke="#0F172A"
            strokeWidth="2.6"
          />
          {/* Olhos/lentes Pancam */}
          <circle cx="26.5" cy="14" r="3.2" fill="#0F172A" />
          <circle cx="25.7" cy="13.2" r="1.2" fill="#38BDF8" />
          <circle cx="37.5" cy="14" r="3.2" fill="#0F172A" />
          <circle cx="36.7" cy="13.2" r="1.2" fill="#38BDF8" />
        </svg>
      );

    case 'ingenuity_helicopter':
      // Helicóptero Ingenuity cartoonizado com rotores duplos, chapéu solar, cubo dourado e 4 pernas finas
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          {/* Halo de rotação das hélices */}
          <ellipse
            cx="32"
            cy="20"
            rx="25"
            ry="4.2"
            fill="#C084FC"
            opacity="0.22"
          />

          {/* Pernas finas de fibra de carbono e sapatas */}
          <path
            d="M25 40 L12 54 M39 40 L52 54 M27 42 L21 55 M37 42 L43 55"
            stroke="#CBD5E1"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="54" r="2.5" fill="#A855F7" stroke="#0F172A" strokeWidth="1.6" />
          <circle cx="52" cy="54" r="2.5" fill="#A855F7" stroke="#0F172A" strokeWidth="1.6" />
          <circle cx="21" cy="55" r="2.2" fill="#94A3B8" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="43" cy="55" r="2.2" fill="#94A3B8" stroke="#0F172A" strokeWidth="1.5" />

          {/* Mastro central dos rotores */}
          <rect
            x="29.5"
            y="12"
            width="5"
            height="17"
            fill="#94A3B8"
            stroke="#0F172A"
            strokeWidth="2.2"
          />

          {/* Rotor coaxial inferior */}
          <path
            d="M8 23 C19 19, 45 19, 56 23 C45 25, 19 25, 8 23 Z"
            fill="#334155"
            stroke="#0F172A"
            strokeWidth="2.2"
          />
          {/* Rotor coaxial superior */}
          <path
            d="M7 17 C19 13.5, 45 13.5, 57 17 C45 19, 19 19, 7 17 Z"
            fill="#475569"
            stroke="#0F172A"
            strokeWidth="2.2"
          />

          {/* Painel solar no topo + anteninha */}
          <polygon
            points="20,11 44,11 48,14 16,14"
            fill="#F59E0B"
            stroke="#0F172A"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <line x1="35" y1="6" x2="35" y2="11" stroke="#FDE047" strokeWidth="2.2" strokeLinecap="round" />

          {/* Cubo da fuselagem com lente de navegação */}
          <rect
            x="22"
            y="28"
            width="20"
            height="15"
            rx="3"
            fill="#F8FAFC"
            stroke="#0F172A"
            strokeWidth="2.6"
          />
          <rect x="24" y="30" width="16" height="11" rx="1.5" fill="#FBBF24" opacity="0.35" />
          <circle cx="32" cy="35.5" r="3.6" fill="#0F172A" />
          <circle cx="31" cy="34.5" r="1.4" fill="#38BDF8" />
        </svg>
      );
  }
};
